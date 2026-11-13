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
    themeId: null
  };

  try {
    const saved = JSON.parse(localStorage.getItem("mc-selection") || "null");
    if (saved && saved.tierId && saved.themeId) {
      state.tierId = saved.tierId;
      state.themeId = saved.themeId;
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
    </svg>`
  };

  function boxSvg(price) {
    /* Scale the illustrated box with price so size feels real */
    const t = Math.min(1, Math.max(0, (price - 30) / 470));
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

  function renderTiers() {
    const root = document.getElementById("tier-grid");
    if (!root) return;
    root.innerHTML = "";
    (config.tiers || []).forEach((tier) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tier-card" + (state.tierId === tier.id ? " is-selected" : "");
      btn.setAttribute("aria-pressed", state.tierId === tier.id ? "true" : "false");
      btn.dataset.tierId = tier.id;
      btn.innerHTML = `
        <div class="box-visual" style="color: var(--gold-bright)">${boxSvg(tier.price)}</div>
        <div class="tier-size">${escapeHtml(tier.size)}</div>
        <h3>${escapeHtml(tier.name)}</h3>
        <p class="tier-price">${money(tier.price)}</p>
        <p class="blurb">${escapeHtml(tier.blurb)}</p>
        <div class="selected-mark">${state.tierId === tier.id ? "Selected" : ""}</div>
      `;
      btn.addEventListener("click", () => {
        state.tierId = tier.id;
        persist();
        renderTiers();
        updateSummary();
      });
      root.appendChild(btn);
    });
  }

  function renderThemes() {
    const root = document.getElementById("theme-grid");
    if (!root) return;
    root.innerHTML = "";
    (config.themes || []).forEach((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-card" + (state.themeId === theme.id ? " is-selected" : "");
      btn.setAttribute("aria-pressed", state.themeId === theme.id ? "true" : "false");
      btn.style.setProperty("--theme-accent", theme.accent || "#d4b05a");
      btn.dataset.themeId = theme.id;
      const icon = ICONS[theme.icon] || ICONS.anime;
      btn.innerHTML = `
        <div class="theme-icon">${icon}</div>
        <h3>${escapeHtml(theme.name)}</h3>
        <p>${escapeHtml(theme.blurb)}</p>
        <div class="selected-mark">${state.themeId === theme.id ? "Selected" : ""}</div>
      `;
      btn.addEventListener("click", () => {
        state.themeId = theme.id;
        persist();
        renderThemes();
        updateSummary();
      });
      root.appendChild(btn);
    });
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
        status.innerHTML = `<span class="stripe-badge">Stripe not connected</span>
          <h3>Payments are almost ready</h3>
          <p>This store is wired for Stripe Payment Links or Stripe Checkout, but no payment link has been added for this tier yet. Your selection — <strong>${escapeHtml(tier.name)}</strong> · <strong>${escapeHtml(theme.name)}</strong> · <strong>${money(tier.price)}</strong> — is saved on this device. After Stripe is set up, this button will take you to a secure checkout. See the README for setup steps.</p>`;
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
      url.searchParams.set("client_reference_id", payload.clientReferenceId);
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

  applyBrand();
  renderTiers();
  renderThemes();
  updateSummary();
  setupNav();
  setupContact();

  document.querySelectorAll("[data-checkout-btn]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      startCheckout();
    });
  });
})();
