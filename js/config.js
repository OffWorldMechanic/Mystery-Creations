/**
 * Mystery Creations — store configuration
 * Change the brand name, tiers, themes, or Stripe links here.
 * Adding a theme later: append an object to `themes` (id, name, blurb, accent, icon).
 */
window.STORE_CONFIG = {
  name: "Mystery Creations",
  tagline: "Mystery gifts from $10, shipped free.",
  description:
    "A Single-item Mystery Gift is one single surprise item, not a box. Pick a theme and a price, and we send one surprise item matched to it, shipped directly from a retailer to the recipient as a gift, with no price inside. Free shipping on every order.",
  // CONTACT EMAIL — single source of truth (HTML pages use the same address as a no-JS fallback).
  contactEmail: "help@mymysterycreations.com",
  // Business location shown on the site: city and state only (no street address or ZIP).
  location: "Laguna Vista, Texas",
  marketingEmail: "marketing@mymysterycreations.com",
  instagram: "https://www.instagram.com/beckywiththebox/",
  tiktok: "",
  x: "https://x.com/BeckyWithTheBox",
  facebook: "",
  youtube: "",
  pinterest: "https://www.pinterest.com/mymysterycreations/",
  // Email list: the #waitlist section embeds a beehiiv subscribe form (publication "Mystery Creations").
  // Form id fd0375d0-bceb-43df-ba1f-9305e86fa76a; edit its design in beehiiv > Subscribers > Subscribe forms.
  // GoatCounter (cookie-free page-view counts). Dashboard: https://mymysterycreations.goatcounter.com/
  // Set to "" to load no analytics script.
  analytics: { goatcounter: "https://mymysterycreations.goatcounter.com/count" },
  // Fulfillment and business details are not shown on the storefront.
  // Stripe Checkout will collect the customer's name, email, and shipping address.

  /**
   * Payments
   * --------
   * Live Payment Links (one per tier and theme) are in js/links.js.
   *
   * Option A — Stripe Payment Links (one link per tier and theme):
   *   The map lives in js/links.js as window.STORE_PAYMENT_LINKS[tierId][themeId].
   *   Checkout appends ?client_reference_id=<tierId>--<themeId>. Optional notes
   *   about who the box is for and a gift message are entered at Stripe Checkout.
   *
   * Option B — Stripe Checkout Sessions (recommended once you have a small backend):
   *   Set stripe.checkoutEndpoint to your function URL (e.g. a Cloudflare Worker
   *   or Netlify/Stripe function). The site POSTs JSON:
   *   { tierId, themeId, tierName, themeName, recipient, giftNote, priceCents, currency, storeName }
   *   and expects { url } pointing at the Stripe Checkout Session.
   *   Stripe Checkout itself collects name, email, and shipping address.
   */
  stripe: {
    currency: "usd",
    checkoutEndpoint: "",
    successUrl: "./success.html",
    cancelUrl: "./index.html#checkout"
  },

  // Shipping: every Mystery Gift and every Mystery Box ships free (U.S. only).

  /**
   * Mystery Gifts — ONE single surprise item per order (never a box), matched to a theme, shipped directly
   * from a retailer to the recipient as a gift (no price inside). Always free shipping.
   * Links live in js/links.js as window.STORE_GIFT_LINKS[giftTierId][themeId].
   */
  gifts: {
    tiers: [
      { id: "gift-10", price: 10 },
      { id: "gift-15", price: 15 },
      { id: "gift-20", price: 20 },
      { id: "gift-25", price: 25 }
    ]
  },

  // Mystery Boxes: every box contains multiple themed gifts, hand-packed in one box.
  // `contents` is a relative sense of quantity only, never an item count.
  tiers: [
    {
      id: "spark",
      contents: "A handful of gifts",
      name: "The Spark",
      price: 50,
      size: "Small",
      blurb: "A tight little bundle of themed finds, ready to brighten an ordinary day."
    },
    {
      id: "curiosity",
      contents: "A handful of gifts",
      name: "The Curiosity",
      price: 75,
      size: "Compact",
      blurb: "A compact crate with enough room for a few standout pieces."
    },
    {
      id: "secret",
      contents: "A generous mix of gifts",
      name: "The Secret",
      price: 100,
      size: "Medium",
      blurb: "Our classic medium box — a well-paced mix of useful, fun, and unexpected."
    },
    {
      id: "keepsake",
      contents: "A generous mix of gifts",
      name: "The Keepsake",
      price: 150,
      size: "Medium-plus",
      blurb: "A generous medium box with room for a keepsake-worthy centerpiece."
    },
    {
      id: "trove",
      contents: "A generous mix of gifts",
      name: "The Trove",
      price: 200,
      size: "Generous",
      blurb: "A rich haul of themed goods — the kind of box people talk about."
    },
    {
      id: "chamber",
      contents: "A big haul of gifts",
      name: "The Chamber",
      price: 250,
      size: "Large",
      blurb: "A large chamber of curated finds, built to feel like an event."
    },
    {
      id: "relic",
      contents: "A big haul of gifts",
      name: "The Relic",
      price: 300,
      size: "Extra large",
      blurb: "An extra-large trunk with statement pieces and plenty of texture."
    },
    {
      id: "heist",
      contents: "A big haul of gifts",
      name: "The Heist",
      price: 400,
      size: "Huge",
      blurb: "A huge, cinematic unboxing — this is a gift that takes over the table."
    },
    {
      id: "grand-vault",
      contents: "A big haul of gifts",
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
    },
    {
      id: "halloween",
      name: "Halloween",
      blurb: "Autumn nights, carved pumpkins, and a little friendly fright — treats and trinkets for spooky-season fans.",
      accent: "#e08a3a",
      icon: "halloween"
    },
    {
      id: "christmas",
      name: "Christmas",
      blurb: "Cozy winter light, wrapping-paper rustle, and small comforts for the holiday table.",
      accent: "#c45c4a",
      icon: "christmas"
    },
    {
      id: "stpatricksday",
      name: "St. Patrick's Day Party",
      blurb: "Green-and-gold festivities, gathering energy, and luck-of-the-season party favors.",
      accent: "#3d8c5a",
      icon: "stpatricksday"
    },
    {
      id: "watches",
      name: "Watches",
      blurb: "Timepieces, watch straps, and clock-face finds for people who love a good watch. Theme name only — not an official brand shop.",
      accent: "#c4b07a",
      icon: "watches"
    }
  ],

  disclaimer:
    "Items are genuine, new products purchased from authorized retailers; Mystery Creations is not affiliated with or endorsed by any brand. Theme names describe interests only."
};
