/* =========================================================================
   TEACHER BIRTHDAY PROFILE & CONTENT CONFIGURATION
   Edit any text or image paths below to personalize the experience further.
   ========================================================================= */

window.TEACHER_DATA = {
  teacherName: "Ritika Ma'am",
  subtitleRole: "Mentor • Guide • Inspiration",

  universeBoot: [
    { text: "Booting Reality Engine...", speed: 24, pause: 450, stars: 8 },
    { text: "Initializing Universe...", speed: 22, pause: 420, stars: 10 },
    { text: "Loading Constellations...", speed: 22, pause: 450, stars: 14 },
    { text: "Scanning Classrooms & Memories...", speed: 24, pause: 500, stars: 10 },
    { text: "Searching for an extraordinary mentor...", speed: 22, pause: 550, stars: 8 },
    { text: "Target Located: Ritika Ma'am ✓", speed: 24, pause: 750, stars: 16, highlight: true },
    { text: "Preparing Birthday Tribute...", speed: 24, pause: 500, stars: 10 },
    { text: "Welcome, Ritika Ma'am.", speed: 32, pause: 650, stars: 0, highlight: true }
  ],

  intro: {
    line1: "There are<br>8 billion people<br>on this planet.",
    line2: "Today,<br>one extraordinary teacher<br>has a birthday.",
    line3Prefix: "Happy Birthday,",
    subtitle: "For every lesson taught with patience and every mind you have inspired.",
    cta: "Begin the Journey →"
  },

  portrait: {
    eyebrow: "A PRESENCE THAT INSPIRES",
    title: "Grace, Wisdom & Warmth",
    image: "assets/images/portrait.jpg",
    altImage: "assets/images/teacher.jpg",
    captionTitle: "Ritika Ma'am",
    modalCaption: "With patience, grace, and an inspiring spirit that brightens every classroom.",
    subtitle: "A teacher's influence never fades — it lives on in every student who learned to believe in themselves.",
    cta: "Today's Mission →"
  },

  mission: {
    eyebrow: "SPECIAL BIRTHDAY BRIEFING",
    giftPrompt: "Tap the gift to reveal Today's Mission 🎁",
    title: "Today's Mission",
    items: [
      "✓ Smile Brightly All Day",
      "✓ Enjoy Every Slice of Cake",
      "✓ Take a Well-Deserved Break",
      "✓ Know How Deeply You Are Appreciated"
    ],
    cta: "Mission Accepted ✓"
  },

  appreciation: {
    eyebrow: "LESSONS BEYOND THE CLASSROOM",
    title: "Four Reasons We Are Grateful",
    hint: "Tap each card to reveal ✦",
    cards: [
      {
        icon: "📖",
        title: "Clarity & Wisdom",
        back: "You turn the most challenging topics into moments of genuine understanding and curiosity."
      },
      {
        icon: "🌟",
        title: "Endless Patience",
        back: "You listen with warmth, explain without hesitation, and always encourage us to keep going."
      },
      {
        icon: "🧭",
        title: "True Mentorship",
        back: "Your guidance reaches far beyond textbooks and exams — it shapes how we think and grow."
      },
      {
        icon: "✨",
        title: "Lasting Inspiration",
        back: "Every class leaves a quiet spark of confidence that stays with us long after the bell rings."
      }
    ],
    cta: "Step Into the Memories →"
  },

  memories: {
    eyebrow: "CHERISHED MOMENTS",
    title: "Moments Worth Keeping",
    items: [
      {
        id: "01",
        image: "assets/images/memories/01.jpg",
        title: "Lessons Filled With Light",
        caption: "The kind of classes where learning felt effortless and curiosity was always welcomed."
      },
      {
        id: "02",
        image: "assets/images/memories/02.jpg",
        title: "Smiles Along the Way",
        caption: "Shared laughter, warm conversations, and the joy of being encouraged by a wonderful mentor."
      },
      {
        id: "03",
        image: "assets/images/memories/03.jpg",
        title: "Moments of Pride",
        caption: "Every milestone reached felt brighter knowing you were cheering us on."
      },
      {
        id: "04",
        image: "assets/images/memories/04.jpg",
        title: "Gratitude Held in Time",
        caption: "Snapshots of a chapter we will always look back on with deep respect and fondness."
      }
    ],
    cta: "Read Wishes & Letter →"
  },

  wishesAndLetter: {
    eyebrow: "VOICES OF GRATITUDE",
    title: "Words From Our Hearts",
    wishes: [
      {
        text: "Wishing you a year filled with good health, peaceful mornings, and the same joy you bring into every classroom.",
        author: "With deepest gratitude"
      },
      {
        text: "Thank you for never giving up on us, celebrating our small wins, and showing us what true dedication looks like.",
        author: "From your grateful students"
      },
      {
        text: "May this new year bring you new adventures, well-deserved rest, and countless reasons to smile every day.",
        author: "With warmest regards"
      }
    ],
    salutation: "Dear Ritika Ma'am,",
    letterParagraphs: [
      "Great teachers teach what is written on the page, but extraordinary teachers like you teach patience, integrity, curiosity, and quiet confidence simply by the way you show up every day.",
      "Thank you for your warmth, your encouragement, and your belief in every student. We hope today surrounds you with the same appreciation and happiness you give all year long."
    ],
    closing: "With deepest respect and warmest wishes, always.",
    cta: "Step Under the Night Sky →"
  },

  night: {
    eyebrow: "A QUIET WISH",
    message: "Some gratitude<br>goes deeper than words<br>can ever say. ✨",
    hint: "Tap anywhere on the sky to launch a shooting star ✦",
    cta: "Time for Cake & Celebration →"
  },

  celebration: {
    eyebrow: "THE CELEBRATION",
    titlePrefix: "Happy Birthday,",
    titleName: "Ritika Ma'am!",
    tapHint: "Tap the cake to blow out the candles & play the birthday song 🎂",
    wishedText: "May every wish you make today come true ✨",
    cardText: "Wishing you a truly wonderful birthday and a bright, fulfilling year ahead, Ritika Ma'am! May good health, peace, and happiness follow you wherever you go.",
    cta: "Run Final Tribute →"
  },

  codeTerminal: {
    filename: "tribute.js",
    lines: [
      'const mentor = "Ritika Ma\'am";',
      "",
      "if (today.isBirthdayOf(mentor)) {",
      "    gratitude++;",
      "    smiles++;",
      "    blessings++;",
      "    cake++;",
      "}",
      "",
      'return "Happy Birthday, Ritika Ma\'am! ✨";'
    ],
    successText: "✓ Tribute Executed Successfully.",
    eotText: "END OF TRANSMISSION",
    cta: "Open Keepsake Memory Book →"
  },

  memoryBook: {
    eyebrow: "KEEPSAKE MEMORY BOOK",
    title: "A Journey Through Today",
    pages: [
      { kicker: "Cover", icon: "📖", title: "For Ritika Ma'am", body: "Turn the pages to revisit every chapter of your birthday tribute." },
      { kicker: "Chapter 01", icon: "✦", title: "Universe Initialized", body: "Constellations aligned and the universe located an extraordinary teacher." },
      { kicker: "Chapter 02", icon: "☁️", title: "Out of 8 Billion", body: "Among billions on this planet, today celebrates one inspiring mentor." },
      { kicker: "Chapter 03", icon: "🎁", title: "Today's Mission", body: "Smile brightly, enjoy cake, take a break, and feel deeply appreciated." },
      { kicker: "Chapter 04", icon: "🌟", title: "Cards of Gratitude", body: "Clarity, patience, mentorship, and lasting inspiration beyond the classroom." },
      { kicker: "Chapter 05", icon: "📷", title: "Cherished Moments", body: "Lessons filled with light, shared smiles, and milestones worth keeping." },
      { kicker: "Chapter 06", icon: "☾", title: "Under the Night Sky", body: "Shooting stars carried quiet wishes of health, peace, and happiness." },
      { kicker: "Chapter 07", icon: "🎂", title: "The Celebration", body: "Candles, birthday song, confetti, and fireworks lighting up the sky." },
      { kicker: "Final Page", icon: "✨", title: "Happy Birthday, Ma'am", body: "Thank you for being a teacher we will always remember with pride and gratitude." }
    ]
  }
};
