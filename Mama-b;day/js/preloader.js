import { mamaProfile } from "../data/mama.js";

/**
 * Preloads fonts, stylesheets, images, and audio metadata to guarantee
 * that the opening terminal sequence and scenes execute with silky 60fps
 * smoothness without network or font-rendering lag on mobile browsers.
 */
export function runExperiencePreloader() {
  const preloader = document.getElementById("experience-preloader");
  const progressBar = document.getElementById("exp-progress-bar");
  const statusText = document.getElementById("exp-status-text");
  const statusPct = document.getElementById("exp-status-pct");

  if (!preloader) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let currentPct = 0;
    let targetPct = 15;
    let isFinished = false;

    const setStatus = (pct) => {
      if (!statusText || !statusPct) return;
      if (pct < 32) {
        statusText.textContent = "Connecting to the stars…";
      } else if (pct < 68) {
        statusText.textContent = "Gathering memories & melodies…";
      } else if (pct < 96) {
        statusText.textContent = "Harmonizing wishes & words…";
      } else {
        statusText.textContent = "Everything is ready.";
      }
      statusPct.textContent = `${Math.min(100, Math.round(pct))}%`;
      if (progressBar) {
        progressBar.style.width = `${Math.min(100, pct)}%`;
      }
    };

    let rafId = null;
    const animate = () => {
      if (currentPct < targetPct) {
        const delta = Math.max(0.6, (targetPct - currentPct) * 0.18);
        currentPct = Math.min(targetPct, currentPct + delta);
        setStatus(currentPct);
      }

      if (currentPct >= 99.8 && isFinished) {
        setStatus(100);
        cancelAnimationFrame(rafId);
        setTimeout(() => {
          preloader.classList.add("fade-out");
          setTimeout(() => {
            preloader.remove();
            resolve();
          }, 750);
        }, 320);
        return;
      }

      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // List of assets to download & cache
    const imagesToPreload = [
      ...(mamaProfile.memories || []).map(m => m.image),
      mamaProfile.familyCollage?.image || "assets/images/final-image.jpg",
      mamaProfile.familyCollage?.altImage || "assets/images/final.jpg"
    ].filter(Boolean);

    let loadedItems = 0;
    // Weights: images + fonts + window load + audio metadata
    const totalItems = imagesToPreload.length + 3;

    const onItemDone = () => {
      loadedItems++;
      const computed = (loadedItems / totalItems) * 100;
      targetPct = Math.max(targetPct, Math.min(97, computed));
      if (loadedItems >= totalItems) {
        completeLoading();
      }
    };

    let completedOnce = false;
    const completeLoading = () => {
      if (completedOnce) return;
      completedOnce = true;
      isFinished = true;
      targetPct = 100;
      clearTimeout(safetyTimer);
    };

    // 1. Wait for web fonts (prevents font-swapping stutter during terminal typing)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(onItemDone).catch(onItemDone);
    } else {
      onItemDone();
    }

    // 2. Wait for window/DOM complete
    if (document.readyState === "complete") {
      onItemDone();
    } else {
      window.addEventListener("load", onItemDone, { once: true });
    }

    // 3. Audio metadata preload
    try {
      const audioTest = new Audio("assets/audio/piano.mp3");
      audioTest.preload = "auto";
      audioTest.addEventListener("canplaythrough", onItemDone, { once: true });
      setTimeout(onItemDone, 1200);
    } catch {
      onItemDone();
    }

    // 4. Preload and decode images into memory
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.onload = () => {
        if (img.decode) {
          img.decode().then(onItemDone).catch(onItemDone);
        } else {
          onItemDone();
        }
      };
      img.onerror = onItemDone; // Gracefully continue if file not yet present
      img.src = src;
    });

    // Safety fallback: maximum 3.2 seconds so poor cellular network never hangs
    const safetyTimer = setTimeout(() => {
      completeLoading();
    }, 3200);
  });
}
