/* =========================================================================
   ANIMATIONS.JS — Sky, Clouds, Crescent Moon, Stars, Sparkles, Confetti & Fireworks
   ========================================================================= */

window.Tribute = window.Tribute || {};

window.Tribute.Anim = {
  type(element, text, speed = 24) {
    return new Promise(resolve => {
      let i = 0;
      element.textContent = "";
      let lastTime = performance.now();
      const tick = (now) => {
        if (now - lastTime >= speed) {
          i++;
          element.textContent = text.slice(0, i);
          lastTime = now;
        }
        if (i < text.length) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  },

  addStar() {
    const container = document.getElementById("stars");
    if (!container) return;
    const s = document.createElement("span");
    s.className = "star";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--sz", `${(1.2 + Math.random() * 2.1).toFixed(1)}px`);
    s.style.setProperty("--op", (0.25 + Math.random() * 0.72).toFixed(2));
    s.style.setProperty("--dur", `${2.4 + Math.random() * 3.8}s`);
    s.style.setProperty("--del", `${(Math.random() * 2).toFixed(2)}s`);
    container.appendChild(s);
  },

  generateStars(count = 64) {
    const container = document.getElementById("stars");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) this.addStar();
  },

  generateParticles(count = 14) {
    const container = document.getElementById("particles");
    if (!container) return;
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "dust-mote";
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty("--speed", `${11 + Math.random() * 12}s`);
      p.style.setProperty("--drift", `${(Math.random() * 36 - 18).toFixed(0)}px`);
      p.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
      frag.appendChild(p);
    }
    container.appendChild(frag);
  },

  showClouds(count = 5) {
    const layer = document.getElementById("cloud-layer");
    if (!layer || layer.children.length > 0) return;
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "cloud";
      c.style.top = `${8 + Math.random() * 36}vh`;
      c.style.width = `${170 + Math.random() * 110}px`;
      c.style.animationDuration = `${34 + Math.random() * 26}s`;
      c.style.animationDelay = `${-(Math.random() * 20).toFixed(1)}s`;
      c.style.opacity = (0.35 + Math.random() * 0.4).toFixed(2);
      layer.appendChild(c);
    }
  },

  clearClouds() {
    const layer = document.getElementById("cloud-layer");
    if (layer) layer.innerHTML = "";
  },

  setSky(mood) {
    const sky = document.getElementById("sky-gradient");
    const moon = document.getElementById("moon-layer");
    if (!sky) return;

    const SKIES = {
      morning: "linear-gradient(180deg, #07152b 0%, #173459 48%, #2e3b60 100%)",
      sunset: "linear-gradient(180deg, #0b1224 0%, #2a244f 52%, #593b42 100%)",
      warm: "radial-gradient(circle at 50% 26%, #222847 0%, #10172b 52%, #050812 100%)",
      golden: "radial-gradient(circle at 50% 24%, #2d2638 0%, #15192c 52%, #050813 100%)",
      night: "linear-gradient(180deg, #020510 0%, #081325 56%, #02040a 100%)"
    };

    sky.style.background = SKIES[mood] || SKIES.night;
    if (moon) moon.classList.toggle("visible", mood === "night");
    if (mood === "morning" || mood === "sunset") this.showClouds(5);
    else this.clearClouds();
  },

  spawnSparkles(x, y, count = 26) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "sparkle-particle";
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = 36 + Math.random() * 86;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--tx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
      spark.style.setProperty("--ty", `${(Math.sin(angle) * dist).toFixed(1)}px`);
      spark.style.setProperty("--size", `${(3 + Math.random() * 4.5).toFixed(1)}px`);
      spark.style.setProperty("--dur", `${(580 + Math.random() * 540).toFixed(0)}ms`);
      frag.appendChild(spark);
      setTimeout(() => spark.remove(), 1200);
    }
    document.body.appendChild(frag);
  },

  spawnShootingStar(startX, startY) {
    const layer = document.getElementById("shooting-stars-layer");
    if (!layer) return;
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.left = startX !== undefined ? `${startX}px` : `${30 + Math.random() * 62}vw`;
    star.style.top = startY !== undefined ? `${startY}px` : `${8 + Math.random() * 32}vh`;
    layer.appendChild(star);
    setTimeout(() => star.remove(), 1050);
  },

  launchConfetti(count = 95) {
    const layer = document.getElementById("confetti-layer");
    if (!layer) return;
    layer.innerHTML = "";
    const palette = ["#f3dfaa", "#d8b36a", "#f6f0e4", "#e4a965", "#9cb8e8", "#c9a050"];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "confetti-piece";
      p.style.left = `${Math.random() * 100}%`;
      p.style.setProperty("--w", `${5 + Math.random() * 6}px`);
      p.style.setProperty("--h", `${9 + Math.random() * 8}px`);
      p.style.setProperty("--c", palette[Math.floor(Math.random() * palette.length)]);
      p.style.setProperty("--dur", `${2.8 + Math.random() * 2.4}s`);
      p.style.setProperty("--del", `${(Math.random() * 1.4).toFixed(2)}s`);
      frag.appendChild(p);
    }
    layer.appendChild(frag);
    setTimeout(() => { layer.innerHTML = ""; }, 6500);
  },

  launchFireworks(bursts = 8) {
    const layer = document.getElementById("fireworks-layer");
    if (!layer) return;
    const colors = ["#f3dfaa", "#ffd97d", "#f6f0e4", "#e4a965", "#b7d0ff"];
    let count = 0;

    const spawnBurst = () => {
      const x = 14 + Math.random() * 72;
      const y = 12 + Math.random() * 44;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 16; i++) {
        const s = document.createElement("div");
        s.className = "firework-spark";
        const angle = (i / 16) * Math.PI * 2;
        const dist = 38 + Math.random() * 58;
        s.style.left = `${x}vw`;
        s.style.top = `${y}vh`;
        s.style.background = color;
        s.style.color = color;
        s.style.setProperty("--dx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
        s.style.setProperty("--dy", `${(Math.sin(angle) * dist).toFixed(1)}px`);
        frag.appendChild(s);
        setTimeout(() => s.remove(), 1050);
      }
      layer.appendChild(frag);
    };

    spawnBurst();
    const iv = setInterval(() => {
      count++;
      if (count >= bursts) { clearInterval(iv); return; }
      spawnBurst();
    }, 540);
  }
};
