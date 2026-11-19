/* Mystery Creations storefront */
(function () {
  "use strict";

  const config = window.STORE_CONFIG;
  if (!config) {
    console.error("STORE_CONFIG is missing. Load js/config.js first.");
    return;
  }

  const UTM_STORAGE_KEY = "mc-utm";

  function captureCampaignParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm = {};
      params.forEach((value, key) => {
        if (/^utm_/i.test(key) && String(value).trim()) {
          utm[key.toLowerCase()] = String(value).trim();
        }
      });
      if (Object.keys(utm).length) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
      }
    } catch (_) { /* ignore */ }
  }

  function getCampaignParams() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || "null");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) return saved;
    } catch (_) { /* ignore */ }
    return {};
  }

  function setupAnalytics() {
    const endpoint = config.analytics && typeof config.analytics.goatcounter === "string"
      ? config.analytics.goatcounter.trim()
      : "";
    if (!endpoint) return;

    const stored = getCampaignParams();
    const live = new URLSearchParams(window.location.search);
    const query = new URLSearchParams();
    Object.keys(stored).forEach((key) => {
      if (/^utm_/i.test(key) && stored[key]) query.set(key, stored[key]);
    });
    live.forEach((value, key) => {
      if (/^utm_/i.test(key) && value) query.set(key, value);
    });

    window.goatcounter = window.goatcounter || {};
    // Never send the Stripe checkout session id (success.html?session_id=...) to analytics.
    if (/success\.html$/i.test(window.location.pathname)) {
      window.goatcounter.path = function () { return window.location.pathname; };
    }
    if (query.toString()) {
      const previous = window.goatcounter.query;
      window.goatcounter.query = function () {
        const base = typeof previous === "function" ? previous() : (window.location.search || "");
        const merged = new URLSearchParams(String(base).replace(/^\?/, ""));
        query.forEach((value, key) => {
          if (!merged.has(key)) merged.set(key, value);
        });
        const result = merged.toString();
        return result ? "?" + result : "";
      };
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-goatcounter", endpoint);
    script.src = "//gc.zgo.at/count.js";
    document.head.appendChild(script);
  }

  captureCampaignParams();
  setupAnalytics();

  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: (config.stripe && config.stripe.currency) || "usd" }).format(n);

  const state = {
    tierId: null,
    themeId: null
  };

  try {
    const saved = JSON.parse(localStorage.getItem("mc-selection") || "null");
    if (saved) {
      if (saved.tierId) state.tierId = saved.tierId;
      if (saved.themeId) state.themeId = saved.themeId;
    }
  } catch (_) { /* ignore */ }

  function persist() {
    try {
      localStorage.setItem("mc-selection", JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function getTheme() {
    return (config.themes || []).find((t) => t.id === state.themeId) || null;
  }

  /* Original, non-branded icons — no official logos or characters */
  const ICONS = {
    anime: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4l1.6 5.2L22.6 11 17.6 13.6 16 19l-1.6-5.4L9.4 11l5-1.8L16 4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M24 15l.9 2.6 2.7.1-2.1 1.7.7 2.6L24 20.6l-2.2 1.4.7-2.6-2.1-1.7 2.7-.1L24 15z" fill="currentColor"/>
      <path d="M8 18l.8 2.2 2.3.1-1.8 1.4.6 2.2-1.9-1.2-1.9 1.2.6-2.2-1.8-1.4 2.3-.1L8 18z" fill="currentColor"/>
      <path d="M6 10h4M26 24h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    "pokemon-fans": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5l2.2 6.4H25l-5.4 3.9 2.1 6.5L16 18.8l-5.7 4 2.1-6.5L7 11.4h6.8L16 5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="2" fill="currentColor"/>
    </svg>`,
    football: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <ellipse cx="16" cy="16" rx="12" ry="7.5" transform="rotate(-28 16 16)" stroke="currentColor" stroke-width="1.6"/>
      <path d="M11 13.5l10 5.4M13 17.2l1.6-3M15.1 18.3l1.6-3M17.2 19.4l1.6-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    musician: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12" cy="22" r="4" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="23" cy="19" r="3.2" stroke="currentColor" stroke-width="1.6"/>
      <path d="M16 22V8.5l10-2.5V19" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    </svg>`,
    mechanic: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="12.5" cy="12.5" r="6" stroke="currentColor" stroke-width="1.6"/>
      <path d="M12.5 7.2v3M12.5 14.8v3M7.2 12.5h3M14.8 12.5h3M8.7 8.7l2.1 2.1M14.2 14.2l2.1 2.1M8.7 16.3l2.1-2.1M14.2 10.8l2.1-2.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M16.8 16.8l9 9M23.4 23.4l2.6-2.6c.8-.8 2.2-.7 2.8.3l.1.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,
    gotham: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="23.5" cy="8" r="2.4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 27h26" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M5 27V18h3v-5l3-3v8h2V9l3-4 2 3 2-2 3 5v16H5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M8 22v2M13 20v4M18 19v5M22 21v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`,
    space: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 4l3 9 9 3-9 3-3 9-3-9-9-3 9-3 3-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
      <path d="M25 8c3 3 3 8 0 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    gaming: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="12" width="24" height="12" rx="6" stroke="currentColor" stroke-width="1.6"/>
      <path d="M10 18h4M12 16v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="20" cy="17" r="1.2" fill="currentColor"/>
      <circle cx="23" cy="20" r="1.2" fill="currentColor"/>
    </svg>`,
    "marvel-fans": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 26V8h5l5 12 5-12h5v18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M10 26V16" stroke="currentColor" stroke-width="1.6"/>
    </svg>`,
    "star-wars-fans": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="1.5"/>
      <ellipse cx="16" cy="16" rx="10" ry="4" stroke="currentColor" stroke-width="1.4"/>
      <path d="M16 6v20M6 16h20" stroke="currentColor" stroke-width="1.3"/>
    </svg>`,
    "potter-fans": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 26c2-8 4-16 8-16s6 8 8 16" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M12 20h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M16 6l1 3-1 1-1-1 1-3z" fill="currentColor"/>
    </svg>`,
    "disney-fans": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="11" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="21" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="16" cy="18" r="6.5" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,
    basketball: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="1.6"/>
      <path d="M16 6c-3 3.5-3 16.5 0 20M6 16c3.5-3 16.5-3 20 0M8.5 9.5c6 2 9 5 14 13M8.5 22.5c6-2 9-5 14-13" stroke="currentColor" stroke-width="1.3"/>
    </svg>`,
    baseball: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="1.6"/>
      <path d="M9 8.5c3 3 4 12 0 15.5M23 8.5c-3 3-4 12 0 15.5" stroke="currentColor" stroke-width="1.4"/>
    </svg>`,
    "fishing-outdoors": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 8h6l14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M26 22c0 3-2.5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M8 20c2 2 6 2 8 0 2 3 6 4 10 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    "cars-racing": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 18l3-5h10l5 5v4H6v-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="11" cy="23" r="2.2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="22" cy="23" r="2.2" stroke="currentColor" stroke-width="1.5"/>
      <path d="M14 13v5" stroke="currentColor" stroke-width="1.4"/>
    </svg>`,
    "cozy-self-care": `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 22c0-5 3.2-8 8-8s8 3 8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M10 22h12v2a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M16 8c0 2-1.5 3.5-1.5 3.5S16 13 16 8c0-2 2-3 2-3s-2 1-2 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
    </svg>`,
    squishy: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M8 18c0-6 3.2-10 8-10s8 4 8 10c0 5-2.8 8.5-8 8.5S8 23 8 18z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M12.2 17.2c.2-1.2 1-1.8 1.8-1.8M18 15.4c.9 0 1.7.6 1.9 1.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M13.5 21c1.2 1.3 3.8 1.3 5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7 14c-1.4.6-2.2 1.8-2.2 3.2M25 14c1.4.6 2.2 1.8 2.2 3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`,
    halloween: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 7c0-2 1.4-3.2 2.6-3.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M7.5 14c1-6 4.2-8.5 8.5-8.5s7.5 2.5 8.5 8.5c1 5.6-1.8 12.5-8.5 12.5S6.5 19.6 7.5 14z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M12.2 15.2l2.2-2.6 1 2.8M16.6 15.4l2.2-2.8 1.1 2.8" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M13 20c.8 1.4 2 2.1 3 2.1s2.2-.7 3-2.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    christmas: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 5l7 8h-4l5 6h-4.5l5 7H7.5l5-7H8l5-6h-4l7-8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M13 26h6v3h-6v-3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    stpatricksday: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 17c-3.2-3.4-7.6-2.2-7.6 1.4 0 2.4 2 4 4.2 3.2 1.2-.4 2.4-1.8 3.4-3.4 1 1.6 2.2 3 3.4 3.4 2.2.8 4.2-.8 4.2-3.2 0-3.6-4.4-4.8-7.6-1.4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M16 18c0 3 .2 6.5 1.6 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M16 8.5c-1.8-2.4-5.2-2-5.4.6-.2 1.8 1.4 3 3.2 2.6.8-.2 1.6-1.2 2.2-2.2.6 1 1.4 2 2.2 2.2 1.8.4 3.4-.8 3.2-2.6-.2-2.6-3.6-3-5.4-.6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`,
    watches: `<svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="8.5" stroke="currentColor" stroke-width="1.6"/>
      <path d="M13 6.2h6M13 25.8h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M16 16l-2.2-3.4M16 16l3.6 1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="16" cy="16" r="1.1" fill="currentColor"/>
    </svg>`
  };

  function boxSvg(price) {
    /* Scale the illustrated box with price so size feels real */
    const t = Math.min(1, Math.max(0, (price - 20) / 480));
    const w = 28 + t * 34;
    const h = 18 + t * 28;
    const lid = 6 + t * 6;
    const x = (72 - w) / 2;
    const y = 64 - h - 4;
    return `<svg viewBox="0 0 72 68" width="${Math.round(w + 16)}" height="68" aria-hidden="true">
      <rect x="${x}" y="${y + lid * 0.55}" width="${w}" height="${h}" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <path d="M${x} ${y + lid * 0.55} l${w / 2} ${-lid} l${w / 2} ${lid}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M${x + w / 2} ${y - lid + lid * 0.55 + 0.2} v${h}" stroke="currentColor" stroke-width="1.4"/>
      <path d="M${x + 4} ${y + lid * 0.55 + h * 0.55} h${w - 8}" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
    </svg>`;
  }

  function applyBrand() {
    const name = config.name || "Store";
    document.querySelectorAll("[data-store-name]").forEach((el) => {
      el.textContent = name;
    });
    document.querySelectorAll("[data-store-tagline]").forEach((el) => {
      el.textContent = config.tagline || "";
    });
    document.querySelectorAll("[data-store-description]").forEach((el) => {
      el.textContent = config.description || "";
    });
    document.querySelectorAll("[data-store-email]").forEach((el) => {
      if (el.tagName === "A") {
        el.href = "mailto:" + config.contactEmail;
        if (!el.textContent.trim()) el.textContent = config.contactEmail;
      } else {
        el.textContent = config.contactEmail;
      }
    });
    const marketingEmail = (config.marketingEmail || "").trim() || "marketing@mymysterycreations.com";
    document.querySelectorAll("[data-store-marketing-email]").forEach((el) => {
      if (el.tagName === "A") {
        el.href = "mailto:" + marketingEmail + "?subject=" + encodeURIComponent("Partnership inquiry");
        el.textContent = marketingEmail;
      } else {
        el.textContent = marketingEmail;
      }
    });
    document.querySelectorAll("[data-disclaimer]").forEach((el) => {
      el.textContent = config.disclaimer || "";
    });
    const titleBase = document.documentElement.getAttribute("data-page-title");
    if (titleBase) {
      document.title = titleBase.replace("{name}", name);
    } else if (!document.title || document.title.indexOf(name) === -1) {
      document.title = name + " — Mystery Gifts & Mystery Boxes";
    }
  }

  function giftTiers() {
    return ((config.gifts && config.gifts.tiers) || []).slice();
  }

  function productKind(tierId) {
    if (!tierId) return null;
    if (giftTiers().some((g) => g.id === tierId)) return "gift";
    if ((config.tiers || []).some((t) => t.id === tierId)) return "box";
    return null;
  }

  function getSelection() {
    const theme = getTheme();
    const kind = productKind(state.tierId);
    if (kind === "gift") {
      const gift = giftTiers().find((g) => g.id === state.tierId);
      if (!gift) return { kind: null, tier: null, theme: theme };
      return {
        kind: "gift",
        tier: {
          id: gift.id,
          name: "Mystery Gift",
          price: gift.price,
          size: "One single item"
        },
        theme: theme
      };
    }
    if (kind === "box") {
      const tier = (config.tiers || []).find((t) => t.id === state.tierId) || null;
      return { kind: tier ? "box" : null, tier: tier, theme: theme };
    }
    return { kind: null, tier: null, theme: theme };
  }

  function fieldText(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    return String(el.value || "").trim().slice(0, 100);
  }

  function blankOr(value) {
    return value ? value : "Left blank";
  }

  function applyQuerySelection() {
    let params;
    try { params = new URLSearchParams(window.location.search); }
    catch (_) { return; }
    const theme = params.get("theme");
    const product = params.get("product");
    if (theme && (config.themes || []).some((t) => t.id === theme)) state.themeId = theme;
    if (product && productKind(product)) state.tierId = product;
    if (state.tierId && !productKind(state.tierId)) state.tierId = null;
  }

  function renderProductChoices() {
    const gifts = document.getElementById("gift-choices");
    const boxes = document.getElementById("box-choices");
    if (gifts) {
      gifts.innerHTML = giftTiers().map((gift) => `
        <label class="choice">
          <input type="radio" name="product" value="${escapeHtml(gift.id)}"${state.tierId === gift.id ? " checked" : ""}>
          <span class="choice-price">${escapeHtml(money(gift.price))}</span>
          <span class="choice-name">Mystery Gift</span>
          <span class="choice-meta">One single item</span>
        </label>
      `).join("");
    }
    if (boxes) {
      boxes.innerHTML = (config.tiers || []).map((tier) => `
        <label class="choice">
          <input type="radio" name="product" value="${escapeHtml(tier.id)}"${state.tierId === tier.id ? " checked" : ""}>
          <span class="choice-price">${escapeHtml(money(tier.price))}</span>
          <span class="choice-name">${escapeHtml(tier.name)}</span>
          <span class="choice-meta">${escapeHtml(tier.size)} · ${escapeHtml(tier.contents || "Multiple gifts")}</span>
        </label>
      `).join("");
    }
  }

  function renderThemeSelect() {
    const select = document.getElementById("theme-select");
    if (!select) return;
    select.innerHTML = `<option value="">Select a theme…</option>` +
      (config.themes || []).map((theme) =>
        `<option value="${escapeHtml(theme.id)}">${escapeHtml(theme.name)}</option>`
      ).join("");
    if (state.themeId && (config.themes || []).some((t) => t.id === state.themeId)) {
      select.value = state.themeId;
    }
    renderThemeHint();
  }

  function renderThemeHint() {
    const hint = document.getElementById("theme-hint");
    if (!hint) return;
    const theme = getTheme();
    if (!theme) {
      hint.hidden = true;
      hint.textContent = "";
      return;
    }
    hint.hidden = false;
    hint.textContent = theme.blurb;
  }

  function shippingNote() {
    return `<p class="tier-ship">Free shipping</p>`;
  }
  function contentsNote(tier) {
    const haul = tier && tier.contents ? ` <span class="tier-haul">${escapeHtml(tier.contents)}.</span>` : "";
    return `<p class="tier-contents"><strong>Mystery Box:</strong> Multiple themed gifts, hand-packed in one box.${haul}</p>`;
  }
  function renderTierOverview() {
    const root = document.getElementById("tier-overview");
    if (!root) return;
    root.innerHTML = (config.tiers || []).map((tier) => `
      <article class="overview-tier">
        <div class="box-visual" style="color: var(--gold-bright)">${boxSvg(tier.price)}</div>
        <div>
          <div class="tier-size">${escapeHtml(tier.size)}</div>
          <h3>${escapeHtml(tier.name)}</h3>
          <p class="tier-price">${money(tier.price)}</p>
          ${contentsNote(tier)}
          ${shippingNote(tier)}
          <p class="blurb">${escapeHtml(tier.blurb)}</p>
          <a class="overview-order-link" href="#box-order" data-pick-tier="${escapeHtml(tier.id)}">Order this Mystery Box</a>
        </div>
      </article>
    `).join("");
  }

  function renderThemeOverview() {
    const root = document.getElementById("theme-overview");
    if (!root) return;
    root.innerHTML = (config.themes || []).map((theme) => {
      const icon = ICONS[theme.icon] || ICONS.anime;
      return `
        <article class="overview-theme" style="--theme-accent: ${escapeHtml(theme.accent || "#d4b05a")}">
          <div class="theme-icon">${icon}</div>
          <h3>${escapeHtml(theme.name)}</h3>
          <p>${escapeHtml(theme.blurb)}</p>
          <a class="overview-order-link" href="#order" data-pick-theme="${escapeHtml(theme.id)}">Use this theme</a>
        </article>
      `;
    }).join("");
  }

  function paymentLinkFor(kind, tierId, themeId) {
    if (!kind || !tierId || !themeId) return "";
    const map = kind === "gift" ? (window.STORE_GIFT_LINKS || {}) : (window.STORE_PAYMENT_LINKS || {});
    const byTier = map[tierId];
    if (!byTier || typeof byTier !== "object") return "";
    return String(byTier[themeId] || "").trim();
  }

  function checkoutReference(tier, theme) {
    return tier.id + "--" + theme.id;
  }

  function checkoutBody() {
    const sel = getSelection();
    const tier = sel.tier;
    const theme = sel.theme;
    const recipient = fieldText("recipient");
    const giftNote = fieldText("gift-note");
    const stripe = config.stripe || {};
    if (!tier || !theme || !sel.kind) {
      return { sel: sel, recipient: recipient, giftNote: giftNote, link: "", body: null };
    }
    const ref = checkoutReference(tier, theme);
    return {
      sel: sel,
      recipient: recipient,
      giftNote: giftNote,
      link: paymentLinkFor(sel.kind, tier.id, theme.id),
      body: {
        tierId: tier.id,
        themeId: theme.id,
        tierName: sel.kind === "gift" ? "Mystery Gift" : tier.name,
        themeName: theme.name,
        productType: sel.kind,
        recipient: recipient,
        giftNote: giftNote,
        price: tier.price,
        priceCents: Math.round(Number(tier.price) * 100),
        currency: stripe.currency || "usd",
        storeName: config.name,
        clientReferenceId: ref
      }
    };
  }

  // Payment Link URLs can only carry client_reference_id (tierId--themeId). Free text
  // is not a valid client_reference_id and must not be put in the URL. Notes travel in
  // the checkout payload (and, when checkoutEndpoint is set, into Stripe custom fields
  // recipient / giftnote). A blank note stays an empty string.
  function checkoutUrl(link, reference) {
    const url = new URL(link);
    url.searchParams.set("client_reference_id", reference);
    return url.toString();
  }

  function updateSummary() {
    const packed = checkoutBody();
    const sel = packed.sel;
    const tier = sel.tier;
    const theme = sel.theme;
    const ready = !!(tier && theme && packed.link && packed.body);
    const setText = (selector, text) => {
      document.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
    };
    const itemLabel = !tier
      ? "Choose a Mystery Gift or Mystery Box"
      : (sel.kind === "gift"
        ? "Mystery Gift · one single surprise item"
        : tier.name + " Mystery Box · " + tier.size);
    setText("[data-summary-item]", itemLabel);
    setText("[data-summary-price]", tier ? money(tier.price) : "—");
    setText("[data-summary-theme]", theme ? theme.name : "Choose a theme");
    setText("[data-summary-recipient]", blankOr(packed.recipient));
    setText("[data-summary-note]", blankOr(packed.giftNote));

    const bar = document.getElementById("order-bar");
    const barLine = document.getElementById("order-bar-line");
    if (bar) {
      if (tier || theme) {
        bar.hidden = false;
        bar.classList.add("is-visible");
        document.body.classList.add("has-bar");
      } else {
        bar.classList.remove("is-visible");
        bar.hidden = true;
        document.body.classList.remove("has-bar");
      }
    }
    if (barLine) {
      const parts = [];
      if (tier) parts.push((sel.kind === "gift" ? "Mystery Gift" : tier.name) + " · " + money(tier.price));
      else parts.push("Pick a Mystery Gift or Mystery Box");
      parts.push(theme ? theme.name : "Pick a theme");
      barLine.textContent = parts.join("  ·  ");
    }

    document.querySelectorAll("[data-checkout-btn]").forEach((btn) => {
      if (ready) {
        btn.classList.remove("is-disabled");
        btn.removeAttribute("disabled");
        btn.setAttribute("aria-disabled", "false");
        btn.setAttribute("data-checkout-href", checkoutUrl(packed.link, packed.body.clientReferenceId));
      } else {
        btn.classList.add("is-disabled");
        btn.setAttribute("disabled", "disabled");
        btn.setAttribute("aria-disabled", "true");
        btn.removeAttribute("data-checkout-href");
      }
    });

    const status = document.getElementById("checkout-status");
    if (!status) return;
    if (!theme && !tier) {
      status.textContent = "Choose a theme and either a Mystery Gift price or a Mystery Box. If you skip the description or the note, that part stays blank.";
    } else if (!theme) {
      status.textContent = "Choose a theme. It is sent with this checkout along with the price you picked.";
    } else if (!tier) {
      status.textContent = "Choose a Mystery Gift price or a Mystery Box for the " + theme.name + " theme.";
    } else if (!packed.link) {
      status.textContent = "That combination isn’t available right now. Please try another price or write us at " + config.contactEmail + ".";
    } else if (sel.kind === "gift") {
      status.textContent = "Ready: " + money(tier.price) + " " + theme.name + " Mystery Gift (one single surprise item). The description and gift note above go with this checkout. A field you left empty stays blank.";
    } else {
      status.textContent = "Ready: " + tier.name + " Mystery Box (" + money(tier.price) + ", multiple gifts) in the " + theme.name + " theme. The description and gift note above go with this checkout. A field you left empty stays blank.";
    }
  }

  let checkoutBusy = false;
  function setCheckoutLoading(on) {
    checkoutBusy = on;
    document.body.classList.toggle("checkout-loading", on);
    let overlay = document.getElementById("checkout-loading");
    if (on && !overlay) {
      overlay = document.createElement("div");
      overlay.id = "checkout-loading";
      overlay.className = "checkout-loading";
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");
      overlay.innerHTML = '<div class="checkout-loading-card"><span class="checkout-spinner" aria-hidden="true"></span><p>Opening secure checkout…</p></div>';
      document.body.appendChild(overlay);
    }
    if (overlay) overlay.hidden = !on;
    document.querySelectorAll("[data-checkout-btn]").forEach((btn) => {
      if (on) {
        btn.setAttribute("disabled", "disabled");
        btn.setAttribute("aria-busy", "true");
        if (!btn.dataset.label) btn.dataset.label = btn.textContent;
        btn.textContent = "Opening secure checkout…";
      } else {
        btn.removeAttribute("aria-busy");
        if (btn.dataset.label) btn.textContent = btn.dataset.label;
        updateSummary();
      }
    });
  }
  // Coming back from Stripe with the Back button restores the page from bfcache; clear the spinner.
  window.addEventListener("pageshow", (e) => { if (e.persisted && checkoutBusy) setCheckoutLoading(false); });

  async function startCheckout() {
    const packed = checkoutBody();
    const tier = packed.sel.tier;
    const theme = packed.sel.theme;
    if (!theme) {
      const el = document.getElementById("theme-select");
      if (el) el.focus();
      return;
    }
    if (!tier) {
      const el = document.getElementById("gifts");
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const stripe = config.stripe || {};
    const endpoint = (stripe.checkoutEndpoint || "").trim();
    try {
      if (packed.body) sessionStorage.setItem("mc-checkout", JSON.stringify(packed.body));
    } catch (_) { /* ignore */ }
    if (checkoutBusy) return;
    const fallback = packed.link && packed.body ? checkoutUrl(packed.link, packed.body.clientReferenceId) : "";

    if (endpoint && packed.body) {
      setCheckoutLoading(true);
      const ctrl = typeof AbortController === "function" ? new AbortController() : null;
      const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 10000);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(packed.body),
          signal: ctrl ? ctrl.signal : undefined
        });
        if (!res.ok) throw new Error("Checkout endpoint returned " + res.status);
        const data = await res.json();
        if (!data || typeof data.url !== "string" || !/^https:\/\/checkout\.stripe\.com\//.test(data.url)) {
          throw new Error("Checkout endpoint did not return a Stripe url");
        }
        window.location.href = data.url;
        return;
      } catch (err) {
        console.error(err);
        // Fall back to the Payment Link (fields won't be prefilled, but the sale still goes through).
        if (fallback) { window.location.href = fallback; return; }
        setCheckoutLoading(false);
        alert("We couldn’t start Stripe Checkout. Please try again, or contact " + config.contactEmail + ".");
        return;
      } finally {
        clearTimeout(timer);
      }
    }

    if (fallback) {
      setCheckoutLoading(true);
      window.location.href = fallback;
      return;
    }
    const panel = document.getElementById("checkout");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setupNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupContact() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("contact-status");
      const name = (form.elements.namedItem("name") || {}).value || "";
      const email = (form.elements.namedItem("email") || {}).value || "";
      const message = (form.elements.namedItem("message") || {}).value || "";
      if (!name.trim() || !email.trim() || !message.trim()) {
        if (status) {
          status.className = "form-status is-err";
          status.textContent = "Please fill in your name, email, and message.";
        }
        return;
      }
      const subject = encodeURIComponent("Question for " + config.name);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
      if (status) {
        status.className = "form-status is-ok";
        status.textContent = "Opening your email app… If nothing opens, write us at " + config.contactEmail + ".";
      }
    });
  }

  function restoreNotes() {
    try {
      const saved = JSON.parse(sessionStorage.getItem("mc-notes") || "null");
      if (!saved || typeof saved !== "object") return;
      const recipient = document.getElementById("recipient");
      const note = document.getElementById("gift-note");
      if (recipient && typeof saved.recipient === "string") recipient.value = saved.recipient.slice(0, 100);
      if (note && typeof saved.giftNote === "string") note.value = saved.giftNote.slice(0, 100);
    } catch (_) { /* ignore */ }
  }

  function bindNote(id, countId) {
    const input = document.getElementById(id);
    const count = document.getElementById(countId);
    if (!input) return;
    const sync = () => {
      if (input.value.length > 100) input.value = input.value.slice(0, 100);
      if (count) count.textContent = input.value.length + " / 100";
      try {
        const recipient = document.getElementById("recipient");
        const note = document.getElementById("gift-note");
        sessionStorage.setItem("mc-notes", JSON.stringify({
          recipient: recipient ? recipient.value : "",
          giftNote: note ? note.value : ""
        }));
      } catch (_) { /* ignore */ }
      updateSummary();
    };
    input.addEventListener("input", sync);
    sync();
  }

  function setupOrderForm() {
    const form = document.getElementById("order-form");
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.addEventListener("change", () => {
        state.themeId = themeSelect.value || null;
        persist();
        renderThemeHint();
        updateSummary();
        syncBackdrop();
      });
    }
    if (form) {
      form.addEventListener("change", (e) => {
        const target = e.target;
        if (!target || target.name !== "product") return;
        state.tierId = target.value || null;
        persist();
        updateSummary();
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        startCheckout();
      });
    }
    bindNote("recipient", "recipient-count");
    bindNote("gift-note", "gift-note-count");
  }

  function starString(rating) {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function formatReviewDate(iso) {
    if (!iso) return "";
    const parts = String(iso).split("-").map((x) => parseInt(x, 10));
    if (parts.length < 3 || parts.some((n) => !n)) return "";
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function approvedReviews() {
    const raw = Array.isArray(window.STORE_REVIEWS) ? window.STORE_REVIEWS : [];
    return raw.filter((r) => {
      if (!r || typeof r !== "object") return false;
      const rating = Number(r.rating);
      const text = String(r.text || "").trim();
      const name = String(r.name || "").trim();
      return name && text && Number.isInteger(rating) && rating >= 1 && rating <= 5;
    });
  }

  function renderReviews() {
    const root = document.getElementById("reviews-list");
    if (!root) return;
    const reviews = approvedReviews();

    if (!reviews.length) {
      root.innerHTML = `<div class="reviews-empty">
        <p>No reviews yet — we’re just getting started. Ordered a Mystery Gift or a Mystery Box? We’d love to hear how it went.</p>
      </div>`;
      return;
    }

    const total = reviews.reduce((sum, r) => sum + Number(r.rating), 0);
    const avg = total / reviews.length;
    const avgLabel = avg.toFixed(1).replace(/\.0$/, "");
    const countLabel = reviews.length === 1 ? "1 review" : reviews.length + " reviews";

    const cards = reviews.map((r) => {
      const rating = Number(r.rating);
      const date = formatReviewDate(r.date);
      const meta = [r.theme, r.tier].map((x) => String(x || "").trim()).filter(Boolean).join(" · ");
      return `<article class="review-card">
        <p class="review-stars" aria-label="${rating} out of 5 stars"><span aria-hidden="true">${starString(rating)}</span></p>
        <p class="review-text">${escapeHtml(r.text)}</p>
        <p class="review-by"><strong>${escapeHtml(r.name)}</strong>${meta ? " · " + escapeHtml(meta) : ""}${date ? " · " + escapeHtml(date) : ""}</p>
      </article>`;
    }).join("");

    root.innerHTML = `<div class="reviews-summary">
        <p>Rated <strong>${escapeHtml(avgLabel)}</strong> out of 5, from ${escapeHtml(countLabel)}.</p>
      </div>
      <div class="reviews-grid">${cards}</div>`;
  }

  function setupReviewForm() {
    const form = document.getElementById("review-form");
    if (!form) return;

    const themeSelect = document.getElementById("review-theme");
    if (themeSelect) {
      (config.themes || []).forEach((theme) => {
        const opt = document.createElement("option");
        opt.value = theme.name;
        opt.textContent = theme.name;
        themeSelect.appendChild(opt);
      });
    }

    const text = document.getElementById("review-text");
    const count = document.getElementById("review-text-count");
    const updateCount = () => {
      if (!text || !count) return;
      if (text.value.length > 500) text.value = text.value.slice(0, 500);
      count.textContent = `${text.value.length} / 500`;
    };
    if (text) {
      text.addEventListener("input", updateCount);
      updateCount();
    }

    const last = document.getElementById("review-last");
    if (last) {
      last.addEventListener("input", () => {
        const letter = (last.value.match(/[A-Za-z]/) || [""])[0];
        last.value = letter ? letter.toUpperCase() : "";
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("review-status");
      const first = ((form.elements.namedItem("first") || {}).value || "").trim();
      const lastInitial = ((form.elements.namedItem("last") || {}).value || "").trim().toUpperCase();
      const email = ((form.elements.namedItem("email") || {}).value || "").trim();
      const theme = ((form.elements.namedItem("theme") || {}).value || "").trim();
      const ratingEl = form.querySelector('input[name="rating"]:checked');
      const rating = ratingEl ? ratingEl.value : "";
      const reviewText = ((form.elements.namedItem("text") || {}).value || "").trim().slice(0, 500);

      if (!first || !lastInitial || !email || !theme || !rating || !reviewText) {
        if (status) {
          status.className = "form-status is-err";
          status.textContent = "Please fill in every field, including a star rating.";
        }
        return;
      }
      if (!/^[A-Z]$/.test(lastInitial)) {
        if (status) {
          status.className = "form-status is-err";
          status.textContent = "Last initial should be a single letter.";
        }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.className = "form-status is-err";
          status.textContent = "Please enter the email you used to place the order.";
        }
        return;
      }

      const displayName = first + " " + lastInitial + ".";
      const subject = encodeURIComponent("Review – " + displayName);
      const body = encodeURIComponent(
        "A customer review submitted from the Mystery Creations site.\n\n" +
        "Name (published as): " + displayName + "\n" +
        "First name: " + first + "\n" +
        "Last initial: " + lastInitial + "\n" +
        "Order email (for verification, not published): " + email + "\n" +
        "Theme: " + theme + "\n" +
        "Rating: " + rating + " / 5\n\n" +
        "Review:\n" + reviewText
      );
      window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
      if (status) {
        status.className = "form-status is-ok";
        status.textContent = "Opening your email app… If nothing opens, write us at " + config.contactEmail + ".";
      }
    });
  }

  function setupSocialLinks() {
    const roots = document.querySelectorAll("[data-social-links]");
    if (!roots.length) return;
    const networks = [
      { key: "instagram", label: "Instagram", base: "https://www.instagram.com/" },
      { key: "tiktok", label: "TikTok", base: "https://www.tiktok.com/@" },
      { key: "x", label: "X", base: "https://x.com/" },
      { key: "facebook", label: "Facebook", base: "https://www.facebook.com/" },
      { key: "youtube", label: "YouTube", base: "https://www.youtube.com/" },
      { key: "pinterest", label: "Pinterest", base: "https://www.pinterest.com/" }
    ];
    function hrefFor(base, value) {
      const v = String(value || "").trim();
      if (!v) return "";
      if (/^https?:\/\//i.test(v)) return v;
      return base + v.replace(/^@/, "");
    }
    const links = networks.map((network) => {
      const href = hrefFor(network.base, config[network.key]);
      return href ? { href, label: network.label } : null;
    }).filter(Boolean);
    roots.forEach((root) => {
      if (!links.length) {
        root.hidden = true;
        root.innerHTML = "";
        return;
      }
      root.hidden = false;
      root.innerHTML = links.map((link) =>
        `<a href="${escapeHtml(link.href)}" rel="noopener me" target="_blank" aria-label="${escapeHtml(link.label)}">${escapeHtml(link.label)}</a>`
      ).join("");
    });
  }

  // Email list (#waitlist) is a beehiiv embedded subscribe form (iframe in index.html).
  // No mailto fallback and no client-side API key.

  function syncBackdrop() {
    if (!document.body.classList.contains("home")) return;
    const theme = getTheme();
    const root = document.documentElement;
    if (theme) {
      root.dataset.shopTheme = theme.id;
      root.style.setProperty("--theme-accent", theme.accent || "#d13f27");
      if (theme.image) {
        const photo = new URL(theme.image, window.location.href).href;
        root.style.setProperty("--theme-photo", "url(\"" + photo + "\")");
      }
      else root.style.removeProperty("--theme-photo");
    } else {
      delete root.dataset.shopTheme;
      root.style.removeProperty("--theme-accent");
      root.style.removeProperty("--theme-photo");
    }
    document.querySelectorAll(".overview-theme").forEach((card) => {
      const link = card.querySelector("[data-pick-theme]");
      const on = !!(theme && link && link.getAttribute("data-pick-theme") === theme.id);
      card.classList.toggle("is-active-theme", on);
    });
  }

  function focusProduct(value) {
    const inputs = document.querySelectorAll('input[name="product"]');
    let found = false;
    inputs.forEach((input) => {
      if (input.value === value) {
        input.checked = true;
        found = true;
      }
    });
    if (!found) return false;
    state.tierId = value;
    persist();
    updateSummary();
    return true;
  }

  function setupOrderJumps() {
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("a[href^='#']");
      if (!a) return;
      if (a.dataset.pickTier) focusProduct(a.dataset.pickTier);
      if (a.dataset.giftPick) focusProduct(a.dataset.giftPick);
      const pickTheme = a.dataset.pickTheme;
      if (pickTheme) {
        const themeSelect = document.getElementById("theme-select");
        if (themeSelect && [...themeSelect.options].some((o) => o.value === pickTheme)) {
          themeSelect.value = pickTheme;
          state.themeId = pickTheme;
          persist();
          renderThemeHint();
          updateSummary();
          syncBackdrop();
        }
      }
    });
  }

  function renderCheckoutEcho() {
    const root = document.getElementById("order-echo");
    if (!root) return;
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem("mc-checkout") || "null"); }
    catch (_) { saved = null; }
    if (!saved || typeof saved !== "object" || !saved.tierId) {
      root.hidden = true;
      return;
    }
    const recipient = String(saved.recipient || "").trim();
    const giftNote = String(saved.giftNote || "").trim();
    const price = Number(saved.price);
    const priceLabel = price ? money(price) : "";
    const name = saved.tierName || (saved.productType === "gift" ? "Mystery Gift" : "Mystery Box");
    root.hidden = false;
    root.innerHTML =
      "<p><strong>" + escapeHtml(name) + "</strong>" +
      (saved.themeName ? " · " + escapeHtml(saved.themeName) : "") +
      (priceLabel ? " · " + escapeHtml(priceLabel) : "") + "</p>" +
      "<p><strong>About them:</strong> " + escapeHtml(recipient || "Left blank") + "</p>" +
      "<p><strong>Gift note:</strong> " + escapeHtml(giftNote || "Left blank") + "</p>" +
      "<p class=\"pick-reminder\">The description of the special person affects which mystery gift is picked. The gift note does not.</p>";
  }

  applyBrand();
  applyQuerySelection();
  renderThemeSelect();
  renderProductChoices();
  renderTierOverview();
  renderThemeOverview();
  restoreNotes();
  updateSummary();
  setupNav();
  setupContact();
  setupOrderForm();
  setupOrderJumps();
  renderReviews();
  setupReviewForm();
  setupSocialLinks();
  syncBackdrop();
  renderCheckoutEcho();
})();
