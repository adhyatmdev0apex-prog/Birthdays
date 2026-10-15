/**
 * Cinematic Audio Engine
 * Supports HTML5 audio files if present, plus a built-in Web Audio API
 * synthesizer for rich ambient chords, chime swells, gift tension drone,
 * music box birthday melody, and nocturnal finale notes.
 */
export class AudioEngine {
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
    this.activeMode = "quiet"; // "quiet", "reveal", "warm", "tension", "celebration", "finale"
  }

  setup() {
    try {
      fetch("assets/audio/piano.mp3", { method: "HEAD" }).then(res => {
        if (res.ok) {
          this.pianoAudio = new Audio("assets/audio/piano.mp3");
          this.pianoAudio.loop = true;
          this.pianoAudio.volume = 0.35;
          this.pianoAudio.preload = "auto";
        }
      }).catch(() => {});

      fetch("assets/audio/birthday-song.mp3", { method: "HEAD" }).then(res => {
        if (res.ok) {
          this.birthdayAudio = new Audio("assets/audio/birthday-song.mp3");
          this.birthdayAudio.loop = false;
          this.birthdayAudio.volume = 0.55;
          this.birthdayAudio.preload = "auto";
        }
      }).catch(() => {});
    } catch {}
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
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

    // Try HTML audio first
    if (this.pianoAudio) {
      const promise = this.pianoAudio.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // If file not available or blocked, rely on synthesized ambient soundscape
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
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
    }
    if (this.pianoAudio) this.pianoAudio.muted = this.isMuted;
    if (this.birthdayAudio) this.birthdayAudio.muted = this.isMuted;
    return this.isMuted;
  }

  // Synthesized celestial bell tone
  playBell(freq, duration = 2.4, gainLevel = 0.12, type = "sine") {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {}
  }

  // Beginning / Ambient chord cycle
  startSynthesizedAmbient() {
    if (!this.ctx || this.ambientTimer) return;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00]  // G7
    ];
    let chordIdx = 0;

    const playNextChord = () => {
      if (this.activeMode === "tension") return;
      const notes = chords[chordIdx % chords.length];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.isMuted && this.activeMode !== "tension") {
            const vol = this.activeMode === "reveal" ? 0.16 : 0.08;
            this.playBell(freq, 3.8, vol, "triangle");
            // Soft sub octave
            this.playBell(freq * 0.5, 4.2, vol * 0.4, "sine");
          }
        }, idx * 240);
      });
      chordIdx++;
      const nextDelay = this.activeMode === "warm" ? 4200 : 5400;
      this.ambientTimer = setTimeout(playNextChord, nextDelay);
    };

    playNextChord();
  }

  setMode(mode) {
    this.activeMode = mode;
    this.ensureContext();

    if (mode === "quiet") {
      this.stopTensionDrone();
      this.stopMelody();
      if (this.pianoAudio) this.pianoAudio.volume = 0.35;
    } else if (mode === "reveal") {
      // Shimmering crescendo chimes
      const revealNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      revealNotes.forEach((f, i) => {
        setTimeout(() => this.playBell(f, 3.0, 0.14, "sine"), i * 140);
      });
      if (this.pianoAudio) this.pianoAudio.volume = 0.45;
    } else if (mode === "warm") {
      if (this.pianoAudio) this.pianoAudio.volume = 0.38;
    } else if (mode === "tension") {
      // Brief silence, deep tension hum
      if (this.pianoAudio) this.pianoAudio.volume = 0.08;
      this.startTensionDrone();
    } else if (mode === "celebration") {
      this.stopTensionDrone();
      if (this.pianoAudio) this.fadeOut(this.pianoAudio, 800);
      this.playBirthdaySong();
    } else if (mode === "finale") {
      this.stopTensionDrone();
      this.stopMelody();
      // Gentle soft night chords
      if (this.pianoAudio) {
        this.pianoAudio.currentTime = 0;
        this.pianoAudio.volume = 0.22;
        this.pianoAudio.play().catch(() => {});
      }
      setTimeout(() => {
        [261.63, 329.63, 392.00].forEach((f, i) => {
          setTimeout(() => this.playBell(f, 4.5, 0.06, "sine"), i * 350);
        });
      }, 500);
    }
  }

  startTensionDrone() {
    if (!this.ctx || this.droneOsc) return;
    try {
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.droneOsc.type = "sine";
      this.droneOsc.frequency.setValueAtTime(65.41, this.ctx.currentTime); // Low C2
      this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.droneGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.2);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start();
    } catch {}
  }

  stopTensionDrone() {
    if (this.droneOsc && this.ctx) {
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.droneOsc) {
            this.droneOsc.stop();
            this.droneOsc.disconnect();
            this.droneOsc = null;
          }
        }, 500);
      } catch {}
    }
  }

  playBirthdaySong() {
    this.ensureContext();
    this.unlocked = true;
    this.stopMelody();

    // Try custom audio file if available
    let customPlayed = false;
    if (this.birthdayAudio && this.unlocked) {
      this.birthdayAudio.currentTime = 0;
      this.birthdayAudio.volume = 0.6;
      const p = this.birthdayAudio.play();
      if (p !== undefined) {
        p.then(() => { customPlayed = true; }).catch(() => {});
      }
    }

    // Play charming music-box / celeste synthesis of "Happy Birthday"
    const fallbackTimer = setTimeout(() => {
      if (customPlayed) return;
      this.playSynthesizedBirthdayMelody();
    }, 200);
    this.melodyTimers.push(fallbackTimer);
  }

  playSynthesizedBirthdayMelody() {
    if (!this.ctx || this.isMuted) return;
    // Melody notes: [freq, duration in seconds, delay in seconds]
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;
    const score = [
      [C4, 0.35, 0.0],  [C4, 0.25, 0.4],  [D4, 0.6, 0.7],  [C4, 0.6, 1.4],  [F4, 0.6, 2.1],  [E4, 1.1, 2.8],
      [C4, 0.35, 4.2],  [C4, 0.25, 4.6],  [D4, 0.6, 4.9],  [C4, 0.6, 5.6],  [G4, 0.6, 6.3],  [F4, 1.1, 7.0],
      [C4, 0.35, 8.4],  [C4, 0.25, 8.8],  [C5, 0.6, 9.1],  [A4, 0.6, 9.8],  [F4, 0.6, 10.5], [E4, 0.6, 11.2], [D4, 1.1, 11.9],
      [Bb4, 0.35, 13.3],[Bb4, 0.25, 13.7],[A4, 0.6, 14.0], [F4, 0.6, 14.7], [G4, 0.6, 15.4], [F4, 1.6, 16.1]
    ];

    this.stopMelody();
    score.forEach(([freq, dur, delay]) => {
      const timer = setTimeout(() => {
        if (!this.isMuted && this.activeMode === "celebration") {
          this.playBell(freq, dur * 1.5, 0.16, "sine");
          // Warm harmonic chime
          this.playBell(freq * 2, dur * 0.8, 0.04, "triangle");
        }
      }, delay * 1000);
      this.melodyTimers.push(timer);
    });
  }

  stopMelody() {
    if (this.melodyTimers && this.melodyTimers.length > 0) {
      this.melodyTimers.forEach(t => clearTimeout(t));
      this.melodyTimers = [];
    }
    if (this.birthdayAudio) {
      try {
        this.birthdayAudio.pause();
        this.birthdayAudio.currentTime = 0;
      } catch {}
    }
  }

  fadeOut(audio, ms = 900) {
    if (!audio) return;
    const start = audio.volume;
    const steps = 15;
    const step = start / steps;
    let n = 0;
    const timer = setInterval(() => {
      n++;
      audio.volume = Math.max(0, start - step * n);
      if (n >= steps) {
        clearInterval(timer);
        audio.pause();
      }
    }, ms / steps);
  }
}
