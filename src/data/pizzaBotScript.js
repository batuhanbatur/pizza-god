export const BOT_LINES = {
  party_size: {
    opening: "Mortal! How many souls hunger tonight?",
    footerLabel: "Number of People?",
    chips: [
      { label: "1", value: 1, chatLabel: "Just me, my lord..." },
      { label: "2", value: 2, chatLabel: "Two of us, God of all pizzas!" },
      { label: "3", value: 3, chatLabel: "Three humans." },
      { label: "4", value: 4, chatLabel: "There's gonna be a slaughter!" },
    ],
    chatLabelMany: (n) => `We are ${n}. Prepare the ovens.`,
    acknowledge: {
      1: "One. An easy prophecy.",
      2: "Two. Perfect.",
      3: "Three. Noted.",
      4: "Four. Make sure to send them enough napkins!",
    },
    acknowledgeMany: "Many mouths to feed. The prophecy grows complicated.",
  },
  constraints: {
    opening: "Any allergies I should know about?",
    footerLabel: "Any Allergens?",
    chips: ["Gluten", "Milk", "Egg", "Soy", "Nuts", "Sesame", "Mustard", "Sulphites"],
    noAllergy: "No allergies.",
    acknowledge: "Noted. I'll keep those off your plate.",
    acknowledgeNone: "Good. No restrictions.",
  },
  vibe: {
    opening: "What kind of night is this?",
    footerLabel: "Just a little more info...",
    chips: [
      { label: "Just need to eat something in peace", value: "quiet", chatLabel: "Just need to eat something in peace" },
      { label: "Movie marathon", value: "movie", chatLabel: "Movie marathon" },
      { label: "Need food NOW", value: "starving", chatLabel: "Need food NOW" },
      { label: "We're gonna celebrate", value: "celebration", chatLabel: "We're gonna celebrate" },
    ],
    acknowledge: {
      quiet: "The quieter the evening, the wiser the choice.",
      movie: "A movie deserves proper company.",
      starving: "I'll favor speed and satisfaction.",
      celebration: "Then we'll make it memorable.",
    },
    freeTextPlaceholder: "or tell me about tonight...",
  },
  thinking: [
    "Reading the sacred cookbook...",
    "Consulting the pizza gods...",
  ],
  error: "Even the gods stumble. Try again, mortal.",
}
