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
    line2: "Today,<br>one extraordinary person<br>has a birthday.",
    line3Prefix: "Happy Birthday,",
    subtitle: "A birthday celebration for someone wonderful and deeply appreciated.",
    cta: "Begin the Journey →"
  },

  portrait: {
    eyebrow: "A PRESENCE THAT INSPIRES",
    title: "Grace, Wisdom & Warmth",
    image: "assets/images/portrait.jpg",
    altImage: "assets/images/teacher.jpg",
    captionTitle: "Ritika Ma'am",
    modalCaption: "With warmth, grace, and a spirit that brightens every room.",
    subtitle: "A special person whose kindness and presence make a lasting difference.",
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
        back: "You make ordinary days brighter with your thoughtfulness and unique way of seeing the world."
      },
      {
        icon: "🌟",
        title: "Endless Patience",
        back: "You listen with warmth, explain without hesitation, and always encourage us to keep going."
      },
      {
        icon: "🧭",
        title: "True Mentorship",
        back: "Your support and perspective make a difference in all the ways that matter."
      },
      {
        icon: "✨",
        title: "Lasting Inspiration",
        back: "Every conversation leaves a quiet spark of joy that stays with us long after the moment passes."
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
        title: "Light in Every Moment",
        caption: "A snapshot of the moments that make this story yours."
      },
      {
        id: "02",
        image: "assets/images/memories/02.jpg",
        title: "Smiles Along the Way",
        caption: "Shared laughter and little moments that stay with us."
      },
      {
        id: "03",
        image: "assets/images/memories/03.jpg",
        title: "Moments of Pride",
        caption: "A milestone made brighter by having you there."
      },
      {
        id: "04",
        image: "assets/images/memories/04.jpg",
        title: "Gratitude Held in Time",
        caption: "A memory we will always look back on with warmth."
      }
    ],
    cta: "Read Wishes & Letter →"
  },

  wishesAndLetter: {
    eyebrow: "VOICES OF GRATITUDE",
    title: "Words From Our Hearts",
    wishes: [
      {
        text: "Wishing you a year filled with good health, peaceful mornings, and all the happiness you deserve.",
        author: "With deepest gratitude"
      },
      {
        text: "Thank you for the kindness, encouragement, and joy you bring to the people around you.",
        author: "With love and appreciation"
      },
      {
        text: "May this new year bring you new adventures, well-deserved rest, and countless reasons to smile every day.",
        author: "With warmest regards"
      }
    ],
    salutation: "Dear Ritika Ma'am,",
    letterParagraphs: [
      "Some people make life brighter simply by being themselves. Today is a chance to celebrate the kindness, joy, and warmth you share so generously.",
      "Thank you for the care and encouragement you give to the people around you. We hope today surrounds you with the same happiness you bring to others."
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
    cardText: "Wishing you a truly wonderful birthday and a bright, fulfilling year ahead! May good health, peace, and happiness follow you wherever you go.",
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
      { kicker: "Chapter 01", icon: "✦", title: "Universe Initialized", body: "Constellations aligned and the universe found someone extraordinary to celebrate." },
      { kicker: "Chapter 02", icon: "☁️", title: "Out of 8 Billion", body: "Among billions on this planet, today celebrates someone deeply loved." },
      { kicker: "Chapter 03", icon: "🎁", title: "Today's Mission", body: "Smile brightly, enjoy cake, take a break, and feel deeply appreciated." },
      { kicker: "Chapter 04", icon: "🌟", title: "Cards of Gratitude", body: "Kindness, encouragement, laughter, and all the little things that make you special." },
      { kicker: "Chapter 05", icon: "📷", title: "Cherished Moments", body: "Lessons filled with light, shared smiles, and milestones worth keeping." },
      { kicker: "Chapter 06", icon: "☾", title: "Under the Night Sky", body: "Shooting stars carried quiet wishes of health, peace, and happiness." },
      { kicker: "Chapter 07", icon: "🎂", title: "The Celebration", body: "Candles, birthday song, confetti, and fireworks lighting up the sky." },
      { kicker: "Final Page", icon: "✨", title: "Happy Birthday", body: "Thank you for being someone we will always remember with love and gratitude." }
    ]
  }
};
