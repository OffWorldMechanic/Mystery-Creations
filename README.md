# Mystery Creations

A static, mobile-friendly storefront for themed mystery gift boxes. Plain HTML, CSS, and JavaScript — no build step. Ready to deploy for free on GitHub Pages or Cloudflare Pages.

The public brand name lives in **one place**: `js/config.js`, as `STORE_CONFIG.name`. Change that value and the title, header, footer, contact copy, and legal pages follow it (the HTML also includes the current name as a no-JS fallback).

## What’s on the site

- Home page (`index.html`): hero, email list (new themes and deals), how it works, dropdown order form (box and theme), compact box and theme overviews, checkout summary, reviews (from `js/reviews.js`), FAQ, and contact
- **Terms** (`terms.html`) and **Privacy** (`privacy.html`)
- A **thank-you** page (`success.html`) used as the Stripe success URL: `https://mymysterycreations.com/success.html` (this page is marked `noindex` and is not in the sitemap)
- `robots.txt`, `sitemap.xml`, and a 1200×630 share image at `img/og-image.png`
- Open Graph / Twitter card tags and JSON-LD (store, FAQ, and box products) on the public pages
- Original CSS/SVG visuals only — no official logos, trademarked artwork, or copyrighted characters
- A footer disclaimer that items are genuine, new products from authorized retailers and that the store is not affiliated with or endorsed by any brand

## Box tiers

| ID | Name | Size | Price |
| --- | --- | --- | --- |
| `glimpse` | The Glimpse | Mini | $25 |
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

Customers pick a **tier and a theme** from dropdowns and continue to a Stripe Payment Link for that exact combination. Optional notes about who the box is for and a gift message are entered once, at checkout. The recipient note is a non-binding guide for personalization — it does not guarantee specific items.

## Themes

Configured in the `themes` array in `js/config.js`. Starting themes:

- Anime
- Pocket Monster Fans
- Football
- Musician
- Mechanic
- Dark Knight Fans
- Space Explorer
- Gaming
- Superhero Fans
- Galaxy Saga Fans
- Wizarding School Fans
- Fairytale & Animation Fans
- Basketball
- Baseball
- Fishing & Outdoors
- Cars & Racing
- Cozy Self-Care
- Squishy
- Halloween
- Christmas
- St. Patrick's Day Party

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

## Email list, social links, and analytics

The home page has a email-list form at `#waitlist` (`https://mymysterycreations.com/#waitlist`). By default it opens a `mailto:` to `contactEmail` with the subject `Email list signup`. To send signups to a form endpoint later, set `STORE_CONFIG.waitlistEndpoint`; the form will POST `{ email, theme }`.

Partnership and promotion inquiries go to `STORE_CONFIG.marketingEmail` (`marketing@mymysterycreations.com`). The footer on every page links that address with the subject `Partnership inquiry`.

Fill in `instagram`, `tiktok`, `x`, `facebook`, or `youtube` in `js/config.js` when those accounts exist. The footer only renders the ones that have a value.

