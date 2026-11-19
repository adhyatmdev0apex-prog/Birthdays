/* =========================================================================
   INTERACTION.JS — Mobile Touch Swipe & Desktop Subtle 3D Parallax
   ========================================================================= */

window.Tribute = window.Tribute || {};

class InteractionEngine {
  constructor({ onSwipeLeft, onSwipeRight } = {}) {
    this.onSwipeLeft = onSwipeLeft || (() => {});
    this.onSwipeRight = onSwipeRight || (() => {});
    this.startX = 0;
    this.startY = 0;
    this.threshold = 44;
  }

  attachTouch(element) {
    if (!element) return;
    element.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      }
    }, { passive: true });

    element.addEventListener("touchend", (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - this.startX;
        const dy = e.changedTouches[0].clientY - this.startY;
        if (Math.abs(dx) > this.threshold && Math.abs(dx) > Math.abs(dy) * 1.4) {
          if (dx < 0) this.onSwipeLeft();
          else this.onSwipeRight();
        }
      }
    }, { passive: true });
  }

  attachParallax(targetElement, intensity = 6) {
    if (!targetElement || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetElement.style.transform =
        `perspective(1000px) rotateX(${(-ny * intensity).toFixed(2)}deg) rotateY(${(nx * intensity).toFixed(2)}deg)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }
}

window.Tribute.InteractionEngine = InteractionEngine;
