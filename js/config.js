/**
 * Mystery Creations — store configuration
 * Change the brand name, tiers, themes, or Stripe links here.
 * Adding a theme later: append an object to `themes` (id, name, blurb, accent, icon).
 */
window.STORE_CONFIG = {
  name: "Mystery Creations",
  tagline: "Themed mystery boxes, packed with care.",
  description:
    "Pick a size, pick a theme, and we curate a one-of-a-kind gift box. Every order is a surprise — never the same twice.",
  // CONTACT EMAIL — single source of truth (HTML pages use the same address as a no-JS fallback).
  contactEmail: "help@mymysterycreations.com",
  instagram: "",
  // Fulfillment and business details are not shown on the storefront.
  // Stripe Checkout will collect the customer's name, email, and shipping address.

  /**
   * Payments
   * --------
   * Payment Links for each tier are filled in below.
   *
   * Option A — Stripe Payment Links (simplest, no backend):
   *   Checkout appends ?client_reference_id=<tierId>--<themeId> so the paid
   *   order carries both the box size and the selected theme. Payment Links
   *   cannot prefill custom fields via URL; the customer also confirms
   *   the theme and may paste a gift note on Stripe Checkout. Dropdown values
   *   are alphanumeric (hyphens stripped from theme ids, e.g. pokemon-fans
   *   → pokemonfans) because Stripe rejects hyphens in option values.
   *
   * Option B — Stripe Checkout Sessions (recommended once you have a small backend):
   *   Set stripe.checkoutEndpoint to your function URL (e.g. a Cloudflare Worker
   *   or Netlify/Stripe function). The site POSTs JSON:
   *   { tierId, themeId, tierName, themeName, giftNote, priceCents, currency, storeName }
   *   and expects { url } pointing at the Stripe Checkout Session.
   *   Stripe Checkout itself collects name, email, and shipping address.
   */
  stripe: {
    currency: "usd",
    paymentLinks: {
      glimpse: "https://buy.stripe.com/test_00w5kE99qa0JfEN8oBcjS0a",
      whisper: "https://buy.stripe.com/test_cNi4gA4Ta0q9fEN9sFcjS00",
      spark: "https://buy.stripe.com/test_00w9AUclC7SBdwF0W9cjS01",
      curiosity: "https://buy.stripe.com/test_fZu5kE1GYb4NeAJ9sFcjS02",
      secret: "https://buy.stripe.com/test_aFa6oIadufl364d8oBcjS03",
      keepsake: "https://buy.stripe.com/test_5kQ7sM0CU7SB9gpgV7cjS04",
      trove: "https://buy.stripe.com/test_7sY5kE85m0q978hfR3cjS05",
      chamber: "https://buy.stripe.com/test_5kQ14oadufl3dwFcERcjS06",
      relic: "https://buy.stripe.com/test_bJe9AU1GY0q9gIR5cpcjS07",
      heist: "https://buy.stripe.com/test_4gM4gA1GYdcVaktgV7cjS08",
      "grand-vault": "https://buy.stripe.com/test_7sY14o71ic8RgIRdIVcjS09"
    },
    checkoutEndpoint: "",
    successUrl: "./success.html",
    cancelUrl: "./index.html#checkout"
  },

  tiers: [
    {
      id: "glimpse",
      name: "The Glimpse",
      price: 20,
      size: "Mini",
      blurb: "A tiny peek of themed joy — a sweet first look or a just-because treat."
    },
    {
      id: "whisper",
      name: "The Whisper",
      price: 30,
      size: "Pocket",
      blurb: "A small, delightful tease — perfect as a stocking stuffer or desk-side surprise."
    },
    {
      id: "spark",
      name: "The Spark",
      price: 50,
      size: "Small",
      blurb: "A tight little bundle of themed finds, ready to brighten an ordinary day."
    },
    {
      id: "curiosity",
      name: "The Curiosity",
      price: 75,
      size: "Compact",
      blurb: "A compact crate with enough room for a few standout pieces."
    },
    {
      id: "secret",
      name: "The Secret",
      price: 100,
      size: "Medium",
      blurb: "Our classic medium box — a well-paced mix of useful, fun, and unexpected."
    },
    {
      id: "keepsake",
      name: "The Keepsake",
      price: 150,
      size: "Medium-plus",
      blurb: "A generous medium box with room for a keepsake-worthy centerpiece."
    },
    {
      id: "trove",
      name: "The Trove",
      price: 200,
      size: "Generous",
      blurb: "A rich haul of themed goods — the kind of box people talk about."
    },
    {
      id: "chamber",
      name: "The Chamber",
      price: 250,
      size: "Large",
      blurb: "A large chamber of curated finds, built to feel like an event."
    },
    {
      id: "relic",
      name: "The Relic",
      price: 300,
      size: "Extra large",
      blurb: "An extra-large trunk with statement pieces and plenty of texture."
    },
    {
      id: "heist",
      name: "The Heist",
      price: 400,
      size: "Huge",
      blurb: "A huge, cinematic unboxing — this is a gift that takes over the table."
    },
    {
      id: "grand-vault",
      name: "The Grand Vault",
      price: 500,
      size: "Legendary",
      blurb: "The full vault experience. Our largest box, packed to impress."
    }
  ],

  /**
   * Themes — append a new object to add one later.
   * id: url-safe slug
   * name: customer-facing label (fan-style, not official brand names where risky)
   * blurb: short description
   * accent: hex used for the theme plaque
   * icon: key used by the original SVG set in app.js (or a new one you add there)
   */
  themes: [
    {
      id: "anime",
      name: "Anime",
      blurb: "Bold color, collectible energy, and a little sparkle — inspired by anime fandom, never official studio art.",
      accent: "#e07a6a",
      icon: "anime"
    },
    {
      id: "pokemon-fans",
      name: "Pocket Monster Fans",
      blurb: "Adventure-ready finds for fans of pocket-monster worlds. Genuine items only — no knockoffs.",
      accent: "#e6b84a",
      icon: "pokemon-fans"
    },
    {
      id: "football",
      name: "Football",
      blurb: "Game-day spirit, locker-room grit, and fan-cave staples. Not affiliated with any league or team.",
      accent: "#d07a3a",
      icon: "football"
    },
    {
      id: "musician",
      name: "Musician",
      blurb: "For the always-humming, vinyl-stacking, late-night-jam kind of person.",
      accent: "#7b8cff",
      icon: "musician"
    },
    {
      id: "mechanic",
      name: "Mechanic",
      blurb: "Gears, grit, and garage-ready goods for people who like to take things apart.",
      accent: "#c4a574",
      icon: "mechanic"
    },
    {
      id: "gotham-fans",
      name: "Dark Knight Fans",
      blurb: "Moody city nights, art-deco shadows, and a dark-knight atmosphere. Theme name only — no official marks.",
      accent: "#6b7c9c",
      icon: "gotham"
    },
    {
      id: "space-fans",
      name: "Space Explorer",
      blurb: "Orbit-minded gifts for launch watchers and stargazers.",
      accent: "#6ec4d8",
      icon: "space"
    },
    {
      id: "gaming",
      name: "Gaming",
      blurb: "Controller-side comforts and collectible energy for people who live in save files.",
      accent: "#6ea8ff",
      icon: "gaming"
    },
    {
      id: "marvel-fans",
      name: "Superhero Fans",
      blurb: "Heroic color, comic-shelf energy, and everyday finds for superhero fans.",
      accent: "#d45a5a",
      icon: "marvel-fans"
    },
    {
      id: "star-wars-fans",
      name: "Galaxy Saga Fans",
      blurb: "Far-galaxy atmosphere for saga lovers. Theme name only — no official marks.",
      accent: "#d4c07a",
      icon: "star-wars-fans"
    },
    {
      id: "potter-fans",
      name: "Wizarding School Fans",
      blurb: "Cozy, bookish magic for fans of a wizarding school. Theme name only — no official crests or logos.",
      accent: "#7a9a4a",
      icon: "potter-fans"
    },
    {
      id: "disney-fans",
      name: "Fairytale & Animation Fans",
      blurb: "Storybook warmth and classic animation energy.",
      accent: "#6a9ad8",
      icon: "disney-fans"
    },
    {
      id: "basketball",
      name: "Basketball",
      blurb: "Hardwood energy, gym-bag staples, and game-night spirit. Not affiliated with any league or team.",
      accent: "#e08a3a",
      icon: "basketball"
    },
    {
      id: "baseball",
      name: "Baseball",
      blurb: "Diamond days, ballpark snacks energy, and summer-night nostalgia. Not affiliated with any league or team.",
      accent: "#c45c4a",
      icon: "baseball"
    },
    {
      id: "fishing-outdoors",
      name: "Fishing & Outdoors",
      blurb: "Early mornings, quiet water, and trail-ready goods for people who pack a tackle box.",
      accent: "#5a9a7a",
      icon: "fishing-outdoors"
    },
    {
      id: "cars-racing",
      name: "Cars & Racing",
      blurb: "Garage weekends, pit-lane focus, and the smell of rubber on a warm day.",
      accent: "#d06050",
      icon: "cars-racing"
    },
    {
      id: "cozy-self-care",
      name: "Cozy Self-Care",
      blurb: "Soft evenings, warm light, and small comforts meant to slow the day down.",
      accent: "#d4a0b4",
      icon: "cozy-self-care"
    },
    {
      id: "squishy",
      name: "Squishy",
      blurb: "Slow-rise squishies, stress balls, mochi squish, and plush squishies — soft, silly, and very squeezeable.",
      accent: "#f0a8c0",
      icon: "squishy"
    }
  ],

  disclaimer:
    "Items are genuine, new products purchased from authorized retailers; Mystery Creations is not affiliated with or endorsed by any brand. Theme names describe interests only."
};
