window.TRIBUTE_CONFIG_READY = fetch("dashboard/studio-config.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(`Birthday profile config request failed (${response.status}).`);
    return response.json();
  })
  .then((config) => {
    const data = window.TEACHER_DATA;
    if (!data || !config || typeof config !== "object") {
      throw new Error("Birthday profile config is invalid.");
    }

    const recipient = typeof config.recipient === "string" && config.recipient.trim()
      ? config.recipient.trim()
      : data.teacherName;
    const profession = typeof config.profession === "string" && config.profession.trim()
      ? config.profession.trim()
      : "teacher";
    const professionInSentence = profession.charAt(0).toLowerCase() + profession.slice(1);
    const relationship = typeof config.relationshipToRitika === "string"
      ? config.relationshipToRitika.trim()
      : "";
    const openingLine = typeof config.openingLine === "string" && config.openingLine.trim()
      ? config.openingLine.trim()
      : "";
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);

    data.teacherName = recipient;
    data.subtitleRole = profession;
    data.intro.line2 = `Today,<br>one extraordinary ${escapeHtml(professionInSentence)}<br>has a birthday.`;
    const connection = relationship
      ? `Ritika Ma'am's ${relationship}`
      : `someone special to Ritika Ma'am`;
    data.intro.subtitle = `${openingLine} Celebrating ${recipient}, ${connection}.`;
    data.portrait.captionTitle = recipient;
    data.portrait.subtitle = relationship
      ? `${profession} · Ritika Ma'am's ${relationship}`
      : `${profession} · Someone special to Ritika Ma'am`;
    data.portrait.title = typeof config.headline === "string" && config.headline.trim()
      ? config.headline.trim()
      : data.portrait.title;

    const resolveImage = (image, fallback) => {
      if (typeof image !== "string" || !image) return fallback;
      return image.startsWith("/uploads/") ? `dashboard${image}` : image;
    };
    if (typeof config.portraitImage === "string" && config.portraitImage) {
      data.portrait.image = resolveImage(config.portraitImage, data.portrait.image);
      data.portrait.altImage = "";
    }
    if (Array.isArray(config.memories) && config.memories.length === data.memories.items.length) {
      data.memories.items = data.memories.items.map((item, index) => {
        const memory = config.memories[index];
        return {
          ...item,
          image: resolveImage(memory.image, item.image),
          title: memory.title || item.title,
          caption: memory.caption || item.caption
        };
      });
    }
    if (Array.isArray(config.wishes) && config.wishes.length) {
      data.wishesAndLetter.wishes = config.wishes;
    }
    if (typeof config.finalClosing === "string" && config.finalClosing.trim()) {
      data.wishesAndLetter.closing = config.finalClosing.trim();
    }
    data.wishesAndLetter.salutation = `Dear ${recipient},`;
    if (typeof config.celebrationMessage === "string" && config.celebrationMessage.trim()) {
      data.celebration.cardText = config.celebrationMessage.trim();
    }
    data.celebration.titleName = `${recipient}!`;
    data.universeBoot[4].text = `Searching for a special birthday person...`;
    data.universeBoot[5].text = `Target Located: ${recipient} ✓`;
    data.universeBoot[7].text = `Welcome, ${recipient}.`;
    data.codeTerminal.lines = [
      `const birthdayPerson = "${recipient}";`,
      `const profession = "${profession}";`,
      "",
      "if (today.isBirthdayOf(birthdayPerson)) {",
      "    gratitude++;",
      "    smiles++;",
      "    blessings++;",
      "    cake++;",
      "}",
      "",
      `return "Happy Birthday, ${recipient}! ✨";`
    ];
    data.memoryBook.pages[0].title = `For ${recipient}`;
    data.memoryBook.pages[data.memoryBook.pages.length - 1].title = `Happy Birthday, ${recipient}!`;
    if (typeof config.finalMessage === "string" && config.finalMessage.trim()) {
      data.memoryBook.pages[data.memoryBook.pages.length - 1].body = config.finalMessage.trim();
    }
    if (typeof config.finalClosing === "string" && config.finalClosing.trim()) {
      const lastPage = data.memoryBook.pages[data.memoryBook.pages.length - 1];
      lastPage.body += ` ${config.finalClosing.trim()}`;
    }
    const entryTitle = document.querySelector(".entry-title");
    if (entryTitle) entryTitle.textContent = `For ${recipient}`;
    document.title = `Happy Birthday, ${recipient}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `A birthday tribute for ${recipient}, a ${profession} special to Ritika Ma'am.`;
  })
  .catch((error) => {
    console.warn("Using the tribute's built-in profile because dashboard settings could not be loaded.", error);
  });
