import { mamaProfile } from "../data/mama.js";
import { SceneEngine } from "./scene-engine.js";
import { Anim } from "./animation-engine.js";
import { AudioEngine } from "./audio-engine.js";
import { InteractionEngine } from "./interaction-engine.js";
import { runExperiencePreloader } from "./preloader.js";
import { el, button, sleep } from "./utils.js";

const app = document.querySelector("#app");
const starsContainer = document.querySelector("#stars");
const particlesContainer = document.querySelector("#particles");
const audioToggleBtn = document.querySelector("#audio-toggle");
const audioIcon = document.querySelector("#audio-icon");

const audio = new AudioEngine();
audio.setup();

// Unlock audio on first user touch / pointerdown
let userInteracted = false;
function onFirstInteraction() {
  if (userInteracted) return;
  userInteracted = true;
  audio.unlock();
}
window.addEventListener("pointerdown", onFirstInteraction, { once: true });
window.addEventListener("touchstart", onFirstInteraction, { once: true });

// Sound Toggle Button
audioToggleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  onFirstInteraction();
  const muted = audio.toggleMute();
  audioIcon.textContent = muted ? "🔇" : "♪";
  audioToggleBtn.setAttribute("aria-label", muted ? "Unmute Sound" : "Mute Sound");
});

// Sparse Stars Generator
function generateStars(count = 52) {
  starsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const s = el("span", "star");
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.setProperty("--op", (0.18 + Math.random() * 0.72).toFixed(2));
    s.style.setProperty("--dur", `${2.4 + Math.random() * 3.6}s`);
    starsContainer.appendChild(s);
  }
}

// Floating Dust Motes / Particles
function generateParticles(count = 12) {
  particlesContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = el("div", "dust-mote");
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty("--speed", `${11 + Math.random() * 12}s`);
    p.style.setProperty("--drift", `${(Math.random() * 30 - 15).toFixed(0)}px`);
    p.style.animationDelay = `${Math.random() * 8}s`;
    particlesContainer.appendChild(p);
  }
}

function wrapScene(children, additionalClass = "") {
  const scene = el("section", `scene ${additionalClass}`);
  const inner = el("div", "scene-inner");
  children.forEach(c => {
    if (c) inner.appendChild(c);
  });
  scene.appendChild(inner);
  return scene;
}

/* =========================================================================
   SCENE BUILDERS (Scenes 00 through 10)
   ========================================================================= */

// SCENE 00: SECRET INITIALIZATION
function showInitialization(onComplete) {
  const overlay = el("div", "init-screen");
  const box = el("div", "terminal-box");
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const lines = [
    "initializing experience...",
    "loading memories...",
    "locating two special people...",
    "Chuttu Chachu ........ FOUND",
    "Muttu Chachu ........ FOUND",
    "connecting their stories...",
    "ACCESS GRANTED"
  ];

  (async () => {
    await sleep(350);
    for (let i = 0; i < lines.length; i++) {
      const p = el("p", "terminal-line");
      box.appendChild(p);
      await Anim.type(p, `> ${lines[i]}`, 20);
      if (i < lines.length - 1) {
        await sleep(220);
      }
    }
    const cursor = el("span", "cursor-blink");
    box.lastElementChild.appendChild(cursor);
    await sleep(750);
    overlay.classList.add("fade-out");
    await sleep(850);
    overlay.remove();

    // Reveal #app and execute callback (which activates Scene 01)
    if (app) {
      app.style.visibility = "visible";
      app.style.opacity = "1";
    }
    if (onComplete) onComplete();
  })();
}

