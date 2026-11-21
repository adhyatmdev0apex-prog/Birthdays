/* =========================================================================
   PRELOADER.JS — Instant Experience Preloader with Smooth Progress & Fallback
   ========================================================================= */

window.Tribute = window.Tribute || {};

window.Tribute.runPreloader = function runPreloader() {
  const preloader = document.getElementById("experience-preloader");
  const progressBar = document.getElementById("exp-progress-bar");
  const statusText = document.getElementById("exp-status-text");
  const statusPct = document.getElementById("exp-status-pct");

  if (!preloader) return Promise.resolve();

  const data = window.TEACHER_DATA || {};

  return new Promise((resolve) => {
    let currentPct = 0;
    let targetPct = 22;
    let isFinished = false;
    let completedOnce = false;
    let safetyTimer = null;

    const setStatus = (pct) => {
      if (statusText) {
        if (pct < 34) statusText.textContent = "Gathering gratitude & melodies…";
        else if (pct < 68) statusText.textContent = "Framing cherished moments…";
        else if (pct < 96) statusText.textContent = "Preparing your birthday tribute…";
        else statusText.textContent = "Everything is ready.";
      }
      if (statusPct) statusPct.textContent = `${Math.min(100, Math.round(pct))}%`;
      if (progressBar) progressBar.style.width = `${Math.min(100, pct)}%`;
    };

    const complete = () => {
      if (completedOnce) return;
      completedOnce = true;
      isFinished = true;
      targetPct = 100;
      if (safetyTimer) clearTimeout(safetyTimer);
    };

    let rafId = null;
    const animate = () => {
      if (currentPct < targetPct) {
        const delta = Math.max(1.2, (targetPct - currentPct) * 0.22);
        currentPct = Math.min(targetPct, currentPct + delta);
        setStatus(currentPct);
      }
      if (currentPct >= 99.5 && isFinished) {
        setStatus(100);
        cancelAnimationFrame(rafId);
        setTimeout(() => {
          preloader.classList.add("fade-out");
          setTimeout(() => {
            preloader.remove();
            resolve();
          }, 550);
        }, 200);
        return;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const images = [
      data.portrait && data.portrait.image,
      ...((data.memories && data.memories.items) || []).map(m => m.image)
    ].filter(Boolean);

    let loaded = 0;
    const total = images.length + 2;

    const doneOne = () => {
      loaded++;
      targetPct = Math.max(targetPct, Math.min(97, (loaded / total) * 100));
      if (loaded >= total) complete();
    };

    safetyTimer = setTimeout(complete, 1800);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(doneOne).catch(doneOne);
    } else {
      doneOne();
    }

    if (document.readyState === "complete") doneOne();
    else window.addEventListener("load", doneOne, { once: true });

    images.forEach(src => {
      const img = new Image();
      img.onload = doneOne;
      img.onerror = doneOne;
      img.src = src;
    });
  });
};
