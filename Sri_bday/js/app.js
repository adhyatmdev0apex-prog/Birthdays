/* =========================================================================
   APP.JS — Scene Engine, Entry Gate, Preloader, Universe Boot & Controls
   ========================================================================= */

(async function () {
  await (window.TRIBUTE_CONFIG_READY || Promise.resolve());
  const { el, sleep } = window.Tribute.Utils;
  const { Anim, AudioEngine, runPreloader, createScenes } = window.Tribute;
  const data = window.TEACHER_DATA;

  const appRoot = document.getElementById("app");
  const entryScreen = document.getElementById("entry-screen");
  const enterBtn = document.getElementById("enter-btn");
  const audioToggleBtn = document.getElementById("audio-toggle");
  const audioIcon = document.getElementById("audio-icon");
  const progressFill = document.getElementById("scene-progress-fill");
  const hudLeft = document.getElementById("hud-top-left");
  const hudBackBtn = document.getElementById("hud-back-btn");
  const hudChapterPill = document.getElementById("hud-chapter-pill");

  const audio = new AudioEngine();
  audio.setup();

  /* -----------------------------------------------------------------------
     SCENE ENGINE
     ----------------------------------------------------------------------- */
  class SceneEngine {
    constructor(root) {
      this.root = root;
      this.index = -1;
      this.nodes = [];
      this.defs = [];
    }

    mount(defs) {
      this.defs = defs;
      this.root.innerHTML = "";
      const stage = document.createElement("main");
      stage.className = "stage";
      stage.setAttribute("role", "region");
      stage.setAttribute("aria-label", "Birthday Tribute Stage");

      this.nodes = defs.map((def, i) => {
        const node = def.build();
        node.classList.add("behind");
        node.setAttribute("aria-hidden", "true");
        node.dataset.sceneIndex = String(i);
        stage.appendChild(node);
        return node;
      });

      this.root.appendChild(stage);
    }

    goTo(target) {
      if (target < 0 || target >= this.nodes.length) return false;
      this.index = target;

      this.nodes.forEach((scene, i) => {
        if (i === target) {
          scene.classList.add("active");
          scene.classList.remove("exit", "behind");
          scene.removeAttribute("aria-hidden");
          scene.scrollTop = 0;
        } else if (i < target) {
          scene.classList.remove("active", "behind");
          scene.classList.add("exit");
          scene.setAttribute("aria-hidden", "true");
        } else {
          scene.classList.remove("active", "exit");
          scene.classList.add("behind");
          scene.setAttribute("aria-hidden", "true");
        }
      });

      const def = this.defs[target];
      const activeNode = this.nodes[target];
      if (def) {
        Anim.setSky(def.mood);
        if (def.audioMode) audio.setMode(def.audioMode);
      }
      if (activeNode && typeof activeNode._onEnter === "function") {
        activeNode._onEnter();
      }

      updateHUD(target, this.nodes.length, def ? def.name : "");
      return true;
    }

    next() { return this.goTo(this.index + 1); }
    prev() { return this.goTo(this.index - 1); }

    replay() {
      this.nodes.forEach(node => {
        if (typeof node._reset === "function") node._reset();
      });
      audio.setMode("quiet");
      this.goTo(0);
    }
  }

  function updateHUD(index, total, name) {
    if (progressFill) {
      progressFill.style.width = `${((index + 1) / total) * 100}%`;
    }
    if (hudLeft) hudLeft.classList.add("visible");
    if (hudBackBtn) hudBackBtn.classList.toggle("hidden-btn", index <= 0);
    if (hudChapterPill) {
      hudChapterPill.textContent = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")} • ${name}`;
    }
  }

  const engine = new SceneEngine(appRoot);

  /* -----------------------------------------------------------------------
     SOUND & NAVIGATION CONTROLS
     ----------------------------------------------------------------------- */
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      audio.unlock();
      const muted = audio.toggleMute();
      audioIcon.textContent = muted ? "🔇" : "♪";
      audioToggleBtn.setAttribute("aria-label", muted ? "Unmute Sound" : "Mute Sound");
    });
  }

  if (hudBackBtn) {
    hudBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      engine.prev();
    });
  }

  window.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("shared-lightbox");
    if (lightbox && lightbox.classList.contains("open")) return;
    if (engine.index < 0) return;

    if (e.key === "ArrowRight") engine.next();
    else if (e.key === "ArrowLeft") engine.prev();
  });

  /* -----------------------------------------------------------------------
     UNIVERSE BOOT TERMINAL (from my-bros-birthday-main, spawns stars!)
     ----------------------------------------------------------------------- */
  async function runUniverseBootTerminal() {
    const overlay = el("div", "init-screen");
    const box = el("div", "terminal-box");
    const header = el("div", "terminal-header");
    header.innerHTML = `
      <span class="term-dot gold"></span>
      <span class="term-dot cream"></span>
      <span class="term-dot muted"></span>
      <span class="term-label">universe.boot</span>
    `;
    box.appendChild(header);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const seq = data.universeBoot || [];
    await sleep(240);

    for (let i = 0; i < seq.length; i++) {
      const item = seq[i];
      const p = el("p", "terminal-line");
      if (item.highlight) p.classList.add("highlight-line");
      box.appendChild(p);
      await Anim.type(p, `> ${item.text}`, item.speed || 22);
      for (let s = 0; s < (item.stars || 0); s++) Anim.addStar();
      await sleep(item.pause || 380);
    }

    const cursor = el("span", "cursor-blink");
    if (box.lastElementChild) box.lastElementChild.appendChild(cursor);
    await sleep(550);

    overlay.classList.add("fade-out");
    await sleep(750);
    overlay.remove();
  }

  /* -----------------------------------------------------------------------
     BOOT FLOW: Entry Gate -> Preloader -> Universe Boot -> Scene 01
     ----------------------------------------------------------------------- */
  Anim.generateStars(24);
  Anim.generateParticles(14);
  Anim.setSky("night");

  const sceneDefs = createScenes({ engine, audio, data });
  engine.mount(sceneDefs);

  let started = false;
  async function startExperience(e) {
    if (started) return;
    started = true;

    audio.unlock();
    audio.playBell(523.25, 2.0, 0.12, "sine");
    if (e && e.clientX) Anim.spawnSparkles(e.clientX, e.clientY, 22);

    if (entryScreen) {
      entryScreen.classList.add("fade-out");
      setTimeout(() => entryScreen.remove(), 680);
    }

    await runPreloader();
    await runUniverseBootTerminal();

    if (appRoot) {
      appRoot.style.visibility = "visible";
      appRoot.style.opacity = "1";
    }
    engine.goTo(0);
  }

  if (enterBtn) {
    enterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      startExperience(e);
    });
  }

  if (entryScreen) {
    entryScreen.addEventListener("click", startExperience);
  }
})();
