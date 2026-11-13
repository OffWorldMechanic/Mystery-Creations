/* Mystery Creations storefront */
(function () {
  "use strict";

  const config = window.STORE_CONFIG;
  if (!config) {
    console.error("STORE_CONFIG is missing. Load js/config.js first.");
    return;
  }

  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: (config.stripe && config.stripe.currency) || "usd" }).format(n);

  const state = {
    tierId: null,
    themeId: null,
    recipient: "",
    giftNote: ""
  };

  try {
    const saved = JSON.parse(localStorage.getItem("mc-selection") || "null");
    if (saved) {
      if (saved.tierId) state.tierId = saved.tierId;
      if (saved.themeId) state.themeId = saved.themeId;
      if (typeof saved.recipient === "string") state.recipient = saved.recipient.slice(0, 200);
      if (typeof saved.giftNote === "string") state.giftNote = saved.giftNote.slice(0, 200);
    }
  } catch (_) { /* ignore */ }

  function persist() {
    try {
      localStorage.setItem("mc-selection", JSON.stringify(state));
    } catch (_) { /* ignore */ }
  }

  function getTier() {
    return (config.tiers || []).find((t) => t.id === state.tierId) || null;
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
    document.querySelectorAll("[data-disclaimer]").forEach((el) => {
      el.textContent = config.disclaimer || "";
    });
    const titleBase = document.documentElement.getAttribute("data-page-title");
    if (titleBase) {
      document.title = titleBase.replace("{name}", name);
    } else if (!document.title || document.title.indexOf(name) === -1) {
      document.title = name + " — Themed Mystery Boxes";
    }
  }

  function optionLabel(tier) {
    return `${tier.name} — ${money(tier.price)} (${tier.size})`;
  }

  function renderTierSelect() {
    const select = document.getElementById("tier-select");
    if (!select) return;
    const current = select.value;
    select.innerHTML = `<option value="">Select a box…</option>` +
      (config.tiers || []).map((tier) =>
        `<option value="${escapeHtml(tier.id)}">${escapeHtml(optionLabel(tier))}</option>`
      ).join("");
    if (state.tierId && (config.tiers || []).some((t) => t.id === state.tierId)) {
      select.value = state.tierId;
    } else if (current) {
      select.value = current;
    }
    renderTierSummary();
  }

  function renderTierSummary() {
    const card = document.getElementById("tier-summary");
    if (!card) return;
    const tier = getTier();
    if (!tier) {
      card.hidden = true;
      card.innerHTML = "";
      return;
    }
    card.hidden = false;
    card.innerHTML = `
      <div class="box-visual" style="color: var(--gold-bright)">${boxSvg(tier.price)}</div>
      <div class="tier-summary-copy">
        <div class="tier-size">${escapeHtml(tier.size)}</div>
        <h3>${escapeHtml(tier.name)}</h3>
        <p class="tier-price">${money(tier.price)}</p>
        <p class="blurb">${escapeHtml(tier.blurb)}</p>
      </div>
    `;
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
          <p class="blurb">${escapeHtml(tier.blurb)}</p>
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
        </article>
      `;
    }).join("");
  }

  function getGiftNote() {
    const el = document.getElementById("gift-note");
    const raw = el ? el.value : state.giftNote;
    return String(raw || "").slice(0, 200);
  }

  function getRecipient() {
    const el = document.getElementById("recipient");
    const raw = el ? el.value : state.recipient;
    return String(raw || "").slice(0, 200);
  }

  function updateFieldCounter(elId, countId, key, getter) {
    const el = document.getElementById(elId);
    const count = document.getElementById(countId);
    const value = getter();
    if (el && el.value !== value) el.value = value;
    if (count) count.textContent = `${value.length} / 200`;
    state[key] = value;
    persist();
  }

  function updateNoteCounter() {
    updateFieldCounter("gift-note", "gift-note-count", "giftNote", getGiftNote);
  }

  function updateRecipientCounter() {
    updateFieldCounter("recipient", "recipient-count", "recipient", getRecipient);
  }

  function showToast(message, duration) {
    const toast = document.getElementById("toast");
    if (!toast) return Promise.resolve();
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    const hold = typeof duration === "number" ? duration : 1400;
    return new Promise((resolve) => {
      window.setTimeout(() => {
        toast.classList.remove("is-visible");
        window.setTimeout(() => {
          toast.hidden = true;
          resolve();
        }, 280);
      }, hold);
    });
  }

  async function copyCheckoutFields(recipient, giftNote) {
    const hasRecipient = !!recipient;
    const hasNote = !!giftNote;
    if (!hasRecipient && !hasNote) return;

    let text;
    let successMessage;
    let failMessage;
    if (hasRecipient && hasNote) {
      text = "About the recipient (optional):\n" + recipient + "\n\nGift note (optional):\n" + giftNote;
      successMessage = "Copied — paste each part into the matching field at checkout";
      failMessage = "At checkout, paste your recipient details and gift note into the matching fields";
    } else if (hasRecipient) {
      text = recipient;
      successMessage = "Copied — paste it at checkout under About the recipient (optional)";
      failMessage = "Add your recipient details at checkout under About the recipient (optional)";
    } else {
      text = giftNote;
      successMessage = "Note copied — paste it at checkout under Gift note (optional)";
      failMessage = "Add your note at checkout under Gift note (optional)";
    }

    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch (_) { /* fall through */ }
    await showToast(copied ? successMessage : failMessage, hasRecipient && hasNote ? 2000 : 1400);
  }

  function updateSummary() {
    const tier = getTier();
    const theme = getTheme();
    const ready = !!(tier && theme);

    const setText = (sel, text) => {
      document.querySelectorAll(sel).forEach((el) => { el.textContent = text; });
    };

    setText("[data-summary-tier]", tier ? tier.name : "Choose a box size");
    setText("[data-summary-size]", tier ? tier.size : "—");
    setText("[data-summary-theme]", theme ? theme.name : "Choose a theme");
    setText("[data-summary-price]", tier ? money(tier.price) : "—");

    const bar = document.getElementById("order-bar");
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

    const barLine = document.getElementById("order-bar-line");
    if (barLine) {
      const parts = [tier ? `${tier.name} · ${money(tier.price)}` : "Pick a size", theme ? theme.name : "Pick a theme"];
      barLine.textContent = parts.join("  ·  ");
    }

    document.querySelectorAll("[data-checkout-btn]").forEach((btn) => {
      if (ready) {
        btn.classList.remove("is-disabled");
        btn.removeAttribute("disabled");
        btn.setAttribute("aria-disabled", "false");
      } else {
        btn.classList.add("is-disabled");
        btn.setAttribute("disabled", "disabled");
        btn.setAttribute("aria-disabled", "true");
      }
    });

    const status = document.getElementById("checkout-status");
    const stripe = config.stripe || {};
    const link = tier && stripe.paymentLinks ? (stripe.paymentLinks[tier.id] || "").trim() : "";
    const endpoint = (stripe.checkoutEndpoint || "").trim();

    if (status) {
      if (!ready) {
        status.hidden = false;
        status.innerHTML = `<span class="stripe-badge">Checkout</span>
          <h3>Select a size and a theme to continue</h3>
          <p>Your box is a two-part choice. Once both are selected, you can check out. Stripe will collect your name, email, and shipping address.</p>`;
      } else if (link || endpoint) {
        status.hidden = false;
        status.innerHTML = `<span class="stripe-badge">Stripe ready</span>
          <h3>Pay securely with Stripe</h3>
          <p>You’ll be sent to Stripe Checkout to pay ${money(tier.price)} for ${escapeHtml(tier.name)} in the ${escapeHtml(theme.name)} theme. Name, email, and shipping address are collected there.</p>`;
      } else {
        status.hidden = false;
        status.innerHTML = `<span class="stripe-badge">Checkout</span>
          <h3>This box isn’t available right now</h3>
          <p>Your selection — <strong>${escapeHtml(tier.name)}</strong> · <strong>${escapeHtml(theme.name)}</strong> · <strong>${money(tier.price)}</strong> — is saved on this device. Please try another size or write us at ${escapeHtml(config.contactEmail)}.</p>`;
      }
    }
  }

  function checkoutReference(tier, theme) {
    return `${tier.id}--${theme.id}`;
  }

  async function startCheckout() {
    const tier = getTier();
    const theme = getTheme();
    if (!tier || !theme) return;

    const stripe = config.stripe || {};
    const endpoint = (stripe.checkoutEndpoint || "").trim();
    const link = (stripe.paymentLinks && stripe.paymentLinks[tier.id] || "").trim();

    const payload = {
      tierId: tier.id,
      themeId: theme.id,
      tierName: tier.name,
      themeName: theme.name,
      price: tier.price,
      priceCents: Math.round(tier.price * 100),
      currency: stripe.currency || "usd",
      storeName: config.name,
      giftNote: getGiftNote(),
      recipient: getRecipient(),
      clientReferenceId: checkoutReference(tier, theme)
    };

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Checkout endpoint returned " + res.status);
        const data = await res.json();
        if (!data || !data.url) throw new Error("Checkout endpoint did not return a url");
        window.location.href = data.url;
        return;
      } catch (err) {
        console.error(err);
        alert("We couldn’t start Stripe Checkout. Please try again, or contact " + config.contactEmail + ".");
        return;
      }
    }

    if (link) {
      const url = new URL(link, window.location.href);
      // Payment Links do not support prefilling custom fields via URL.
      // client_reference_id carries "<tierId>--<themeId>" for fulfillment.
      url.searchParams.set("client_reference_id", payload.clientReferenceId);
      if (payload.recipient || payload.giftNote) {
        await copyCheckoutFields(payload.recipient, payload.giftNote);
      }
      window.location.href = url.toString();
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

  function setupOrderForm() {
    const form = document.getElementById("order-form");
    const tierSelect = document.getElementById("tier-select");
    const themeSelect = document.getElementById("theme-select");
    const note = document.getElementById("gift-note");
    const recipient = document.getElementById("recipient");

    if (tierSelect) {
      tierSelect.addEventListener("change", () => {
        state.tierId = tierSelect.value || null;
        persist();
        renderTierSummary();
        updateSummary();
      });
    }
    if (themeSelect) {
      themeSelect.addEventListener("change", () => {
        state.themeId = themeSelect.value || null;
        persist();
        renderThemeHint();
        updateSummary();
      });
    }
    if (recipient) {
      recipient.value = state.recipient || "";
      recipient.addEventListener("input", updateRecipientCounter);
      updateRecipientCounter();
    }
    if (note) {
      note.value = state.giftNote || "";
      note.addEventListener("input", updateNoteCounter);
      updateNoteCounter();
    }
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        startCheckout();
      });
    }
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
        <p>No reviews yet — we’re just getting started. Ordered a box? We’d love to hear how it went.</p>
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

  applyBrand();
  renderTierSelect();
  renderThemeSelect();
  renderTierOverview();
  renderThemeOverview();
  updateSummary();
  setupNav();
  setupContact();
  setupOrderForm();
  renderReviews();
  setupReviewForm();
})();