// SCENE 01: CINEMATIC OPENING & TWIN CONNECTION
function buildScene01() {
  const eyebrow = el("div", "eyebrow", "TWO BROTHERS • ONE UNBROKEN BOND");

  // Twin light connection stage
  const stage = el("div", "twin-connection-stage");
  const trailLeft = el("div", "twin-trail trail-left");
  const trailRight = el("div", "twin-trail trail-right");
  const orbChuttu = el("div", "twin-orb orb-chuttu");
  const orbMuttu = el("div", "twin-orb orb-muttu");
  const mergedGlow = el("div", "twin-merged-glow");
  stage.append(trailLeft, trailRight, orbChuttu, orbMuttu, mergedGlow);

  // Twin names prominently displayed
  const namesWrap = el("div", "twin-names-display beat");
  namesWrap.style.setProperty("--delay", "1.4s");

  const chuttuSpan = el("span", "twin-name", "Chuttu Chachu");
  const ampSpan = el("span", "twin-connector", "&");
  const muttuSpan = el("span", "twin-name", "Muttu Chachu");
  namesWrap.append(chuttuSpan, ampSpan, muttuSpan);

  const subtitle = el("p", "subtitle beat", "Two distinct journeys intertwined through shared laughter, strength, and timeless stories.");
  subtitle.style.setProperty("--delay", "2.2s");

  const nextBtn = button("Step into their journey →", "action-tap");
  nextBtn.style.setProperty("--delay", "2.9s");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, stage, namesWrap, subtitle, nextBtn], "camera-drift");
}

// SCENE 02: ROYAL PHOTOGRAPH OF BOTH CHACHUS
function buildScene02() {
  const eyebrow = el("div", "eyebrow", "ROYAL PORTRAIT");
  const title = el("h1", "title beat", "Two Brothers, One Presence");
  title.style.setProperty("--delay", "0.2s");

  const royalStage = el("div", "royal-stage beat");
  royalStage.style.setProperty("--delay", "0.45s");

  const backlight = el("div", "royal-backlight");
  const frame = el("div", "royal-frame");
  const inner = el("div", "royal-inner");

  const img = document.createElement("img");
  img.className = "royal-image";
  img.alt = "Chuttu Chachu & Muttu Chachu Together";

  const placeholder = el("div", "royal-placeholder");
  placeholder.innerHTML = `
    <span class="royal-emblem">👑</span>
    <h3 class="royal-placeholder-title">Chuttu Chachu & Muttu Chachu</h3>
    <p class="royal-placeholder-sub">Place royal photograph into assets/images/royal.jpg</p>
  `;

  inner.append(img, placeholder);

  const lip = el("div", "royal-caption-lip");
  const lipTitle = el("span", "", "Chuttu Chachu & Muttu Chachu");
  const lipHint = el("span", "royal-caption-hint", "Tap to enlarge 🔍");
  lip.append(lipTitle, lipHint);

  frame.append(inner, lip);
  royalStage.append(backlight, frame);

  // Fullscreen Modal for Royal Photo
  const modal = el("div", "expanded-modal");
  const closeBtn = button("✕", "close-expanded", "Close photograph");
  const modalContent = el("div", "expanded-content");
  const modalImgWrap = el("div", "expanded-image-wrap");
  const modalImg = document.createElement("img");
  modalImg.alt = "Chuttu Chachu & Muttu Chachu fullscreen view";
  modalImgWrap.appendChild(modalImg);

  const modalTitle = el("h2", "expanded-title", "Chuttu Chachu & Muttu Chachu");
  const modalCaption = el("p", "expanded-caption", "Standing together with pride, warmth, and an unbroken bond.");

  modalContent.append(modalImgWrap, modalTitle, modalCaption);
  modal.append(closeBtn, modalContent);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target === modalContent) {
      modal.classList.remove("open");
    }
  });

  frame.addEventListener("click", () => {
    onFirstInteraction();
    resetPacingTimer();
    if (img.style.display !== "none" && img.complete && img.naturalWidth > 10) {
      modalImg.src = img.src;
      modalImg.style.display = "block";
    } else {
      modalImg.style.display = "none";
    }
    modal.classList.add("open");
  });

  // Try loading royal.jpg first, then fallback to chachus-royal.jpg
  let triedAlt = false;
  img.src = "assets/images/royal.jpg";
  img.onerror = () => {
    if (!triedAlt) {
      triedAlt = true;
      img.src = "assets/images/chachus-royal.jpg";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  };
  img.onload = () => {
    if (img.naturalWidth > 10) {
      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  };

  const subtitle = el("p", "subtitle beat", "Standing together with pride, warmth, and an enduring bond.");
  subtitle.style.setProperty("--delay", "0.75s");

  const nextBtn = button("Continue to their memories →", "action-tap");
  nextBtn.style.setProperty("--delay", "1.0s");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, royalStage, subtitle, nextBtn]);
}