`STORE_CONFIG.analytics.goatcounter` is set to `https://mymysterycreations.goatcounter.com/count` (dashboard: https://mymysterycreations.goatcounter.com/). `js/app.js` loads `//gc.zgo.at/count.js` once per page with that endpoint, adds any stored utm_* values to the counted page, and strips the Stripe session id on success.html. Set it to "" to turn analytics off, and update privacy.html if you change providers.

## Payments

Per-combination Stripe Payment Links are filled in `js/links.js` as `window.STORE_PAYMENT_LINKS` (keyed by tier id, then theme id). Each link is for one box size and one theme, and collects a U.S. shipping address, phone, an optional “who this box is for” note, and an optional gift note. Shipping is included in the box price. Stripe Checkout also collects the customer’s name, email, and address.

The site passes this order payload:

```js
{
  tierId, themeId, tierName, themeName,
  price, priceCents, currency, storeName,
  clientReferenceId  // "<tierId>--<themeId>", e.g. "secret--musician"
}
```

### Option A — Stripe Payment Links (no backend)

1. Create a Stripe account and add your bank details in the Stripe Dashboard.
2. Create **one Payment Link per box size and theme** (one for each combination). Reuse the existing price for that tier. Bake the theme into the link’s metadata (`tierId`, `themeId`, `themeLabel`, `boxPrice`) and checkout copy. Collect a U.S. shipping address, phone, and two optional text fields only: who the box is for, and a gift note. There is no theme dropdown at checkout.
3. Put each Payment Link URL in `js/links.js` as `window.STORE_PAYMENT_LINKS[tierId][themeId]`.
4. Set each Payment Link’s success URL to `https://mymysterycreations.com/success.html?session_id={CHECKOUT_SESSION_ID}`.
5. When a customer checks out, the site redirects to the link for that exact size and theme and appends  
   `?client_reference_id=<tierId>--<themeId>`  
   so the paid order carries both the box size and the theme. Optional notes are entered once, at Stripe Checkout.

### Option B — Stripe Checkout Sessions (small backend)

When you have a Cloudflare Worker, Netlify Function, or similar:

1. Set `STORE_CONFIG.stripe.checkoutEndpoint` to that function’s URL.
2. Leave `STORE_PAYMENT_LINKS` blank if the endpoint should be used instead.
3. The site will `POST` the JSON payload above and expects `{ "url": "https://checkout.stripe.com/..." }` back.
4. In your function, create a Checkout Session with `client_reference_id`, line-item amount/name, and metadata for `tierId` and `themeId`. Turn on shipping address collection there.

The customer’s selection is also saved in the browser if they leave and come back.

## Deploy for free

### GitHub Pages

1. Create a GitHub repository and upload this folder (the files can live at the repo root).
2. In the repo: **Settings → Pages → Deploy from a branch** (usually `main` / root).
3. The published site is [https://mymysterycreations.com/](https://mymysterycreations.com/). A `CNAME` file at the repo root sets that custom domain. Asset paths stay relative, so they resolve from the domain root.

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

The store contact address lives in `STORE_CONFIG.contactEmail` in `js/config.js` (currently `help@mymysterycreations.com`). Instagram is set as `instagram` (https://www.instagram.com/beckywiththebox/).

## Project layout

```
mystery-creations/
  index.html
  terms.html
  privacy.html
  success.html
  css/styles.css
  js/config.js      ← name, contact email, tiers, themes
  js/links.js       ← Stripe Payment Link for each tier × theme
  js/reviews.js     ← approved customer reviews (leave empty until real ones arrive)
  CNAME             ← custom domain (mymysterycreations.com)
  js/app.js
  img/              ← original SVG mark and hero art
  screenshots/      ← desktop and mobile captures
  README.md
```


## Customer reviews

Published reviews live in `js/reviews.js` as `window.STORE_REVIEWS`. Keep this array empty until a review has been matched to a real paid order. Do not add invented, sample, or placeholder reviews.

The “Leave a review” form on the site opens a mail draft to `STORE_CONFIG.contactEmail` (`help@mymysterycreations.com`). The subject is `Review – <First LastInitial>`, and the body includes the first name, last initial, order email (for verification only — not published), theme, star rating, and review text.

To post an approved review:

1. Confirm the order email matches a real paid order, and that the theme (and box, if you include it) is accurate.
2. Open `js/reviews.js` and append an object to the array:

```js
{
  name: "Jane D.",
  theme: "Squishy",
  tier: "The Secret",
  rating: 5,
  text: "The approved review text.",
  date: "2026-11-13"
}
```

3. Save and deploy. The reviews section renders from this array only, and the average rating is computed only when there is at least one real entry.

## Shipping and returns (summary)

Shipping is included in the box price. Orders are processed and packed in 3–5 business days and ship via UPS within the United States, with tracking emailed to the customer. Typical transit is 1–5 business days after shipping.

Change-of-mind returns are not accepted. A box that arrives damaged, is missing items, or is not as described (wrong tier or theme), reported within 14 days of delivery with a photo, receives a replacement or a full refund (customer’s choice). Refunds go to the original payment method within 5–10 business days. Lost packages are handled through a UPS claim, then a replacement or refund. Orders may be cancelled for a full refund before they ship.

These terms are also published on the store FAQ and in `terms.html`.
