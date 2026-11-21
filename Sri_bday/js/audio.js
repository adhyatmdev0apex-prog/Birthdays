/* =========================================================================
   AUDIO.JS — Hybrid Cinematic Audio Engine
   Plays local piano.mp3 & birthday.mp3 with smooth crossfading, paired with
   Web Audio API chimes, subtle tension hum, and music-box birthday fallback.
   ========================================================================= */

window.Tribute = window.Tribute || {};

class AudioEngine {
  constructor() {
    this.unlocked = false;
    this.isMuted = false;
    this.ctx = null;
    this.masterGain = null;
    this.ambientTimer = null;
    this.melodyTimers = [];
    this.droneOsc = null;
    this.droneGain = null;
    this.pianoAudio = null;
    this.birthdayAudio = null;
    this.activeMode = "quiet";
  }

  setup() {
    this.pianoAudio = document.getElementById("piano");
    this.birthdayAudio = document.getElementById("birthdaySong");

    if (this.pianoAudio) {
      this.pianoAudio.loop = true;
      this.pianoAudio.volume = 0.42;
    }
    if (this.birthdayAudio) {
      this.birthdayAudio.loop = false;
      this.birthdayAudio.volume = 0.65;
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.38, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    this.ensureContext();

    if (this.pianoAudio) {
      this.pianoAudio.muted = this.isMuted;
      this.pianoAudio.volume = 0.42;
      const p = this.pianoAudio.play();
      if (p !== undefined) {
        p.catch(() => {
          this.startSynthesizedAmbient();
        });
      }
    } else {
      this.startSynthesizedAmbient();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.38, this.ctx.currentTime);
    }
    if (this.pianoAudio) this.pianoAudio.muted = this.isMuted;
    if (this.birthdayAudio) this.birthdayAudio.muted = this.isMuted;
    return this.isMuted;
  }

