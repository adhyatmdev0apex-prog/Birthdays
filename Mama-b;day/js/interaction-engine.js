/**
 * Interaction Engine
 * Manages touch gestures (swipe detection for mobile),
 * desktop 3D perspective parallax, and keyboard controls.
 */
export class InteractionEngine {
  constructor({ onSwipeLeft, onSwipeRight, onSelect }) {
    this.onSwipeLeft = onSwipeLeft || (() => {});
    this.onSwipeRight = onSwipeRight || (() => {});
    this.onSelect = onSelect || (() => {});
    this.startX = 0;
    this.startY = 0;
    this.threshold = 45;
  }

  attachTouch(element) {
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
        // Horizontal swipe must dominate vertical motion
        if (Math.abs(dx) > this.threshold && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) {
            this.onSwipeLeft();
          } else {
            this.onSwipeRight();
          }
        }
      }
    }, { passive: true });
  }

  attachParallax(targetElement, intensity = 8) {
    if (!window.matchMedia("(pointer: fine)").matches) return; // Desktop mouse only

    const onMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      const rotY = nx * intensity;
      const rotX = -ny * intensity;
      targetElement.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }

  attachKeyboard() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        this.onSwipeLeft();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        this.onSwipeRight();
      }
    });
  }
}
