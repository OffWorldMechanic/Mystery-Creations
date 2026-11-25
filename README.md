# Mystery Creations

A static, mobile-friendly storefront for **Mystery Gifts** (one single surprise item, not a box; $10–$25, the lead offer) and **Mystery Boxes** (multiple themed gifts hand-packed in one box; $50–$500). Plain HTML, CSS, and JavaScript — no build step. Ready to deploy for free on GitHub Pages or Cloudflare Pages.

The public brand name lives in **one place**: `js/config.js`, as `STORE_CONFIG.name`. Change that value and the title, header, footer, contact copy, and legal pages follow it (the HTML also includes the current name as a no-JS fallback).

## What’s on the site

- Home page (`index.html`): one phone-first order flow. Above the fold: branding, the slogan, the theme menu, then “tell us about the special person.” Scrolling continues with the gift note, Mystery Gift prices ($10–$25), Mystery Box sizes ($50–$500), and a large checkout section. Comparison, email list, how it works, overviews, reviews, FAQ, and contact follow that.
- **Terms** (`terms.html`) and **Privacy** (`privacy.html`)
- A **thank-you** page (`success.html`) used as the Stripe success URL: `https://mymysterycreations.com/success.html` (this page is marked `noindex` and is not in the sitemap)
- `robots.txt`, `sitemap.xml`, and a 1200×630 share image at `img/og-image.png`
- Open Graph / Twitter card tags and JSON-LD (store, FAQ, and box products) on the public pages
- Original CSS/SVG visuals only — no official logos, trademarked artwork, or copyrighted characters
- A footer disclaimer that items are genuine, new products from authorized retailers and that the store is not affiliated with or endorsed by any brand

## Naming: Mystery Gift vs. Mystery Box

Always use the two product names with "Mystery" in them; never drop the word "Mystery" from a product name (it is always "Mystery Gift" or "Mystery Box").

- **Mystery Gift**: one single surprise item (not a box), $10–$25, shipped free and directly from a retailer to the recipient, no price inside, usually 2–7 business days. Never call a Mystery Gift a box.
- **Mystery Box**: multiple themed gifts hand-packed in one box at our shop with a hand-tied ribbon, $50–$500, free USPS Ground Advantage, ships within 5 business days, arrives in 7–12. Every box contains multiple gifts. Tier cards show a relative sense of quantity (`contents` in `js/config.js`: "A handful of gifts", "A generous mix of gifts", and a distinct phrase for each box at $250 and up, such as "A large chamber of gifts"); never publish exact item counts or values.
- The home page has a "Mystery Gift vs. Mystery Box" comparison block (`#compare`) right after the combined order section, and the FAQ has "What’s the difference between a Mystery Gift and a Mystery Box?" (HTML and JSON-LD).
- The description of the special person and the gift note are optional fields on the home page (100 characters each). The description affects which mystery gift is picked. The gift note does not. If a customer skips one, it stays blank.
- Stripe Payment Links still collect the same two custom fields, keys `recipient` and `giftnote`. Checkout appends only `client_reference_id=<tierId>--<themeId>` (alphanumeric and dashes, for example `gift-15--anime`). Payment Link URLs cannot prefill custom fields, so do not put the description or the gift note in the URL or in `client_reference_id`. When `stripe.checkoutEndpoint` is set, the site POSTs `recipient` and `giftNote` (empty string if skipped) for a Checkout Session that can set those fields’ `default_value`.

## Box tiers

| ID | Name | Size | Price |
| --- | --- | --- | --- |
| `spark` | The Spark | Small | $50 |
| `curiosity` | The Curiosity | Compact | $75 |
| `secret` | The Secret | Medium | $100 |
| `keepsake` | The Keepsake | Medium-plus | $150 |
| `trove` | The Trove | Generous | $200 |
| `chamber` | The Chamber | Large | $250 |
| `relic` | The Relic | Extra large | $300 |
| `heist` | The Heist | Huge | $400 |
| `grand-vault` | The Grand Vault | Legendary | $500 |

Customers pick one theme, optionally describe the special person, optionally add a gift note, then choose either a Mystery Gift price or a Mystery Box size. Checkout continues to the Stripe Payment Link for that exact combination and appends `client_reference_id=<tierId>--<themeId>`. The description affects which mystery gift is picked. The gift note does not, and it does not guarantee a specific item. A skipped description or note stays blank.

## Themes