  playBell(freq, duration = 2.2, gainLevel = 0.11, type = "sine") {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1500, this.ctx.currentTime);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0008, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {}
  }

  startSynthesizedAmbient() {
    if (!this.ctx || this.ambientTimer) return;
    const chords = [
      [261.63, 329.63, 392.00, 493.88],
      [220.00, 261.63, 329.63, 392.00],
      [174.61, 220.00, 261.63, 329.63],
      [196.00, 246.94, 293.66, 392.00]
    ];
    let idx = 0;

    const tick = () => {
      if (this.activeMode !== "tension" && this.activeMode !== "celebration") {
        const notes = chords[idx % chords.length];
        notes.forEach((f, i) => {
          setTimeout(() => {
            if (!this.isMuted && this.activeMode !== "tension" && this.activeMode !== "celebration") {
              this.playBell(f, 3.6, 0.075, "triangle");
            }
          }, i * 240);
        });
        idx++;
      }
      this.ambientTimer = setTimeout(tick, 5000);
    };
    tick();
  }

  setMode(mode) {
    this.activeMode = mode;
    this.ensureContext();

    if (mode === "quiet" || mode === "warm") {
      this.stopTensionDrone();
      this.stopMelody();
      if (this.pianoAudio) {
        this.pianoAudio.muted = this.isMuted;
        this.pianoAudio.volume = mode === "warm" ? 0.44 : 0.36;
        if (this.unlocked && this.pianoAudio.paused) {
          this.pianoAudio.play().catch(() => {});
        }
      }
    } else if (mode === "reveal") {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      notes.forEach((f, i) => {
        setTimeout(() => this.playBell(f, 2.8, 0.12, "sine"), i * 130);
      });
      if (this.pianoAudio) this.pianoAudio.volume = 0.46;
    } else if (mode === "tension") {
      if (this.pianoAudio) this.pianoAudio.volume = 0.1;
      this.startTensionDrone();
    } else if (mode === "celebration") {
      this.stopTensionDrone();
      if (this.pianoAudio && !this.pianoAudio.paused) {
        this.fadeOut(this.pianoAudio, 750);
      }
      this.playBirthdaySong();
    } else if (mode === "finale") {
      this.stopTensionDrone();
      if (this.birthdayAudio && !this.birthdayAudio.paused) {
        this.fadeOut(this.birthdayAudio, 900);
      }
      this.stopMelody(false);
      if (this.pianoAudio && this.unlocked) {
        this.pianoAudio.muted = this.isMuted;
        this.pianoAudio.volume = 0.28;
        this.pianoAudio.play().catch(() => {});
      }
      [261.63, 329.63, 392.00].forEach((f, i) => {
        setTimeout(() => this.playBell(f, 4.0, 0.065, "sine"), 350 + i * 320);
      });
    }
  }

  startTensionDrone() {
    if (!this.ctx || this.droneOsc) return;
    try {
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.droneOsc.type = "sine";
      this.droneOsc.frequency.setValueAtTime(65.41, this.ctx.currentTime);
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0.055, this.ctx.currentTime + 1.1);
      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start();
    } catch {}
  }

  stopTensionDrone() {
    if (this.droneOsc && this.ctx) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.35);
        const oscRef = this.droneOsc;
        this.droneOsc = null;
        setTimeout(() => {
          try {
            oscRef.stop();
            oscRef.disconnect();
          } catch {}
        }, 420);
      } catch {}
    }
  }

  playBirthdaySong() {
    this.ensureContext();
    this.stopMelody();

    if (this.birthdayAudio) {
      this.birthdayAudio.currentTime = 0;
      this.birthdayAudio.muted = this.isMuted;
      this.birthdayAudio.volume = 0.65;
      const p = this.birthdayAudio.play();
      if (p !== undefined) {
        p.catch(() => {
          this.playSynthesizedBirthdayMelody();
        });
        return;
      }
    }
    this.playSynthesizedBirthdayMelody();
  }

  playSynthesizedBirthdayMelody() {
    if (!this.ctx || this.isMuted) return;
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;
    const score = [
      [C4, 0.35, 0.0], [C4, 0.25, 0.4], [D4, 0.6, 0.7], [C4, 0.6, 1.4], [F4, 0.6, 2.1], [E4, 1.1, 2.8],
      [C4, 0.35, 4.2], [C4, 0.25, 4.6], [D4, 0.6, 4.9], [C4, 0.6, 5.6], [G4, 0.6, 6.3], [F4, 1.1, 7.0],
      [C4, 0.35, 8.4], [C4, 0.25, 8.8], [C5, 0.6, 9.1], [A4, 0.6, 9.8], [F4, 0.6, 10.5], [E4, 0.6, 11.2], [D4, 1.1, 11.9],
      [Bb4, 0.35, 13.3], [Bb4, 0.25, 13.7], [A4, 0.6, 14.0], [F4, 0.6, 14.7], [G4, 0.6, 15.4], [F4, 1.6, 16.1]
    ];

    score.forEach(([freq, dur, delay]) => {
      const t = setTimeout(() => {
        if (!this.isMuted && this.activeMode === "celebration") {
          this.playBell(freq, dur * 1.45, 0.15, "sine");
          this.playBell(freq * 2, dur * 0.75, 0.035, "triangle");
        }
      }, delay * 1000);
      this.melodyTimers.push(t);
    });
  }

  stopMelody(stopAudioFile = true) {
    if (this.melodyTimers.length) {
      this.melodyTimers.forEach(t => clearTimeout(t));
      this.melodyTimers = [];
    }
    if (stopAudioFile && this.birthdayAudio) {
      try {
        this.birthdayAudio.pause();
        this.birthdayAudio.currentTime = 0;
      } catch {}
    }
  }

  fadeOut(audio, ms = 850) {
    if (!audio) return;
    const start = audio.volume;
    const steps = 14;
    let n = 0;
    const iv = setInterval(() => {
      n++;
      audio.volume = Math.max(0, start * (1 - n / steps));
      if (n >= steps) {
        clearInterval(iv);
        audio.pause();
        audio.volume = start;
      }
    }, ms / steps);
  }
}

window.Tribute.AudioEngine = AudioEngine;
