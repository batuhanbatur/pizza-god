export const MENU = {
  classics: {
    label: "Classics",
    items: [
      {
        id: "margherita",
        name: "Margherita",
        tagline: "What else could you expect for the first item?",
        description: "Tomato sauce, mozzarella, basil",
        price: 12.99,
        allergens: ["Gluten", "Milk"],
        tags: ["Vegetarian", "Classic"],
      },
      {
        id: "pepperoni",
        name: "Pepperoni",
        tagline: "expecting one-liner",
        description: "Tomato sauce, mozzarella, pepperoni",
        price: 14.99,
        allergens: ["Gluten", "Milk"],
        tags: ["Classic", "Meat"],
      },
      {
        id: "four-cheese",
        name: "4Chee",
        description: "Mozzarella, cheddar, parmesan, gorgonzola",
        tagline: "expecting one-liner",
        price: 15.99,
        allergens: ["Gluten", "Milk"],
        tags: ["Vegetarian"],
      },
      {
        id: "heavy-metal-queen",
        name: "Heavy Metal Queen",
        description: "Pepperoni, beef, Italian sausage, mozzarella",
        tagline: "For the ones who like it hard.",
        price: 17.99,
        allergens: ["Gluten", "Milk"],
        tags: ["Meat"],
      },

      {
        id: "mushroom-samba",
        name: "Mushroom Samba",
        description:
          "Mushroom, bell pepper, red onion, black olives, mozzarella",
        tagline: "These are definitely normal mushrooms.",
        price: 14.99,
        allergens: ["Gluten", "Milk"],
        tags: ["Vegetarian"],
      },
    ],
  },
}

export const DOUGH_OPTIONS = [
  { id: "regular", label: "Regular Dough", priceAdd: 0 },
  { id: "gluten-free", label: "Gluten-Free Dough", priceAdd: 0 },
]

export const CHEESE_OPTIONS = [
  { id: "mozzarella", label: "Mozzarella" },
  { id: "vegan", label: "Vegan Cheese" },
]

export const EXTRAS = [
  { id: 'poppers', label: 'Jalapeño Poppers', price: 3.99, allergens: ['Gluten', 'Milk', 'Egg'] },
  { id: 'extra-mozzarella', label: 'Extra Mozzarella', price: 1.99, allergens: ['Milk'] },
  { id: 'pesto-drizzle', label: 'Pesto Drizzle', price: 1.49, allergens: ['Nuts', 'Milk'] },
  { id: 'garlic-sauce', label: 'Garlic Sauce', price: 0.99, allergens: ['Egg'] },
  { id: 'bbq-sauce', label: 'BBQ Sauce', price: 0.99, allergens: ['Sulphites'] },
]
