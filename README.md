# Mystery Creations

A static, mobile-friendly storefront for themed mystery gift boxes. Plain HTML, CSS, and JavaScript — no build step. Ready to deploy for free on GitHub Pages or Cloudflare Pages.

The public brand name lives in **one place**: `js/config.js`, as `STORE_CONFIG.name`. Change that value and the title, header, footer, contact copy, and legal pages follow it (the HTML also includes the current name as a no-JS fallback).

## What’s on the site

- Home page (`index.html`): hero, how it works, dropdown order form (box, theme, optional gift note), compact box and theme overviews, checkout summary, FAQ, and contact
- Placeholder **Terms** (`terms.html`) and **Privacy** (`privacy.html`)
- A **thank-you** page (`success.html`) you can use as the Stripe success URL
- Original CSS/SVG visuals only — no official logos, trademarked artwork, or copyrighted characters
- A footer disclaimer that the store is not affiliated with any brand and that boxes contain officially licensed or generic themed products

## Box tiers

| ID | Name | Size | Price |
| --- | --- | --- | --- |
| `glimpse` | The Glimpse | Mini | $20 |
| `whisper` | The Whisper | Pocket | $30 |
| `spark` | The Spark | Small | $50 |
| `curiosity` | The Curiosity | Compact | $75 |
| `secret` | The Secret | Medium | $100 |
| `keepsake` | The Keepsake | Medium-plus | $150 |
| `trove` | The Trove | Generous | $200 |
| `chamber` | The Chamber | Large | $250 |
| `relic` | The Relic | Extra large | $300 |
| `heist` | The Heist | Huge | $400 |
| `grand-vault` | The Grand Vault | Legendary | $500 |

Customers pick a **tier and a theme** from dropdowns, and may add a gift note (up to 200 characters). Checkout passes the tier, theme, note, and price.

## Themes

Configured in the `themes` array in `js/config.js`. Starting themes:

- Anime
- Pokémon Fans
- Football
- Musician
- Mechanic
- Batman Fans (Gotham-style naming and artwork — no official marks)
- SpaceX / Space Fans (generic space motifs — no company branding)
- Gaming
- Marvel Fans
- Star Wars Fans
- Harry Potter Fans
- Disney Fans
- Basketball
- Baseball
- Fishing & Outdoors
- Cars & Racing
- Cozy Self-Care

### Adding a theme later

1. Open `js/config.js`.
2. Append an object to `STORE_CONFIG.themes`:

```js
{
  id: "gardening",          // url-safe slug, unique
  name: "Gardening",        // customer-facing label
  blurb: "For people who talk to their plants.",
  accent: "#7aa86d",        // plaque highlight color
  icon: "anime"             // key in the ICONS set in app.js (or add a new original SVG there)
}
```

3. Save and refresh. The theme dropdown and overview are built from this array, so no HTML edit is required.

To give the new theme its own icon, add an SVG string under the matching key in the `ICONS` object in `js/app.js`. Keep icons original — no official logos or characters.

## Payments (Stripe is a placeholder until you connect it)

Test-mode Stripe Payment Links are filled in `STORE_CONFIG.stripe.paymentLinks`. Each link collects shipping (US), phone, a required Theme dropdown, and an optional Gift note. Stripe Checkout collects the customer’s name, email, and address.

The site passes this order payload:

```js
{
  tierId, themeId, tierName, themeName, giftNote,
  price, priceCents, currency, storeName,
  clientReferenceId  // "<tierId>--<themeId>", e.g. "secret--musician"
}
```

### Option A — Stripe Payment Links (no backend)

1. Create a Stripe account and add your bank details in the Stripe Dashboard.
2. Create **one Payment Link per box tier** (one for $20, one for $30, and so on). Enable shipping address collection and any tax settings you need.
3. Optional but useful: add a custom field in the Payment Link for “Theme”, or rely on `client_reference_id` (the site always appends it).
4. Paste each Payment Link URL into `STORE_CONFIG.stripe.paymentLinks` in `js/config.js`, keyed by tier id:

```js
paymentLinks: {
  glimpse: "https://buy.stripe.com/example_glimpse",
  whisper: "https://buy.stripe.com/example_whisper",
  spark: "https://buy.stripe.com/example_spark",
  curiosity: "",
  secret: "",
  keepsake: "",
  trove: "",
  chamber: "",
  relic: "",
  heist: "",
  "grand-vault": ""
}
```

5. Set each Payment Link’s success URL to your deployed `success.html`, and the cancel URL to `index.html#checkout`.
6. When a customer checks out, the site redirects to the link for that tier and appends  
   `?client_reference_id=<tierId>--<themeId>`  
   so the paid order carries both the box size and the theme.

### Option B — Stripe Checkout Sessions (small backend)

When you have a Cloudflare Worker, Netlify Function, or similar:

1. Set `STORE_CONFIG.stripe.checkoutEndpoint` to that function’s URL.
2. Leave Payment Links blank (or fill them as a fallback).
3. The site will `POST` the JSON payload above and expects `{ "url": "https://checkout.stripe.com/..." }` back.
4. In your function, create a Checkout Session with `client_reference_id`, line-item amount/name, and metadata for `tierId` and `themeId`. Turn on shipping address collection there.

Until either option is configured, the checkout panel shows a clear **“Stripe not connected”** state and the customer’s selection is saved in the browser.

## Deploy for free

### GitHub Pages

1. Create a GitHub repository and upload this folder (the files can live at the repo root).
2. In the repo: **Settings → Pages → Deploy from a branch** (usually `main` / root).
3. Your site will be at `https://<user>.github.io/<repo>/`.

A `.nojekyll` file is included so GitHub Pages won’t run Jekyll on the files.

### Cloudflare Pages

1. In the Cloudflare dashboard, create a Pages project from this repository (or upload the folder).
2. Build command: leave empty. Output directory: `/` (or the folder root).
3. Deploy.

### Local preview

```bash
cd mystery-creations
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Changing the store name

Edit only this line in `js/config.js`:

```js
name: "Mystery Creations",
```

Also update `contactEmail` when you have a real inbox. Instagram can be added later as `instagram`.

## Project layout

```
mystery-creations/
  index.html
  terms.html
  privacy.html
  success.html
  css/styles.css
  js/config.js      ← name, tiers, themes, Stripe placeholders
  js/app.js
  img/              ← original SVG mark and hero art
  screenshots/      ← desktop and mobile captures
  README.md
```

## What is still a placeholder

- Stripe Payment Links / Checkout endpoint (not connected; no charges can be taken yet)
- Contact email (`hello@mysterycreations.example`)
- Shipping rates and timing in the FAQ
- Return policy language (clearly marked as a placeholder)
- Terms and Privacy (reasonable draft language, not formal legal advice)
- Fulfillment-bot handoff (not part of this static site)
