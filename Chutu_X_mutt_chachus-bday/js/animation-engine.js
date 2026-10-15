export const Anim = {
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  type(element, text, speed = 26) {
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

  fadeIn(element, ms = 600) {
    return new Promise(resolve => {
      element.style.transition = `opacity ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      element.style.opacity = "1";
      element.style.transform = "translateY(0) scale(1)";
      setTimeout(resolve, ms);
    });
  },

  fadeOut(element, ms = 600) {
    return new Promise(resolve => {
      element.style.transition = `opacity ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1), transform ${ms}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      element.style.opacity = "0";
      setTimeout(resolve, ms);
    });
  },

  stagger(parent, selector, delay = 160) {
    const items = parent.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.style.setProperty("--delay", `${index * delay}ms`);
    });
  },

  spawnSparkles(x, y, count = 24, container = document.body) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const spark = document.createElement("span");
      spark.className = "sparkle-particle";
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const dist = 40 + Math.random() * 90;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--tx", `${tx}px`);
      spark.style.setProperty("--ty", `${ty}px`);
      spark.style.setProperty("--size", `${3 + Math.random() * 5}px`);
      spark.style.setProperty("--dur", `${600 + Math.random() * 600}ms`);
      frag.appendChild(spark);
      setTimeout(() => spark.remove(), 1200);
    }
    container.appendChild(frag);
  }
};
