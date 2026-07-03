export const BOT_LINES = {
  party_size: {
    opening: "Mortal! How many souls hunger tonight?",
    chips: [
      { label: "Just me, my lord...", value: 1 },
      { label: "Two of us, God of all pizzas!", value: 2 },
      { label: "Three humans.", value: 3 },
      { label: "There's gonna be a slaughter!", value: 4 },
    ],
    acknowledge: {
      1: "One. An easy prophecy.",
      2: "Two. Perfect.",
      3: "Three. Noted.",
      4: "Four. Make sure to send them enough napkins!",
    },
  },
  constraints: {
    opening: "Any allergies I should know about?",
    chips: ["Gluten", "Milk", "Egg", "Soy", "Nuts", "Sesame", "Mustard", "Sulphites"],
    noAllergy: "We're good",
    freeTextPlaceholder: "Tell me what to avoid...",
  },
  vibe: {
    opening: "What kind of night is this?",
    chips: [
      { label: "Just need to eat something in peace", value: "quiet" },
      { label: "Movie marathon", value: "movie" },
      { label: "Need food NOW", value: "starving" },
      { label: "We're gonna celebrate", value: "celebration" },
    ],
    acknowledge: {
      quiet: "The quieter the evening, the wiser the choice.",
      movie: "A movie deserves proper company.",
      starving: "I'll favor speed and satisfaction.",
      celebration: "Then we'll make it memorable.",
    },
  },
  thinking: [
    "Reading the sacred cookbook...",
    "Consulting the pizza gods...",
  ],
  error: "Even the gods stumble. Try again, mortal.",
}
