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
    "Initializing celebration...",
    "Gathering memories...",
    "Collecting wishes...",
    "Preparing something special...",
    "Ready."
  ];

  (async () => {
    await sleep(350);
    for (let i = 0; i < lines.length; i++) {
      const p = el("p", "terminal-line");
      box.appendChild(p);
      await Anim.type(p, `> ${lines[i]}`, 24);
      if (i < lines.length - 1) {
        await sleep(300);
      }
    }
    const cursor = el("span", "cursor-blink");
    box.lastElementChild.appendChild(cursor);
    await sleep(800);
    overlay.classList.add("fade-out");
    await sleep(900);
    overlay.remove();

    // Reveal #app and execute callback (which activates Scene 01)
    if (app) {
      app.style.visibility = "visible";
      app.style.opacity = "1";
    }
    if (onComplete) onComplete();
  })();
}

// SCENE 01: THE DAY
function buildScene01() {
  const eyebrow = el("div", "eyebrow", "THE OCCASION");
  const title = el("h1", "title beat", "Once a year…");
  title.style.setProperty("--delay", "0.2s");

  const singleLines = el("div", "single-lines");
  const lines = [
    "there is a day that belongs to one person.",
    "A day for memories.",
    "A day for laughter.",
    "A day for wishes."
  ];

  lines.forEach((txt, idx) => {
    const p = el("p", "stagger-line", txt);
    p.style.setProperty("--delay", `${0.7 + idx * 0.6}s`);
    singleLines.appendChild(p);
  });

  const nextBtn = button("Begin the journey →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, singleLines, nextBtn], "camera-drift");
}

// SCENE 02: SOMETHING IS BEING PREPARED
function buildScene02() {
  const eyebrow = el("div", "eyebrow", "PREPARATION");

  const floating = el("div", "floating-elements");
  const items = [
    { icon: "✉️", label: "envelope", delay: "0.2s" },
    { icon: "📷", label: "photo", delay: "0.45s" },
    { icon: "🎀", label: "ribbon", delay: "0.7s" },
    { icon: "🌸", label: "flower", delay: "0.95s" },
    { icon: "✨", label: "light", delay: "1.2s" }
  ];

  items.forEach(item => {
    const elItem = el("div", "ambient-item");
    elItem.style.setProperty("--delay", item.delay);
    elItem.innerHTML = `<span>${item.icon}</span>`;
    floating.appendChild(elItem);
  });

  const title = el("h1", "title beat", "We've been collecting something.");
  title.style.setProperty("--delay", "0.3s");

  const subtitle = el("p", "subtitle beat", "A few memories. A few wishes. A few words.");
  subtitle.style.setProperty("--delay", "0.7s");

  const punchline = el("p", "subtitle beat gold-accent", "All for the same person.");
  punchline.style.setProperty("--delay", "1.3s");

  const nextBtn = button("Explore the clues →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, floating, title, subtitle, punchline, nextBtn]);
}

// SCENE 03: THE CLUES (Interactive Mystery)
function buildScene03() {
  const eyebrow = el("div", "eyebrow", "THE CLUES");
  const title = el("h1", "title beat", "So… who is this all for?");
  title.style.setProperty("--delay", "0.2s");

  const clueStage = el("div", "clue-stage");
  const whisperBox = el("div", "whisper-modal");

  const clues = mamaProfile.clues || [
    { id: "photo", icon: "📷", label: "Photograph", whisper: "“One more memory.”" },
    { id: "note", icon: "✉️", label: "Note", whisper: "“One more wish.”" },
    { id: "flower", icon: "🌸", label: "Flower", whisper: "“One more reason to celebrate.”" },
    { id: "ribbon", icon: "🎀", label: "Ribbon", whisper: "“A promise waiting to be unwrapped.”" }
  ];

  clues.forEach((c, i) => {
    const card = button("", `clue-card clue-pos-${i + 1}`, `Clue: ${c.label}`);
    card.innerHTML = `<span class="clue-icon">${c.icon}</span><span class="clue-label">${c.label}</span>`;

    card.addEventListener("click", (e) => {
      onFirstInteraction();
      resetPacingTimer();
      Anim.spawnSparkles(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 16);
      audio.playBell(330 + i * 90, 1.8, 0.12, "sine");

      whisperBox.innerHTML = `<div class="whisper-pill">${c.whisper}</div>`;

      if (c.id === "ribbon") {
        // Gift ribbon tap darkens everything and triggers the big reveal
        clueStage.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        clueStage.style.opacity = "0";
        clueStage.style.transform = "scale(0.85)";
        setTimeout(() => {
          if (engine.index === 2) {
            engine.next();
          }
        }, 1100);
      }
    });

    clueStage.appendChild(card);
  });

  const nextBtn = button("Reveal the answer →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, clueStage, whisperBox, nextBtn]);
}

// SCENE 04: THE BIG REVEAL
function buildScene04() {
  const orb = el("div", "golden-orb");
  const eyebrow = el("div", "eyebrow", "FOR ONE PERSON");
  const title = el("h1", "title huge reveal-name", mamaProfile.displayName || "MAMA");
  const subtitle = el("p", "subtitle beat gold-accent", "Happy Birthday.");
  subtitle.style.setProperty("--delay", "0.6s");

  const nextBtn = button("Messages from everyone →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([orb, eyebrow, title, subtitle, nextBtn], "reveal-wrapper");
}

// SCENE 05: FROM EVERYONE
function buildScene05() {
  const eyebrow = el("div", "eyebrow", "FROM EVERYONE");
  const title = el("h1", "title beat", "Everyone has something to say.");
  title.style.setProperty("--delay", "0.2s");

  const messageStage = el("div", "message-stage");
  const dotsContainer = el("div", "message-dots");

  const messages = mamaProfile.messages;
  let activeMsgIdx = 0;
  const cardElements = [];
  const dotElements = [];

  const tilts = [-2, 1.6, -1.2, 1.8];

  messages.forEach((m, idx) => {
    const card = el("article", `message-card ${idx === 0 ? "active-message" : ""}`);
    card.style.setProperty("--tilt", `${tilts[idx % tilts.length]}deg`);
    card.innerHTML = `
      <p class="message-quote">“${m.text}”</p>
      <small class="message-author">— ${m.author}</small>
    `;
    messageStage.appendChild(card);
    cardElements.push(card);

    const dot = button("", `msg-dot ${idx === 0 ? "active" : ""}`, `Show wish ${idx + 1}`);
    dot.addEventListener("click", () => showMessage(idx));
    dotsContainer.appendChild(dot);
    dotElements.push(dot);
  });

  function showMessage(targetIdx) {
    resetPacingTimer();
    activeMsgIdx = targetIdx;
    cardElements.forEach((c, i) => {
      c.classList.toggle("active-message", i === targetIdx);
      c.classList.toggle("prev-message", i < targetIdx);
    });
    dotElements.forEach((d, i) => {
      d.classList.toggle("active", i === targetIdx);
    });
    audio.playBell(293.66 + targetIdx * 45, 2.0, 0.08, "triangle");
  }

  // Tap stage to advance message
  messageStage.addEventListener("click", () => {
    if (activeMsgIdx < messages.length - 1) {
      showMessage(activeMsgIdx + 1);
    } else {
      showMessage(0);
    }
  });

  const nextBtn = button("Step into the album →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, messageStage, dotsContainer, nextBtn]);
}

// SCENE 06: THE MEMORY ALBUM
function buildScene06() {
  const eyebrow = el("div", "eyebrow", "THE MEMORY ALBUM");
  const title = el("h1", "title beat", "A moment held in time.");
  title.style.setProperty("--delay", "0.2s");

  const memoryStage = el("div", "memory-stage");
  const photoFrame = el("div", "photo-frame");
  const photoInner = el("div", "photo-inner");

  const img = document.createElement("img");
  img.className = "photo-image";
  img.alt = "Mama birthday memory";

  const placeholder = el("div", "photo-placeholder");
  placeholder.innerHTML = `
    <span class="photo-placeholder-icon">✦</span>
    <h3 class="photo-placeholder-title">A Cherished Memory</h3>
    <p class="photo-placeholder-hint">Drop family photographs into assets/images/memories/ to personalize.</p>
  `;

  photoInner.append(img, placeholder);

  const lip = el("div", "photo-caption-lip");
  const lipTitle = el("span", "", "");
  const lipHint = el("span", "photo-caption-hint", "Tap to enlarge");
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

  // Memory Navigation Controls
  const controls = el("div", "memory-controls");
  const prevBtn = button("←", "nav-arrow", "Previous photograph");
  const counter = el("span", "memory-counter", "01 / 04");
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

    img.src = mem.image;
    modalImg.src = mem.image;

    img.onerror = () => {
      img.style.display = "none";
      placeholder.style.display = "flex";
      modalImg.style.display = "none";
    };
    img.onload = () => {
      img.style.display = "block";
      placeholder.style.display = "none";
      modalImg.style.display = "block";
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

  // Tap photo to open modal
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

  const nextSceneBtn = button("Connect the memories →", "action-tap");
  nextSceneBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, memoryStage, nextSceneBtn]);
}

// SCENE 07: THE MEMORIES START CONNECTING
function buildScene07() {
  const eyebrow = el("div", "eyebrow", "THE CONSTELLATION");

  const constellation = el("div", "constellation-wrapper");
  const memories = mamaProfile.memories;

  memories.slice(0, 4).forEach((mem, i) => {
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

  const title = el("h1", "title beat", "Every memory has a story.");
  title.style.setProperty("--delay", "0.3s");

  const subtitle = el("p", "subtitle beat", "And every story is part of something bigger.");
  subtitle.style.setProperty("--delay", "1.0s");

  const nextBtn = button("See what we made together →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, constellation, title, subtitle, nextBtn]);
}

// DEDICATED SCENE: THE FAMILY COLLAGE & SECRET MESSAGE
function buildSceneFamilyCollage() {
  const data = mamaProfile.familyCollage;
  const eyebrow = el("div", "eyebrow", data.eyebrow || "OUR SECRET MESSAGE");
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
  const letters = ["H","A","P","P","Y"," ","B","I","R","T","H","D","A","Y"];
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
  img.alt = "Family collage spelling Happy Birthday";

  // Fallback interactive mockup view
  const placeholder = el("div", "collage-placeholder-view");
  const mockGrid = el("div", "collage-mock-grid");
  const row1 = el("div", "mock-row");
  ["H","A","P","P","Y"].forEach(l => {
    const card = el("div", "mock-polaroid");
    card.innerHTML = `<span class="mock-letter">${l}</span>`;
    row1.appendChild(card);
  });
  const row2 = el("div", "mock-row");
  ["B","I","R","T","H","D","A","Y"].forEach(l => {
    const card = el("div", "mock-polaroid");
    card.innerHTML = `<span class="mock-letter">${l}</span>`;
    row2.appendChild(card);
  });
  mockGrid.append(row1, row2);

  const mockHint = el("div", "collage-mock-hint");
  mockHint.innerHTML = `<strong>A letter from each of us ✨</strong><br><span style="color:var(--muted);font-size:9.5px;">Drop final photo into assets/images/final-image.jpg</span>`;

  placeholder.append(mockGrid, mockHint);
  inner.append(img, placeholder);

  const lip = el("div", "collage-caption-lip");
  const lipTitle = el("span", "", "Together, for Mama");
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

  // Try loading primary image (final-image.jpg) then fallback (final.jpg)
  let triedAlt = false;
  img.src = data.image || "assets/images/final-image.jpg";
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

  const nextBtn = button("Continue to the surprise →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, stage, nextBtn]);
}

// SCENE 08: THE SURPRISE
function buildScene08() {
  const eyebrow = el("div", "eyebrow", mamaProfile.gift.eyebrow || "ONE LAST THING");
  const title = el("h1", "title beat", mamaProfile.gift.title);
  title.style.setProperty("--delay", "0.2s");

  const subtitle = el("p", "subtitle beat", mamaProfile.gift.message);
  subtitle.style.setProperty("--delay", "0.5s");

  const spotlightWrap = el("div", "gift-spotlight");
  const beam = el("div", "spotlight-beam");

  const gift = el("div", "gift-container");
  gift.innerHTML = `
    <div class="gift-body">
      <div class="gift-ribbon-vertical"></div>
      <div class="gift-ribbon-horizontal"></div>
      <div class="gift-inner-glow"></div>
    </div>
    <div class="gift-lid-wrapper">
      <div class="gift-bow-mesh"></div>
    </div>
  `;

  const revealText = el("p", "gift-reveal-text", mamaProfile.gift.revealText || "For Mama.");
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

    setTimeout(() => {
      if (engine.index === 8) {
        engine.next();
      }
    }, 2200);
  });

  const hintBtn = button(mamaProfile.gift.instruction || "Tap the gift to open 🎁", "action-tap");
  hintBtn.addEventListener("click", () => {
    if (!opened) gift.click();
  });

  return wrapScene([eyebrow, title, subtitle, spotlightWrap, hintBtn]);
}

// SCENE 09: THE CELEBRATION PEAK
function buildScene09() {
  const eyebrow = el("div", "eyebrow", "THE CELEBRATION");
  const title = el("h1", "title beat", "HAPPY BIRTHDAY");
  title.style.setProperty("--delay", "0.2s");

  const hugeName = el("h2", "title huge beat gold-accent", mamaProfile.displayName || "MAMA");
  hugeName.style.setProperty("--delay", "0.4s");

  // Interactive 3D Birthday Cake
  const cakeWrap = el("div", "cake-wrapper");
  cakeWrap.setAttribute("title", "Tap to blow out the candles and make a wish!");

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

  cakeWrap.append(plate, tierBottom, tierTop, candlesRow);

  const wishSubtitle = el("p", "subtitle beat", "Tap the cake to make a wish 🎂");
  wishSubtitle.style.setProperty("--delay", "0.7s");

  let blownOut = false;
  cakeWrap.addEventListener("click", (e) => {
    if (blownOut) return;
    blownOut = true;
    resetPacingTimer();
    candlesRow.classList.add("flames-out");
    wishSubtitle.textContent = "Your wish is carried into the stars ✨";
    wishSubtitle.classList.add("gold-accent");

    Anim.spawnSparkles(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 38);
    audio.playBell(659.25, 2.5, 0.18, "sine");
  });

  // Confetti Layer
  const confettiLayer = el("div", "confetti-layer");
  const colors = ["#d8b36a", "#f1d99b", "#ffffff", "#f4eee3", "#c4aa8b"];
  for (let i = 0; i < 32; i++) {
    const piece = el("i", "confetti-piece");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--w", `${5 + Math.random() * 4}px`);
    piece.style.setProperty("--h", `${8 + Math.random() * 8}px`);
    piece.style.setProperty("--dur", `${3.2 + Math.random() * 2.8}s`);
    piece.style.setProperty("--del", `${Math.random() * 2}s`);
    piece.style.setProperty("--c", colors[i % colors.length]);
    confettiLayer.appendChild(piece);
  }

  const nextBtn = button("One quiet thought →", "action-tap");
  nextBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.next();
  });

  return wrapScene([eyebrow, title, hugeName, cakeWrap, wishSubtitle, confettiLayer, nextBtn]);
}

// SCENE 10: THE QUIET END
function buildScene10() {
  const starsPill = el("div", "quiet-stars", "✦ ✦ ✦");
  const eyebrow = el("div", "eyebrow", mamaProfile.finale.eyebrow || "FROM EVERYONE");

  const closingSeq = el("div", "closing-sequence");
  const lines = [
    mamaProfile.finale.line1 || "From everyone who got to celebrate today…",
    mamaProfile.finale.line2 || "thank you for being part of so many memories.",
    mamaProfile.finale.title || "HAPPY BIRTHDAY, MAMA",
    mamaProfile.finale.line3 || "Here's to another wonderful year.",
    mamaProfile.finale.closing || "With love, from everyone."
  ];

  lines.forEach((l, idx) => {
    const p = el("p", `closing-line ${idx === 2 ? "gold-accent" : ""}`, l);
    p.style.setProperty("--delay", `${0.4 + idx * 0.8}s`);
    closingSeq.appendChild(p);
  });

  const replayBtn = button("Replay Experience ↺", "replay-btn", "Replay cinematic experience");
  replayBtn.addEventListener("click", () => {
    resetPacingTimer();
    engine.goTo(0);
  });

  return wrapScene([starsPill, eyebrow, closingSeq, replayBtn]);
}

/* =========================================================================
   BOOTSTRAP & ENGINE INITIALIZATION
   ========================================================================= */

let engine;
let autoTimer = null;

const autoDurations = [
  6500,  // Scene 01: The Day
  6800,  // Scene 02: Something Is Being Prepared
  12000, // Scene 03: The Clues (interactive)
  5500,  // Scene 04: The Big Reveal
  10000, // Scene 05: From Everyone
  20000, // Scene 06: Memory Album (interactive)
  7500,  // Scene 07: Connecting Memories
  16000, // Dedicated Scene: Family Collage & Secret Message
  20000, // Scene 08: The Surprise (Gift Box)
  12000, // Scene 09: Celebration Peak (Cake)
  99999  // Scene 10: Quiet End
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
    buildScene01, // Scene 01: The Day
    buildScene02, // Scene 02: Something Is Being Prepared
    buildScene03, // Scene 03: The Clues
    buildScene04, // Scene 04: The Big Reveal
    buildScene05, // Scene 05: From Everyone
    buildScene06, // Scene 06: The Memory Album
    buildScene07, // Scene 07: The Memories Start Connecting
    buildSceneFamilyCollage, // Dedicated Scene: Family Collage & Secret Message
    buildScene08, // Scene 08: The Surprise
    buildScene09, // Scene 09: The Celebration Peak
    buildScene10  // Scene 10: The Quiet End
  ];

  engine = new SceneEngine({
    root: app,
    onSceneChange: (newIndex) => {
      resetPacingTimer();
      switch (newIndex) {
        case 0:
        case 1:
        case 2:
          audio.setMode("quiet");
          break;
        case 3:
          audio.setMode("reveal");
          break;
        case 4:
        case 5:
        case 6:
          audio.setMode("warm");
          break;
        case 7:
          audio.setMode("reveal");
          break;
        case 8:
          audio.setMode("tension");
          break;
        case 9:
          audio.setMode("celebration");
          break;
        case 10:
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
