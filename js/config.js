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
  contactEmail: "hello@mysterycreations.example",
  instagram: "",
  // Fulfillment and business details are not shown on the storefront.
  // Stripe Checkout will collect the customer's name, email, and shipping address.

  /**
   * Payments
   * --------
   * Stripe is not connected yet. When you are ready:
   *
   * Option A — Stripe Payment Links (simplest, no backend):
   *   Create one Payment Link per box tier in the Stripe Dashboard, then paste
   *   each URL into stripe.paymentLinks keyed by the tier id below.
   *   Checkout appends ?client_reference_id=<tierId>--<themeId> so the paid
   *   order carries both the box size and the selected theme.
   *
   * Option B — Stripe Checkout Sessions (recommended once you have a small backend):
   *   Set stripe.checkoutEndpoint to your function URL (e.g. a Cloudflare Worker
   *   or Netlify/Stripe function). The site POSTs JSON:
   *   { tierId, themeId, tierName, themeName, priceCents, currency, storeName }
   *   and expects { url } pointing at the Stripe Checkout Session.
   *   Stripe Checkout itself collects name, email, and shipping address.
   */
  stripe: {
    currency: "usd",
    paymentLinks: {
      whisper: "",
      spark: "",
      curiosity: "",
      secret: "",
      keepsake: "",
      trove: "",
      chamber: "",
      relic: "",
      heist: "",
      "grand-vault": ""
    },
    checkoutEndpoint: "",
    successUrl: "./success.html",
    cancelUrl: "./index.html#checkout"
  },

  tiers: [
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
      name: "Pokémon Fans",
      blurb: "Adventure-ready finds for trainers at heart. Officially licensed or generic items only — no knockoff characters.",
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
      name: "Batman Fans",
      blurb: "Gotham nights, art-deco shadows, and moody city atmosphere. Fan-style only — no official marks.",
      accent: "#6b7c9c",
      icon: "gotham"
    },
    {
      id: "space-fans",
      name: "SpaceX / Space Fans",
      blurb: "Orbit-minded gifts for launch watchers and stargazers. Original space motifs, not company branding.",
      accent: "#6ec4d8",
      icon: "space"
    }
  ],

  disclaimer:
    "This store is not affiliated with, endorsed by, or sponsored by any film studio, game publisher, sports league, musician, or company named in our theme labels. Theme names describe fandoms and interests only. Boxes contain officially licensed products and/or generic themed goods — never counterfeit or unofficial character merchandise."
};