Configured in the `themes` array in `js/config.js`. Starting themes:

- Anime
- Poke Mon
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
- Watches
- Pets (when this theme is chosen, a required short text field asks what the pet is; see `petType` in the Worker)

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

3. Save and refresh. The theme dropdown and overview are built from this array, so no HTML edit is required. Choosing a theme swaps the full-page background to `image` (a collage in `img/themes/`). With no theme selected, the page stays the default cream look. A theme without an image falls back to its `accent` color.

4. Add the collage as `img/themes/<id>.jpg` and set `image` to that path. The photo should fill the frame, with the important objects near the center so a phone crop still reads as that theme.

To give the new theme its own icon, add an SVG string under the matching key in the `ICONS` object in `js/app.js`. Keep icons original — no official logos or characters.

## Email list, social links, and analytics

The home page has an email-list form at `#waitlist` (`https://mymysterycreations.com/#waitlist`). It is a beehiiv embedded subscribe form (v3 loader at `https://subscribe-forms.beehiiv.com/v3/loader.js` with form id `fd0375d0-bceb-43df-ba1f-9305e86fa76a`), so sign-ups land in the beehiiv publication "Mystery Creations". The optional theme dropdown is the beehiiv custom field `Theme interest`. Change the form's look, fields, or success message in beehiiv (Subscribers > Subscribe forms), then save it there; the embed code does not change. No beehiiv API key is used on the site.

Partnership and promotion inquiries go to `STORE_CONFIG.marketingEmail` (`marketing@mymysterycreations.com`). The footer on every page links that address with the subject `Partnership inquiry`.

Fill in `tiktok`, `facebook`, or `youtube` in `js/config.js` when those accounts exist. The footer only renders the ones that have a value.

`STORE_CONFIG.analytics.goatcounter` is set to `https://mymysterycreations.goatcounter.com/count` (dashboard: https://mymysterycreations.goatcounter.com/). `js/app.js` loads `//gc.zgo.at/count.js` once per page with that endpoint, adds any stored utm_* values to the counted page, and strips the Stripe session id on success.html. Set it to "" to turn analytics off, and update privacy.html if you change providers.

## Payments

Per-combination Stripe Payment Links are filled in `js/links.js` as `window.STORE_PAYMENT_LINKS` (keyed by tier id, then theme id). Each link is for one box size and one theme, and collects a U.S. shipping address, phone, an optional “who this box is for” note, and an optional gift note. Shipping is free on every gift and box; no link uses `shipping_options`. Mystery Gift links are in `window.STORE_GIFT_LINKS[giftTierId][themeId]` (gift-10 … gift-25), checkout appends `?client_reference_id=gift-N--themeId`, and their metadata has productType "gift", giftPrice, shipDirect "true", shippingCharged "0". Box links carry productType "box". Stripe Checkout also collects the customer’s name, email, and address.

The site passes this order payload:

```js
{
  tierId, themeId, tierName, themeName,
  productType,            // "gift" or "box"
  recipient, giftNote,    // "" when the customer skipped that field
  price, priceCents, currency, storeName,
  clientReferenceId       // "<tierId>--<themeId>" only, e.g. "secret--musician"
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

The store contact address lives in `STORE_CONFIG.contactEmail` in `js/config.js` (currently `help@mymysterycreations.com`). X is set as `x` (https://x.com/BeckyWithTheBox) and Pinterest as `pinterest`. Instagram is left blank so the footer does not link it.

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

Shipping is free on every order (U.S. only). Mystery Gifts ($10–$25, one single item) ship directly from a retailer to the recipient, gift-wrapped when available, with no price inside, and usually arrive within 2–7 business days. Mystery Boxes ($50–$500) are hand-packed at our shop in a quality gift box with a hand-tied ribbon and shipped via USPS Ground Advantage. Ships within 5 business days, arrives in 7–12 business days, with tracking emailed to the customer.

Because every Mystery Gift and Mystery Box is a surprise, there are no returns or exchanges. You may cancel for a full refund any time before your order ships. To cancel, email help@mymysterycreations.com from the address you ordered with and say cancel. Once an order has shipped, it can no longer be cancelled, and all sales are final. We'll email tracking as soon as it ships. Refunds for cancelled orders go back to the original payment method. Footer links "Shipping" and "Refunds" point to `terms.html#shipping` and `terms.html#refunds`.

These terms are also published on the store FAQ and in `terms.html`.