// SCENE 03: THE CONSTELLATION
function buildScene03() {
  const eyebrow = el("div", "eyebrow", "THE CONSTELLATION");

  const constellation = el("div", "constellation-wrapper");
  const memories = mamaProfile.memories;

  memories.slice(0, 3).forEach((mem, i) => {
    const photo = el("div", `mini-photo const-${i + 1}`);
    const img = document.createElement("img");
    img.src = mem.image;
    img.alt = mem.title;
    img.onerror = () => {
      photo.innerHTML = `<div style="padding:8px;font-family:var(--mono);font-size:9px;color:var(--muted);text-align:center;">${mem.title}</div>`;
    };
    photo.appendChild(img);
    constellation.appendChild(photo);
  });

  const title = el("h1", "title beat", "Every memory has a story…");
  title.style.setProperty("--delay", "0.3s");

  const subtitle = el("p", "subtitle beat", "And every story is part of something bigger.");
  subtitle.style.setProperty("--delay", "1.0s");

  const nextBtn = button("Step into the memories →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, constellation, title, subtitle, nextBtn]);
}

// SCENE 04: THREE OUTINGS / PLACES / MEMORIES
function buildScene04() {
  const eyebrow = el("div", "eyebrow", "OUTINGS & MEMORIES");
  const title = el("h1", "title beat", "Moments Along The Journey");
  title.style.setProperty("--delay", "0.2s");

  const memoryStage = el("div", "memory-stage");
  const photoFrame = el("div", "photo-frame");
  const photoInner = el("div", "photo-inner");

  const img = document.createElement("img");
  img.className = "photo-image";
  img.alt = "Chuttu Chachu & Muttu Chachu outing memory";

  const placeholder = el("div", "photo-placeholder");
  placeholder.innerHTML = `
    <span class="photo-placeholder-icon">✦</span>
    <h3 class="photo-placeholder-title">A Cherished Outing</h3>
    <p class="photo-placeholder-hint">Place photograph into assets/images/memories/01.jpg</p>
  `;

  photoInner.append(img, placeholder);

  const lip = el("div", "photo-caption-lip");
  const lipTitle = el("span", "", "");
  const lipHint = el("span", "photo-caption-hint", "Tap to enlarge 🔍");
  lip.append(lipTitle, lipHint);

  photoFrame.append(photoInner, lip);
  memoryStage.appendChild(photoFrame);

  // Expanded Fullscreen Modal
  const modal = el("div", "expanded-modal");
  const closeBtn = button("✕", "close-expanded", "Close photograph");
  const modalContent = el("div", "expanded-content");
  const modalImgWrap = el("div", "expanded-image-wrap");
  const modalImg = document.createElement("img");
  modalImg.alt = "Memory fullscreen view";
  modalImgWrap.appendChild(modalImg);

  const modalTitle = el("h2", "expanded-title");
  const modalCaption = el("p", "expanded-caption");

  modalContent.append(modalImgWrap, modalTitle, modalCaption);
  modal.append(closeBtn, modalContent);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target === modalContent) {
      modal.classList.remove("open");
    }
  });

  // Memory Navigation Controls (Individual photo sequential viewer)
  const controls = el("div", "memory-controls");
  const prevBtn = button("←", "nav-arrow", "Previous photograph");
  const counter = el("span", "memory-counter", "01 / 03");
  const nextBtn = button("→", "nav-arrow", "Next photograph");
  controls.append(prevBtn, counter, nextBtn);
  memoryStage.appendChild(controls);

  const memories = mamaProfile.memories;
  let currentIndex = 0;

  function renderMemory() {
    const mem = memories[currentIndex];
    counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(memories.length).padStart(2, "0")}`;
    lipTitle.textContent = mem.title;
    modalTitle.textContent = mem.title;
    modalCaption.textContent = mem.caption;

    const titleEl = placeholder.querySelector(".photo-placeholder-title");
    if (titleEl) titleEl.textContent = mem.title;
    const hintEl = placeholder.querySelector(".photo-placeholder-hint");
    if (hintEl) hintEl.textContent = `Place photograph into ${mem.image}`;

    img.src = mem.image;
    modalImg.src = mem.image;

    img.onerror = () => {
      img.style.display = "none";
      placeholder.style.display = "flex";
      modalImg.style.display = "none";
    };
    img.onload = () => {
      if (img.naturalWidth > 10) {
        img.style.display = "block";
        placeholder.style.display = "none";
        modalImg.style.display = "block";
      } else {
        img.style.display = "none";
        placeholder.style.display = "flex";
        modalImg.style.display = "none";
      }
    };
  }

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetPacingTimer();
    currentIndex = (currentIndex - 1 + memories.length) % memories.length;
    renderMemory();
    audio.playBell(349.23, 1.4, 0.09, "sine");
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetPacingTimer();
    currentIndex = (currentIndex + 1) % memories.length;
    renderMemory();
    audio.playBell(392.00, 1.4, 0.09, "sine");
  });

  photoFrame.addEventListener("click", () => {
    onFirstInteraction();
    resetPacingTimer();
    modal.classList.add("open");
  });

  // Touch Swipe for Mobile
  const interaction = new InteractionEngine({
    onSwipeLeft: () => nextBtn.click(),
    onSwipeRight: () => prevBtn.click()
  });
  interaction.attachTouch(photoFrame);
  interaction.attachParallax(photoFrame, 8);

  renderMemory();

  const nextSceneBtn = button("Continue to family collage →", "action-tap");
  nextSceneBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, memoryStage, nextSceneBtn]);
}

// SCENE 05: PERSONAL LETTER & MYSTERY TEASE
function buildScene05() {
  const eyebrow = el("div", "eyebrow", "A PERSONAL LETTER");
  const title = el("h1", "title beat", "Words From The Heart");
  title.style.setProperty("--delay", "0.2s");

  const stage = el("div", "letter-stage");

  // Letter Parchment Box
  const letterBox = el("div", "letter-parchment-box beat");
  letterBox.style.setProperty("--delay", "0.45s");

  const salutation = el("h2", "letter-salutation", "Dear Chuttu Chachu & Muttu Chachu,");
  const body = el("div", "letter-body");

  const p1 = el("p", "", "Having both of you in our lives brings a kind of warmth, strength, and joy that means more to us than words can easily express.");
  const p2 = el("p", "", "Through every shared laugh, quiet conversation, and family gathering, your presence makes everything feel more grounded, vibrant, and complete.");
  const p3 = el("p", "", "Thank you for the care you give so naturally, for the smiles you bring into every room, and for the bond that ties our whole family so closely together.");
  body.append(p1, p2, p3);

  const closing = el("div", "letter-closing", "With all our love and respect,<br>Always from all of us.");
  letterBox.append(salutation, body, closing);

  // Mystery Tease Container
  const teaseContainer = el("div", "tease-container");
  const teaseGlow = el("div", "tease-glow");
  const teaseQuote = el("h2", "tease-quote", "“Ohh wait… the main thing is still yet to come…”");
  const teaseBtn = button("See what's waiting →", "action-tap");
  teaseBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });
  teaseContainer.append(teaseGlow, teaseQuote, teaseBtn);

  stage.append(letterBox, teaseContainer);

  const continueBtn = button("Continue →", "action-tap beat");
  continueBtn.style.setProperty("--delay", "0.75s");

  continueBtn.addEventListener("click", async () => {
    onFirstInteraction();
    resetPacingTimer();

    // Atmosphere shift: dim letter and initiate suspense
    letterBox.style.opacity = "0";
    letterBox.style.transform = "scale(0.96)";
    letterBox.style.filter = "blur(6px)";
    continueBtn.style.display = "none";
    eyebrow.textContent = "ANTICIPATION";
    title.style.transition = "opacity 0.4s ease";
    title.style.opacity = "0";

    audio.setMode("tension");
    await sleep(700);

    letterBox.style.display = "none";
    title.textContent = "A Moment of Suspense";
    title.style.opacity = "1";

    teaseContainer.classList.add("active");
    audio.playBell(392.00, 3.2, 0.14, "sine");
  });

  return wrapScene([eyebrow, title, stage, continueBtn]);
}

// DEDICATED SCENE: THE FAMILY COLLAGE & SECRET MESSAGE
function buildSceneFamilyCollage() {
  const data = mamaProfile.familyCollage;
  const eyebrow = el("div", "eyebrow", data.eyebrow || "OUR FAMILY BOND");
  const title = el("h1", "title beat", data.title || "Held in Every Hand, Felt in Every Heart");
  title.style.setProperty("--delay", "0.2s");

  const stage = el("div", "collage-stage");

  // The Note Box
  const noteBox = el("div", "collage-note-box beat");
  noteBox.style.setProperty("--delay", "0.45s");

  const noteText = el("p", "collage-note-text", `“${data.note}”`);
  const subnoteText = el("p", "collage-subnote-text", data.subnote);

  // Letter badges banner
  const banner = el("div", "letter-banner");
  const letters = ["F","A","M","I","L","Y"," ","A","L","W","A","Y","S"];
  letters.forEach(char => {
    if (char === " ") {
      banner.appendChild(el("span", "letter-badge space"));
    } else {
      const badge = el("span", "letter-badge", char);
      banner.appendChild(badge);
    }
  });

  noteBox.append(noteText, subnoteText, banner);

  // The Collage Photo Frame
  const frame = el("div", "collage-photo-frame beat");
  frame.style.setProperty("--delay", "0.75s");

  const inner = el("div", "collage-inner");
  const img = document.createElement("img");
  img.className = "collage-img";
  img.alt = "Full family collage for Chuttu Chachu & Muttu Chachu";

  // Fallback interactive mockup view
  const placeholder = el("div", "collage-placeholder-view");
  const mockGrid = el("div", "collage-mock-grid");
  const row1 = el("div", "mock-row");
  ["F","A","M","I","L","Y"].forEach(l => {
    const card = el("div", "mock-polaroid");
    card.innerHTML = `<span class="mock-letter">${l}</span>`;
    row1.appendChild(card);
  });
  const row2 = el("div", "mock-row");
  ["A","L","W","A","Y","S"].forEach(l => {
    const card = el("div", "mock-polaroid");
    card.innerHTML = `<span class="mock-letter">${l}</span>`;
    row2.appendChild(card);
  });
  mockGrid.append(row1, row2);

  const mockHint = el("div", "collage-mock-hint");
  mockHint.innerHTML = `<strong>All of us, united in one frame ✨</strong><br><span style="color:var(--muted);font-size:9.5px;">Place family collage into assets/images/final.jpg</span>`;

  placeholder.append(mockGrid, mockHint);
  inner.append(img, placeholder);

  const lip = el("div", "collage-caption-lip");
  const lipTitle = el("span", "", "Together, for Chuttu Chachu & Muttu Chachu");
  const lipHint = el("span", "photo-caption-hint", "Tap to enlarge 🔍");
  lip.append(lipTitle, lipHint);

  frame.append(inner, lip);

  // Fullscreen Modal for Collage
  const modal = el("div", "expanded-modal");
  const closeBtn = button("✕", "close-expanded", "Close photograph");
  const modalContent = el("div", "expanded-content");
  const modalImgWrap = el("div", "expanded-image-wrap");
  const modalImg = document.createElement("img");
  modalImg.alt = "Family collage fullscreen view";
  modalImgWrap.appendChild(modalImg);

  const modalTitle = el("h2", "expanded-title", data.title);
  const modalCaption = el("p", "expanded-caption", data.caption);

  modalContent.append(modalImgWrap, modalTitle, modalCaption);
  modal.append(closeBtn, modalContent);
  document.body.appendChild(modal);

  closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target === modalContent) {
      modal.classList.remove("open");
    }
  });

  frame.addEventListener("click", () => {
    onFirstInteraction();
    resetPacingTimer();
    if (img.style.display !== "none" && img.complete && img.naturalWidth > 10) {
      modalImg.src = img.src;
      modal.classList.add("open");
    }
  });

  // Try loading primary image (final.jpg) then fallback (final-image.jpg)
  let triedAlt = false;
  img.src = data.image || "assets/images/final.jpg";
  img.onerror = () => {
    if (!triedAlt && data.altImage) {
      triedAlt = true;
      img.src = data.altImage;
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  };
  img.onload = () => {
    if (img.naturalWidth > 10) {
      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.style.display = "none";
      placeholder.style.display = "flex";
    }
  };

  stage.append(noteBox, frame);

  const nextBtn = button("A message from our hearts →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, stage, nextBtn]);
}

// SCENE 08: THE SURPRISE
function buildScene08() {
  const eyebrow = el("div", "eyebrow", "ONE LAST SURPRISE");
  const title = el("h1", "title beat", "Something Special");
  title.style.setProperty("--delay", "0.2s");

  const subtitle = el("p", "subtitle beat", "Prepared with care, waiting for both of you.");
  subtitle.style.setProperty("--delay", "0.5s");

  const spotlightWrap = el("div", "gift-spotlight");
  const beam = el("div", "spotlight-beam");

  const gift = el("div", "gift-container");
  gift.innerHTML = `
    <div class="gift-body">
      <div class="gift-ribbon-vertical">
        <div class="gift-ribbon-twin-left"></div>
        <div class="gift-ribbon-twin-right"></div>
      </div>
      <div class="gift-ribbon-horizontal"></div>
      <div class="gift-inner-glow"></div>
    </div>
    <div class="gift-lid-wrapper">
      <div class="gift-twin-emblem">✦ ✦</div>
      <div class="gift-bow-mesh"></div>
    </div>
  `;

  const revealText = el("p", "gift-reveal-text", "For Chuttu Chachu & Muttu Chachu.");
  spotlightWrap.append(beam, gift, revealText);

  let opened = false;
  gift.addEventListener("click", (e) => {
    if (opened) return;
    opened = true;
    onFirstInteraction();
    resetPacingTimer();

    gift.classList.add("opened");
    audio.playBell(523.25, 3.5, 0.2, "sine");
    Anim.spawnSparkles(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 34);

    const currentSceneIdx = engine.index;
    setTimeout(() => {
      if (engine.index === currentSceneIdx) {
        engine.next();
      }
    }, 2200);
  });

  const hintBtn = button("Tap the gift to open 🎁", "action-tap");
  hintBtn.addEventListener("click", () => {
    if (!opened) gift.click();
  });

  return wrapScene([eyebrow, title, subtitle, spotlightWrap, hintBtn]);
}

// SCENE 09: THE CELEBRATION PEAK
function buildScene09() {
  const eyebrow = el("div", "eyebrow", "THE CELEBRATION");
  const title = el("h1", "title beat", "Happy Birthday,");
  title.style.setProperty("--delay", "0.2s");

  const hugeName = el("h2", "title huge beat gold-accent celebration-title-name", "Chuttu Chachu & Muttu Chachu!");
  hugeName.style.setProperty("--delay", "0.4s");

  // Glowing festive decorations
  const decoRow = el("div", "decorations-row beat");
  decoRow.style.setProperty("--delay", "0.55s");
  decoRow.innerHTML = `
    <span class="deco-star">✦</span>
    <span class="deco-star">✨</span>
    <span class="deco-star">✦</span>
  `;

  // Interactive 3D Birthday Cake
  const cakeWrap = el("div", "cake-wrapper");
  cakeWrap.setAttribute("title", "Tap to blow out the candles and make a wish!");

  const cakeHalo = el("div", "cake-halo");
  const plate = el("div", "cake-plate");
  const tierBottom = el("div", "cake-tier-bottom");
  const tierTop = el("div", "cake-tier-top");

  const candlesRow = el("div", "candles-row");
  for (let i = 0; i < 3; i++) {
    const stick = el("div", "candle-stick");
    const flame = el("div", "candle-flame");
    stick.appendChild(flame);
    candlesRow.appendChild(stick);
  }

  cakeWrap.append(cakeHalo, plate, tierBottom, tierTop, candlesRow);

  const wishSubtitle = el("p", "subtitle beat", "Tap the cake to make a wish 🎂");
  wishSubtitle.style.setProperty("--delay", "0.7s");

  // Full Birthday Message Card (revealed on cake tap)
  const messageCard = el("div", "full-birthday-message");
  messageCard.innerHTML = `
    <p class="birthday-card-text">
      Wishing our wonderful Chuttu Chachu & Muttu Chachu a year filled with boundless health, laughter, and happiness! May your incredible bond and generous hearts always be celebrated by all of us.
    </p>
  `;

  const nextBtn = button("One quiet thought →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  const sceneNode = wrapScene([eyebrow, title, hugeName, decoRow, cakeWrap, wishSubtitle, messageCard, nextBtn]);

  let blownOut = false;
  let activeConfetti = null;

  function triggerCakeCelebration(e) {
    if (blownOut) return;
    blownOut = true;
    onFirstInteraction();
    resetPacingTimer();

    // 1. Cake animation: blow out flames and activate scene celebration glow
    candlesRow.classList.add("flames-out");
    sceneNode.classList.add("celebration-active");
    wishSubtitle.textContent = "Your wishes are carried into the stars ✨";
    wishSubtitle.classList.add("gold-accent");

    // 2. Start birthday song
    audio.setMode("celebration");
    audio.playBell(659.25, 2.5, 0.18, "sine");

    // 3. Sparkle burst
    const clientX = e?.clientX || window.innerWidth / 2;
    const clientY = e?.clientY || window.innerHeight / 2;
    Anim.spawnSparkles(clientX, clientY, 40);

    // 4. Controlled Confetti Layer (removed after 5.5s to prevent persistent DOM clutter)
    if (!activeConfetti) {
      const confettiLayer = el("div", "confetti-layer");
      const colors = ["#d8b36a", "#f1d99b", "#ffffff", "#f4eee3", "#c4aa8b"];
      for (let i = 0; i < 36; i++) {
        const piece = el("i", "confetti-piece");
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty("--w", `${6 + Math.random() * 4}px`);
        piece.style.setProperty("--h", `${8 + Math.random() * 8}px`);
        piece.style.setProperty("--dur", `${3.2 + Math.random() * 2.6}s`);
        piece.style.setProperty("--del", `${Math.random() * 1.5}s`);
        piece.style.setProperty("--c", colors[i % colors.length]);
        confettiLayer.appendChild(piece);
      }
      sceneNode.appendChild(confettiLayer);
      activeConfetti = confettiLayer;

      setTimeout(() => {
        confettiLayer.style.transition = "opacity 1.2s ease";
        confettiLayer.style.opacity = "0";
        setTimeout(() => {
          confettiLayer.remove();
          activeConfetti = null;
        }, 1300);
      }, 5500);
    }
  }

  cakeWrap.addEventListener("click", triggerCakeCelebration);
  cakeWrap.addEventListener("touchend", (e) => {
    if (!blownOut) {
      e.preventDefault();
      triggerCakeCelebration(e.changedTouches ? e.changedTouches[0] : e);
    }
  }, { passive: false });

  return sceneNode;
}

// SCENE 10: THE QUIET END (FINALE)
function buildScene10() {
  const starsPill = el("div", "quiet-stars", "✦ ✦ ✦");
  const eyebrow = el("div", "eyebrow", mamaProfile.finale.eyebrow || "A HEARTFELT FINALE");

  const dualNames = el("div", "finale-dual-names beat");
  dualNames.style.setProperty("--delay", "0.3s");
  dualNames.innerHTML = `
    <span class="finale-name">Chuttu Chachu</span>
    <span class="finale-amp">&</span>
    <span class="finale-name">Muttu Chachu</span>
  `;

  const closingSeq = el("div", "closing-sequence");
  const lines = [
    mamaProfile.finale.line1 || "From our entire family, today and always…",
    mamaProfile.finale.line2 || "thank you for every moment, laugh, and memory we share.",
    mamaProfile.finale.title || "HAPPY BIRTHDAY, CHUTTU CHACHU & MUTTU CHACHU",
    mamaProfile.finale.line3 || "Here's to another wonderful year filled with boundless health, peace, and laughter.",
    mamaProfile.finale.closing || "With all our love and deepest respect, always."
  ];

  lines.forEach((l, idx) => {
    const isGold = idx === 2;
    const p = el("p", `closing-line ${isGold ? "gold-accent finale-main-title" : ""}`, l);
    p.style.setProperty("--delay", `${0.6 + idx * 0.7}s`);
    closingSeq.appendChild(p);
  });

  const replayBtn = button("Replay Experience ↺", "replay-btn", "Replay cinematic experience");
  replayBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.goTo(0);
  });

  return wrapScene([starsPill, eyebrow, dualNames, closingSeq, replayBtn]);
}

/* =========================================================================
   BOOTSTRAP & ENGINE INITIALIZATION
   ========================================================================= */

let engine;
let autoTimer = null;

const autoDurations = [
  8500,  // Scene 01: Twin Connection Opening
  8500,  // Scene 02: Royal Portrait
  7000,  // Scene 03: Constellation
  20000, // Scene 04: Three Outings (interactive)
  16000, // Scene 05: Dedicated Family Collage
  99999, // Scene 06: Personal Letter / Messages (read & reveal tease at own pace)
  99999, // Scene 07: The Surprise (Gift Box - tap to open)
  99999, // Scene 08: Celebration Peak (Cake - tap to celebrate)
  99999  // Scene 09: Quiet End Finale
];

function resetPacingTimer() {
  clearTimeout(autoTimer);
  if (!engine || engine.index < 0) return;
  const duration = autoDurations[engine.index] || 7000;
  if (duration >= 90000) return;

  autoTimer = setTimeout(() => {
    if (engine.next()) {
      resetPacingTimer();
    }
  }, duration);
}

async function boot() {
  generateStars(52);
  generateParticles(12);

  // Keep main scenes completely hidden until the terminal sequence finishes
  if (app) {
    app.style.visibility = "hidden";
    app.style.opacity = "0";
    app.style.transition = "opacity 0.6s ease";
  }

  const sceneBuilders = [
    buildScene01, // Scene 01: Twin Connection Opening
    buildScene02, // Scene 02: Royal Portrait of Both Chachus
    buildScene03, // Scene 03: Constellation ("Every memory has a story…")
    buildScene04, // Scene 04: Three Outings / Memories
    buildSceneFamilyCollage, // Dedicated Scene: Full Family Collage Reveal
    buildScene05, // Scene 05: Messages / Letter
    buildScene08, // Scene 06: The Surprise (Gift Box)
    buildScene09, // Scene 07: Celebration Peak (Cake)
    buildScene10  // Scene 08: The Quiet End Finale
  ];

  engine = new SceneEngine({
    root: app,
    onSceneChange: (newIndex) => {
      resetPacingTimer();
      // Remove any lingering confetti if navigating away from cake scene
      if (newIndex !== 7) {
        document.querySelectorAll(".confetti-layer").forEach(c => c.remove());
      }
      switch (newIndex) {
        case 0:
        case 1:
          audio.setMode("quiet");
          break;
        case 2:
          audio.setMode("reveal");
          break;
        case 3:
        case 4:
        case 5:
          audio.setMode("warm");
          break;
        case 6:
          audio.setMode("tension");
          break;
        case 7:
          // Keep ambient gentle until user blows candles
          audio.stopTensionDrone();
          audio.stopMelody();
          if (audio.pianoAudio) audio.pianoAudio.volume = 0.18;
          break;
        case 8:
          audio.setMode("finale");
          break;
      }
    }
  });

  // Mount scenes without activating scene 0 yet (remains quiet & quiescent)
  engine.mount(sceneBuilders, false);
  window.debugEngine = engine;

  // Global Keyboard Navigation
  window.addEventListener("keydown", (e) => {
    if (!engine || engine.index < 0) return;
    if (e.key === "ArrowRight") {
      resetPacingTimer();
      engine.next();
    }
    if (e.key === "ArrowLeft") {
      resetPacingTimer();
      engine.previous();
    }
  });

  // Global Touch Swipe between scenes
  let touchStartX = 0;
  let touchStartY = 0;
  document.body.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.body.addEventListener("touchend", (e) => {
    if (!engine || engine.index < 0) return;
    if (document.querySelector(".expanded-modal.open")) return; // Don't advance scene while modal open
    if (e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        resetPacingTimer();
        if (dx < 0) {
          engine.next();
        } else {
          engine.previous();
        }
      }
    }
  }, { passive: true });

  // 1. First run the instant experience preloader to fetch all assets/fonts/audio
  await runExperiencePreloader();

  // 2. Once everything is downloaded, show the Intro Terminal Sequence
  showInitialization(() => {
    // 3. ONLY now, when the terminal intro is completely finished and faded out, start Scene 01!
    engine.goTo(0, true);
    resetPacingTimer();
  });
}

boot();
