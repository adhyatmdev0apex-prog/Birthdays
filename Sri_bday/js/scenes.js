/* =========================================================================
   SCENES.JS — Complete 10-Chapter Teacher Birthday Experience
   Preserves & elevates my-bros-birthday-main's signature journey, enriched
   with Mama-b;day & Chutu_X_mutt_chachus-bday's portrait, polaroid gallery,
   wishes, letter, luxury 3D gift box, and interactive 3D birthday cake.
   ========================================================================= */

window.Tribute = window.Tribute || {};

window.Tribute.createScenes = function createScenes({ engine, audio, data }) {
  const { el, button, sleep } = window.Tribute.Utils;
  const { Anim, InteractionEngine } = window.Tribute;

  function wrapScene(children, extraClass = "") {
    const scene = el("section", `scene ${extraClass}`.trim());
    const inner = el("div", "scene-inner");
    children.forEach(c => { if (c) inner.appendChild(c); });
    scene.appendChild(inner);
    return scene;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  /* -----------------------------------------------------------------------
     SHARED FULLSCREEN LIGHTBOX MODAL
     ----------------------------------------------------------------------- */
  let sharedModal = document.getElementById("shared-lightbox");
  if (!sharedModal) {
    sharedModal = el("div", "expanded-modal");
    sharedModal.id = "shared-lightbox";
    const closeBtn = button("✕", "close-expanded", "Close photograph");
    const content = el("div", "expanded-content");
    const imgWrap = el("div", "expanded-image-wrap");
    const modalImg = document.createElement("img");
    modalImg.alt = "Enlarged memory";
    imgWrap.appendChild(modalImg);
    const modalTitle = el("h2", "expanded-title");
    const modalCaption = el("p", "expanded-caption");
    content.append(imgWrap, modalTitle, modalCaption);
    sharedModal.append(closeBtn, content);
    document.body.appendChild(sharedModal);

    const closeModal = () => sharedModal.classList.remove("open");
    closeBtn.addEventListener("click", closeModal);
    sharedModal.addEventListener("click", (e) => {
      if (e.target === sharedModal || e.target === content) closeModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function openLightbox({ src, title, caption }) {
    const img = sharedModal.querySelector(".expanded-image-wrap img");
    const wrap = sharedModal.querySelector(".expanded-image-wrap");
    sharedModal.querySelector(".expanded-title").textContent = title || "";
    sharedModal.querySelector(".expanded-caption").textContent = caption || "";
    if (src) {
      img.src = src;
      img.style.display = "block";
      wrap.style.display = "flex";
    } else {
      img.style.display = "none";
      wrap.style.display = "none";
    }
    sharedModal.classList.add("open");
  }

  /* -----------------------------------------------------------------------
     SCENE 01: "8 BILLION PEOPLE" CINEMATIC 3-BEAT INTRO (from base)
     ----------------------------------------------------------------------- */
  function buildIntro() {
    const d = data.intro;
    const stage = el("div", "intro-beat-stage");

    const s1 = el("div", "intro-slide");
    s1.innerHTML = `<h1>${d.line1}</h1>`;

    const s2 = el("div", "intro-slide");
    s2.innerHTML = `<h1>${d.line2}</h1>`;

    const s3 = el("div", "intro-slide");
    s3.innerHTML = `
      <h1>${d.line3Prefix}<br><span class="intro-hero-name">${escapeHtml(data.teacherName)}</span> ✨</h1>
      <p class="subtitle" style="margin-top:14px;">${escapeHtml(d.subtitle)}</p>
    `;

    stage.append(s1, s2, s3);

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.opacity = "0";
    nextBtn.style.pointerEvents = "none";
    nextBtn.addEventListener("click", () => {
      audio.playBell(523.25, 1.5, 0.08, "sine");
      engine.next();
    });

    const scene = wrapScene([stage, nextBtn]);
    let runToken = 0;

    scene._onEnter = async () => {
      const myToken = ++runToken;
      [s1, s2, s3].forEach(s => s.classList.remove("visible"));
      nextBtn.style.opacity = "0";
      nextBtn.style.pointerEvents = "none";

      await sleep(350);
      if (myToken !== runToken) return;
      s1.classList.add("visible");

      await sleep(2300);
      if (myToken !== runToken) return;
      s1.classList.remove("visible");

      await sleep(750);
      if (myToken !== runToken) return;
      s2.classList.add("visible");

      await sleep(2300);
      if (myToken !== runToken) return;
      s2.classList.remove("visible");

      await sleep(750);
      if (myToken !== runToken) return;
      s3.classList.add("visible");
      audio.playBell(523.25, 2.4, 0.1, "sine");

      await sleep(700);
      if (myToken !== runToken) return;
      nextBtn.style.transition = "opacity 0.6s ease";
      nextBtn.style.opacity = "1";
      nextBtn.style.pointerEvents = "auto";
    };

    return scene;
  }

  /* -----------------------------------------------------------------------
     SCENE 02: DEDICATED PORTRAIT FRAME (from Chutu reference)
     ----------------------------------------------------------------------- */
  function buildPortrait() {
    const d = data.portrait;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.title);
    title.style.setProperty("--delay", "0.18s");

    const stage = el("div", "portrait-stage beat");
    stage.style.setProperty("--delay", "0.38s");

    const backlight = el("div", "portrait-backlight");
    const frame = el("div", "portrait-frame");
    const inner = el("div", "portrait-inner");

    const img = document.createElement("img");
    img.className = "portrait-image";
    img.alt = `${data.teacherName} Portrait`;

    const placeholder = el("div", "portrait-placeholder");
    placeholder.append(
      el("div", "portrait-monogram", data.teacherName.slice(0, 1).toUpperCase()),
      el("h3", "portrait-placeholder-title", data.teacherName),
      el("p", "portrait-placeholder-sub", data.subtitleRole)
    );
    inner.append(img, placeholder);

    const lip = el("div", "portrait-caption-lip");
    lip.append(
      el("span", "", d.captionTitle),
      el("span", "portrait-caption-hint", "Tap to view ✦")
    );
    frame.append(inner, lip);
    stage.append(backlight, frame);

    let hasPhoto = false;
    let triedAlt = false;
    const onLoad = () => {
      if (img.naturalWidth > 10) {
        hasPhoto = true;
        img.style.display = "block";
        placeholder.style.display = "none";
      }
    };
    const onErr = () => {
      if (!triedAlt && d.altImage) {
        triedAlt = true;
        img.src = d.altImage;
      } else {
        hasPhoto = false;
        img.style.display = "none";
        placeholder.style.display = "flex";
      }
    };
    img.onload = onLoad;
    img.onerror = onErr;
    img.src = d.image;
    if (img.complete && img.naturalWidth > 10) onLoad();

    frame.addEventListener("click", () => {
      audio.playBell(440, 1.3, 0.08, "sine");
      openLightbox({ src: hasPhoto ? img.src : "", title: d.captionTitle, caption: d.modalCaption });
    });

    new InteractionEngine().attachParallax(frame, 5);

    const subtitle = el("p", "subtitle beat", d.subtitle);
    subtitle.style.setProperty("--delay", "0.65s");

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.setProperty("--delay", "0.85s");
    nextBtn.addEventListener("click", () => engine.next());

    return wrapScene([eyebrow, title, stage, subtitle, nextBtn]);
  }

  /* -----------------------------------------------------------------------
     SCENE 03: TODAY'S MISSION (base Mission + Chutu 3D Gift Box)
     ----------------------------------------------------------------------- */
  function buildMission() {
    const d = data.mission;
    const eyebrow = el("div", "eyebrow", d.eyebrow);

    const spotlight = el("div", "gift-spotlight beat");
    spotlight.style.setProperty("--delay", "0.25s");
    const beam = el("div", "spotlight-beam");
    const gift = el("div", "gift-container");
    gift.setAttribute("role", "button");
    gift.setAttribute("tabindex", "0");
    gift.setAttribute("aria-label", "Open gift to reveal Today's Mission");
    gift.innerHTML = `
      <div class="gift-body">
        <div class="gift-ribbon-vertical"></div>
        <div class="gift-ribbon-horizontal"></div>
        <div class="gift-inner-glow"></div>
      </div>
      <div class="gift-lid-wrapper">
        <div class="gift-emblem">✦ ✨ ✦</div>
        <div class="gift-bow-mesh"></div>
      </div>
    `;
    const promptText = el("p", "subtitle", d.giftPrompt);
    spotlight.append(beam, gift, promptText);

    const card = el("div", "mission-card");
    const heading = el("h2", "", d.title);
    const ul = el("ul", "mission-list");
    const lis = d.items.map(text => {
      const li = el("li", "", text);
      ul.appendChild(li);
      return li;
    });

    const acceptBtn = button(d.cta, "action-tap");
    acceptBtn.style.opacity = "0";
    acceptBtn.addEventListener("click", () => {
      audio.playBell(587.33, 1.6, 0.1, "sine");
      engine.next();
    });

    card.append(heading, ul, acceptBtn);

    let opened = false;
    const openGift = async (e) => {
      if (opened) return;
      opened = true;
      gift.classList.add("opened");
      audio.playBell(523.25, 2.4, 0.14, "sine");
      Anim.spawnSparkles(
        (e && e.clientX) || window.innerWidth / 2,
        (e && e.clientY) || window.innerHeight / 2,
        30
      );

      await sleep(750);
      spotlight.style.display = "none";
      card.classList.add("revealed");

      for (const li of lis) {
        await sleep(320);
        li.classList.add("show");
      }
      await sleep(350);
      acceptBtn.style.transition = "opacity 0.5s ease";
      acceptBtn.style.opacity = "1";
    };

    gift.addEventListener("click", openGift);
    gift.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); }
    });

    const scene = wrapScene([eyebrow, spotlight, card]);
    scene._reset = () => {
      opened = false;
      gift.classList.remove("opened");
      spotlight.style.display = "flex";
      card.classList.remove("revealed");
      lis.forEach(li => li.classList.remove("show"));
      acceptBtn.style.opacity = "0";
    };
    return scene;
  }

  /* -----------------------------------------------------------------------
     SCENE 04: INTERACTIVE 3D APPRECIATION FLIP CARDS (from base, elevated)
     ----------------------------------------------------------------------- */
  function buildAppreciation() {
    const d = data.appreciation;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.title);
    title.style.setProperty("--delay", "0.18s");

    const grid = el("div", "flip-grid beat");
    grid.style.setProperty("--delay", "0.38s");

    const status = el("div", "cards-status beat", `${d.hint} • 0 / ${d.cards.length}`);
    status.style.setProperty("--delay", "0.55s");

    const revealed = new Set();
    const chimes = [392.00, 440.00, 493.88, 523.25];

    d.cards.forEach((item, idx) => {
      const card = el("div", "flip-card");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-face flip-front">
            <span class="flip-icon" aria-hidden="true">${item.icon}</span>
            <h2 class="flip-title">${item.title}</h2>
            <span class="flip-tap-badge">Tap to reveal</span>
          </div>
          <div class="flip-face flip-back">
            <p>${item.back}</p>
          </div>
        </div>
      `;

      const flip = (e) => {
        card.classList.toggle("flipped");
        revealed.add(idx);
        audio.playBell(chimes[idx % chimes.length], 1.4, 0.085, "sine");
        if (e && e.clientX) Anim.spawnSparkles(e.clientX, e.clientY, 10);
        status.textContent = revealed.size === d.cards.length
          ? "All appreciation notes revealed ✦"
          : `${d.hint} • ${revealed.size} / ${d.cards.length}`;
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
      grid.appendChild(card);
    });

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.setProperty("--delay", "0.75s");
    nextBtn.addEventListener("click", () => engine.next());

    return wrapScene([eyebrow, title, grid, status, nextBtn]);
  }

  /* -----------------------------------------------------------------------
     SCENE 05: CHERISHED MEMORIES POLAROID GALLERY (from Mama/Chutu)
     ----------------------------------------------------------------------- */
  function buildMemories() {
    const d = data.memories;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.title);
    title.style.setProperty("--delay", "0.18s");

    const stage = el("div", "memory-stage beat");
    stage.style.setProperty("--delay", "0.38s");

    const frame = el("div", "photo-frame");
    const inner = el("div", "photo-inner");

    const img = document.createElement("img");
    img.className = "photo-image";
    img.alt = "Cherished classroom memory";

    const placeholder = el("div", "photo-placeholder");
    placeholder.innerHTML = `
      <span class="photo-placeholder-icon">✦</span>
      <h3 class="photo-placeholder-title"></h3>
      <p class="photo-placeholder-caption"></p>
    `;
    inner.append(img, placeholder);

    const lip = el("div", "photo-caption-lip");
    const lipTitle = el("span", "", "");
    lip.append(lipTitle, el("span", "photo-caption-hint", "Tap to view 🔍"));
    frame.append(inner, lip);
    stage.appendChild(frame);

    const controls = el("div", "memory-controls");
    const prevBtn = button("←", "nav-arrow", "Previous memory");
    const counter = el("span", "memory-counter", `01 / 0${d.items.length}`);
    const nextBtn = button("→", "nav-arrow", "Next memory");
    controls.append(prevBtn, counter, nextBtn);
    stage.appendChild(controls);

    let idx = 0;
    let currentLoaded = false;

    function renderItem() {
      const item = d.items[idx];
      counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(d.items.length).padStart(2, "0")}`;
      lipTitle.textContent = item.title;
      placeholder.querySelector(".photo-placeholder-title").textContent = item.title;
      placeholder.querySelector(".photo-placeholder-caption").textContent = item.caption;

      currentLoaded = false;
      img.onload = () => {
        if (img.naturalWidth > 10) {
          currentLoaded = true;
          img.style.display = "block";
          placeholder.style.display = "none";
        }
      };
      img.onerror = () => {
        currentLoaded = false;
        img.style.display = "none";
        placeholder.style.display = "flex";
      };
      img.src = item.image;
      if (img.complete && img.naturalWidth > 10) {
        currentLoaded = true;
        img.style.display = "block";
        placeholder.style.display = "none";
      } else if (img.complete) {
        img.style.display = "none";
        placeholder.style.display = "flex";
      }
    }

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      idx = (idx - 1 + d.items.length) % d.items.length;
      renderItem();
      audio.playBell(349.23, 1.2, 0.08, "sine");
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      idx = (idx + 1) % d.items.length;
      renderItem();
      audio.playBell(392.00, 1.2, 0.08, "sine");
    });

    frame.addEventListener("click", () => {
      const item = d.items[idx];
      openLightbox({ src: currentLoaded ? img.src : "", title: item.title, caption: item.caption });
    });

    const interaction = new InteractionEngine({
      onSwipeLeft: () => nextBtn.click(),
      onSwipeRight: () => prevBtn.click()
    });
    interaction.attachTouch(frame);
    interaction.attachParallax(frame, 6);
    renderItem();

    const continueBtn = button(d.cta, "action-tap");
    continueBtn.style.setProperty("--delay", "0.7s");
    continueBtn.addEventListener("click", () => engine.next());

    return wrapScene([eyebrow, title, stage, continueBtn]);
  }

  /* -----------------------------------------------------------------------
     SCENE 06: VOICES OF GRATITUDE & HEARTFELT LETTER (from Mama/Chutu)
     ----------------------------------------------------------------------- */
  function buildWishesAndLetter() {
    const d = data.wishesAndLetter;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.title);
    title.style.setProperty("--delay", "0.18s");

    const letterBox = el("div", "letter-parchment-box beat");
    letterBox.style.setProperty("--delay", "0.38s");
    letterBox.style.marginTop = "14px";
    letterBox.style.maxWidth = "560px";

    const salutation = el("h2", "letter-salutation", d.salutation);
    const body = el("div", "letter-body");
    d.letterParagraphs.forEach(p => body.appendChild(el("p", "", p)));
    const closing = el("div", "letter-closing", d.closing);
    letterBox.append(salutation, body, closing);

    const wishStrip = el("div", "message-stage beat");
    wishStrip.style.setProperty("--delay", "0.62s");
    wishStrip.style.minHeight = "146px";
    wishStrip.style.marginTop = "14px";

    const cards = [];
    const dotsWrap = el("div", "message-dots");
    const dots = [];
    let wIdx = 0;

    d.wishes.forEach((w, i) => {
      const card = el("div", "message-card");
      card.style.padding = "16px 20px";
      card.style.setProperty("--tilt", i % 2 === 0 ? "-0.8deg" : "0.8deg");
      const quote = el("p", "message-quote", `“${w.text}”`);
      quote.style.fontSize = "clamp(14.5px,3.6vw,17px)";
      quote.style.marginBottom = "8px";
      card.append(quote, el("span", "message-author", `— ${w.author}`));
      wishStrip.appendChild(card);
      cards.push(card);

      const dot = button("", "msg-dot", `Wish ${i + 1}`);
      dot.addEventListener("click", (e) => { e.stopPropagation(); showWish(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function showWish(i) {
      const prev = wIdx;
      wIdx = i;
      cards.forEach((c, idx) => {
        c.classList.toggle("active-message", idx === wIdx);
        c.classList.toggle("prev-message", idx === prev && prev !== wIdx);
      });
      dots.forEach((dt, idx) => dt.classList.toggle("active", idx === wIdx));
    }
    showWish(0);

    wishStrip.addEventListener("click", () => {
      showWish((wIdx + 1) % cards.length);
      audio.playBell(440 + wIdx * 30, 1.2, 0.07, "sine");
    });

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.setProperty("--delay", "0.85s");
    nextBtn.addEventListener("click", () => engine.next());

    return wrapScene([eyebrow, title, letterBox, wishStrip, dotsWrap, nextBtn]);
  }

  /* -----------------------------------------------------------------------
     SCENE 07: STARRY NIGHT & SHOOTING STARS (from base, NO romantic heart)
     ----------------------------------------------------------------------- */
  function buildNight() {
    const d = data.night;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const msg = el("h1", "title beat");
    msg.style.setProperty("--delay", "0.35s");
    msg.style.fontSize = "clamp(26px, 6.8vw, 48px)";
    msg.style.lineHeight = "1.45";
    msg.innerHTML = d.message;

    const hint = el("p", "sky-tap-hint beat", d.hint);
    hint.style.setProperty("--delay", "0.8s");

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.setProperty("--delay", "1.15s");
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      engine.next();
    });

    const scene = wrapScene([eyebrow, msg, hint, nextBtn]);
    scene.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      Anim.spawnShootingStar(e.clientX, e.clientY);
      Anim.spawnSparkles(e.clientX, e.clientY, 12);
      audio.playBell(587.33 + Math.random() * 140, 1.6, 0.075, "sine");
    });

    scene._onEnter = () => {
      setTimeout(() => Anim.spawnShootingStar(), 700);
      setTimeout(() => Anim.spawnShootingStar(), 2300);
    };
    return scene;
  }

  /* -----------------------------------------------------------------------
     SCENE 08: 3D BIRTHDAY CAKE, SONG, CONFETTI & FIREWORKS
     ----------------------------------------------------------------------- */
  function buildCelebration() {
    const d = data.celebration;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.titlePrefix);
    title.style.setProperty("--delay", "0.18s");

    const nameTitle = el("h2", "title huge beat gold-accent celebration-title-name", d.titleName);
    nameTitle.style.setProperty("--delay", "0.35s");

    const decoRow = el("div", "decorations-row beat");
    decoRow.style.setProperty("--delay", "0.5s");
    decoRow.innerHTML = `<span class="deco-star">✦</span><span class="deco-star">✨</span><span class="deco-star">✦</span>`;

    const cakeWrap = el("div", "cake-wrapper beat");
    cakeWrap.style.setProperty("--delay", "0.58s");
    cakeWrap.setAttribute("role", "button");
    cakeWrap.setAttribute("tabindex", "0");
    cakeWrap.setAttribute("aria-label", "Tap to blow out the birthday candles");

    const candlesRow = el("div", "candles-row");
    for (let i = 0; i < 3; i++) {
      const stick = el("div", "candle-stick");
      stick.appendChild(el("div", "candle-flame"));
      candlesRow.appendChild(stick);
    }
    cakeWrap.append(
      el("div", "cake-halo"),
      el("div", "cake-plate"),
      el("div", "cake-tier-bottom"),
      el("div", "cake-tier-top"),
      candlesRow
    );

    const wishHint = el("p", "subtitle beat", d.tapHint);
    wishHint.style.setProperty("--delay", "0.7s");

    const msgCard = el("div", "full-birthday-message");
    msgCard.appendChild(el("p", "birthday-card-text", d.cardText));

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.setProperty("--delay", "0.95s");
    nextBtn.addEventListener("click", () => engine.next());

    const scene = wrapScene([eyebrow, title, nameTitle, decoRow, cakeWrap, wishHint, msgCard, nextBtn]);

    let blownOut = false;
    const celebrate = (e) => {
      if (blownOut) return;
      blownOut = true;
      candlesRow.classList.add("flames-out");
      scene.classList.add("celebration-active");
      wishHint.textContent = d.wishedText;
      wishHint.classList.add("gold-accent");

      audio.setMode("celebration");
      audio.playBell(659.25, 2.2, 0.16, "sine");
      Anim.spawnSparkles(
        (e && e.clientX) || window.innerWidth / 2,
        (e && e.clientY) || window.innerHeight / 2,
        42
      );
      Anim.launchConfetti(95);
      setTimeout(() => Anim.launchFireworks(8), 420);
    };

    cakeWrap.addEventListener("click", celebrate);
    cakeWrap.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); celebrate(); }
    });

    scene._reset = () => {
      blownOut = false;
      candlesRow.classList.remove("flames-out");
      scene.classList.remove("celebration-active");
      wishHint.textContent = d.tapHint;
      wishHint.classList.remove("gold-accent");
    };
    return scene;
  }

  /* -----------------------------------------------------------------------
     SCENE 09: CODE TERMINAL FINALE (tribute.js — from base)
     ----------------------------------------------------------------------- */
  function buildCodeTerminal() {
    const d = data.codeTerminal;
    const termBox = el("div", "code-terminal-box");
    const header = el("div", "terminal-header");
    header.innerHTML = `
      <span class="term-dot gold"></span>
      <span class="term-dot cream"></span>
      <span class="term-dot muted"></span>
      <span class="term-label">${d.filename}</span>
    `;
    const codeLines = el("div", "");
    termBox.append(header, codeLines);

    const successMsg = el("div", "term-success", d.successText);
    const eot = el("div", "eot-text", d.eotText);

    const nextBtn = button(d.cta, "action-tap");
    nextBtn.style.opacity = "0";
    nextBtn.style.pointerEvents = "none";
    nextBtn.addEventListener("click", () => engine.next());

    const scene = wrapScene([termBox, successMsg, eot, nextBtn]);
    let runToken = 0;

    scene._onEnter = async () => {
      const myToken = ++runToken;
      codeLines.innerHTML = "";
      successMsg.classList.remove("show");
      eot.classList.remove("show");
      nextBtn.style.opacity = "0";
      nextBtn.style.pointerEvents = "none";

      await sleep(350);
      for (const line of d.lines) {
        if (myToken !== runToken) return;
        const div = el("div", "code-line");
        codeLines.appendChild(div);
        if (line === "") { await sleep(150); continue; }
        await Anim.type(div, line, 22);
        await sleep(80);
      }

      if (myToken !== runToken) return;
      await sleep(450);
      successMsg.classList.add("show");
      audio.playBell(523.25, 1.8, 0.1, "sine");

      await sleep(750);
      if (myToken !== runToken) return;
      eot.classList.add("show");

      await sleep(600);
      if (myToken !== runToken) return;
      nextBtn.style.transition = "opacity 0.6s ease";
      nextBtn.style.opacity = "1";
      nextBtn.style.pointerEvents = "auto";
    };

    return scene;
  }

  /* -----------------------------------------------------------------------
     SCENE 10: INTERACTIVE KEEPSAKE MEMORY BOOK (from base, teacher edition)
     ----------------------------------------------------------------------- */
  function buildMemoryBook() {
    const d = data.memoryBook;
    const eyebrow = el("div", "eyebrow", d.eyebrow);
    const title = el("h1", "title beat", d.title);
    title.style.setProperty("--delay", "0.18s");

    const bookStage = el("div", "memory-book-stage beat");
    bookStage.style.setProperty("--delay", "0.38s");

    const prevBtn = button("‹", "nav-arrow", "Previous page");
    const card = el("div", "memory-book-card");
    const nextBtn = button("›", "nav-arrow", "Next page");
    bookStage.append(prevBtn, card, nextBtn);

    const counter = el("div", "book-page-counter", `Page 1 of ${d.pages.length}`);

    const actions = el("div", "finale-actions beat");
    actions.style.setProperty("--delay", "0.65s");
    const replayBtn = button("✦ Replay Experience", "action-secondary");
    replayBtn.addEventListener("click", () => engine.replay());
    actions.appendChild(replayBtn);

    let pIdx = 0;
    function renderPage() {
      const p = d.pages[pIdx];
      card.classList.remove("turn-in");
      void card.offsetWidth;
      card.classList.add("turn-in");
      const kicker = el("div", "book-kicker", p.kicker);
      const icon = el("div", "book-icon", p.icon);
      icon.setAttribute("aria-hidden", "true");
      card.replaceChildren(kicker, icon, el("h2", "book-title", p.title), el("p", "book-body", p.body));
      counter.textContent = `Page ${pIdx + 1} of ${d.pages.length}`;
      prevBtn.style.opacity = pIdx === 0 ? "0.35" : "1";
      nextBtn.style.opacity = pIdx === d.pages.length - 1 ? "0.35" : "1";
    }

    prevBtn.addEventListener("click", () => {
      if (pIdx > 0) { pIdx--; renderPage(); audio.playBell(392, 1.1, 0.07, "sine"); }
    });
    nextBtn.addEventListener("click", () => {
      if (pIdx < d.pages.length - 1) { pIdx++; renderPage(); audio.playBell(440, 1.1, 0.07, "sine"); }
    });

    new InteractionEngine({
      onSwipeLeft: () => nextBtn.click(),
      onSwipeRight: () => prevBtn.click()
    }).attachTouch(card);

    renderPage();

    const scene = wrapScene([eyebrow, title, bookStage, counter, actions]);
    scene._reset = () => { pIdx = 0; renderPage(); };
    return scene;
  }

  return [
    { name: "Intro", mood: "morning", audioMode: "quiet", build: buildIntro },
    { name: "Portrait", mood: "morning", audioMode: "warm", build: buildPortrait },
    { name: "Mission", mood: "sunset", audioMode: "warm", build: buildMission },
    { name: "Gratitude", mood: "sunset", audioMode: "warm", build: buildAppreciation },
    { name: "Memories", mood: "warm", audioMode: "warm", build: buildMemories },
    { name: "Letter", mood: "golden", audioMode: "warm", build: buildWishesAndLetter },
    { name: "Night Sky", mood: "night", audioMode: "quiet", build: buildNight },
    { name: "Celebration", mood: "night", audioMode: "warm", build: buildCelebration },
    { name: "Tribute", mood: "night", audioMode: "finale", build: buildCodeTerminal },
    { name: "Memory Book", mood: "night", audioMode: "finale", build: buildMemoryBook }
  ];
};
