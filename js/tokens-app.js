/**
 * Tokens pricing page — table + estimateur de coût
 * Design by Grok
 */

(function () {
  "use strict";

  const body = document.getElementById("price-body");
  const filtersEl = document.getElementById("filters");
  const searchEl = document.getElementById("search");
  const emptyEl = document.getElementById("empty-state");
  const visibleCountEl = document.getElementById("visible-count");
  const estimateBody = document.getElementById("estimate-body");
  const inputTokensEl = document.getElementById("input-tokens");
  const outputTokensEl = document.getElementById("output-tokens");
  const scenarioBtns = document.getElementById("scenario-btns");
  const sourcesList = document.getElementById("sources-list");

  let activeProvider = "all";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatUsd(n, digits) {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    const d = digits ?? (n < 0.01 ? 4 : n < 1 ? 3 : 2);
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function formatPerM(n) {
    if (n === null || n === undefined) return "N/A";
    return formatUsd(n) + " / 1M";
  }

  function costFor(model, inTok, outTok) {
    if (model.input === null || model.output === null) return null;
    return (inTok / 1e6) * model.input + (outTok / 1e6) * model.output;
  }

  function buildFilters() {
    filtersEl.innerHTML = Object.keys(PROVIDERS)
      .map((key) => {
        const p = PROVIDERS[key];
        const active = key === "all" ? " active" : "";
        return `<button type="button" class="filter-btn${active}" data-provider="${key}">${p.icon} ${p.label}</button>`;
      })
      .join("");

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeProvider = btn.dataset.provider;
      filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTable();
      renderEstimate();
    });
  }

  function getFiltered() {
    const q = (searchEl.value || "").trim().toLowerCase();
    return TOKEN_PRICING.filter((row) => {
      if (activeProvider !== "all" && row.providerKey !== activeProvider) return false;
      if (!q) return true;
      const hay = [row.provider, row.model, row.comment, row.badge].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function priceBar(value, max) {
    if (value === null || value === undefined) {
      return `<div class="price-bar empty"><span class="bar-fill" style="width:0%"></span></div>`;
    }
    const pct = Math.max(4, Math.round((value / max) * 100));
    return `<div class="price-bar" title="${formatPerM(value)}"><span class="bar-fill" style="width:${pct}%"></span></div>`;
  }

  function renderTable() {
    const list = getFiltered();
    visibleCountEl.textContent = String(list.length);
    emptyEl.hidden = list.length > 0;

    const maxIn = Math.max(...TOKEN_PRICING.filter((r) => r.input != null).map((r) => r.input), 1);
    const maxOut = Math.max(...TOKEN_PRICING.filter((r) => r.output != null).map((r) => r.output), 1);

    body.innerHTML = list
      .map((row) => {
        const inCell =
          row.input == null
            ? `<span class="na">N/A</span>`
            : `<div class="price-cell"><strong>${formatUsd(row.input)}</strong>${priceBar(row.input, maxIn)}</div>`;
        const outCell =
          row.output == null
            ? `<span class="na">N/A</span>`
            : `<div class="price-cell"><strong>${formatUsd(row.output)}</strong>${priceBar(row.output, maxOut)}</div>`;

        const plans =
          row.plans
            ? `<div class="plan-tags">${row.plans
                .map((p) => `<span class="plan-tag">${escapeHtml(p.name)} · ${formatUsd(p.price)}/mois</span>`)
                .join("")}</div>`
            : "";

        return `
          <tr class="cmd-row price-row" data-provider="${row.providerKey}">
            <td class="col-provider">
              <span class="provider-pill provider-${row.providerKey}">${escapeHtml(row.provider)}</span>
            </td>
            <td class="col-model">
              <span class="model-name">${escapeHtml(row.model)}</span>
              <span class="model-badge">${escapeHtml(row.badge)}</span>
            </td>
            <td class="col-input">${inCell}</td>
            <td class="col-output">${outCell}</td>
            <td class="col-desc">
              ${escapeHtml(row.comment)}
              ${plans}
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderEstimate() {
    const inTok = Math.max(0, Number(inputTokensEl.value) || 0);
    const outTok = Math.max(0, Number(outputTokensEl.value) || 0);
    const list = getFiltered();

    const costs = list
      .map((row) => ({ row, cost: costFor(row, inTok, outTok) }))
      .filter((x) => x.cost !== null);

    const maxCost = Math.max(...costs.map((c) => c.cost), 0.000001);

    estimateBody.innerHTML = list
      .map((row) => {
        const cost = costFor(row, inTok, outTok);
        if (cost === null) {
          return `
            <tr>
              <td><span class="model-name">${escapeHtml(row.model)}</span></td>
              <td class="col-estimate-cost"><span class="na">Abonnement</span></td>
              <td><div class="price-bar empty"><span class="bar-fill" style="width:0%"></span></div></td>
            </tr>
          `;
        }
        const pct = Math.max(3, Math.round((cost / maxCost) * 100));
        return `
          <tr>
            <td>
              <span class="model-name">${escapeHtml(row.model)}</span>
              <span class="provider-mini">${escapeHtml(row.provider)}</span>
            </td>
            <td class="col-estimate-cost"><strong>${formatUsd(cost, cost < 0.01 ? 4 : 3)}</strong></td>
            <td><div class="price-bar"><span class="bar-fill bar-cost" style="width:${pct}%"></span></div></td>
          </tr>
        `;
      })
      .join("");

    document.getElementById("scenario-label").textContent =
      `${inTok.toLocaleString("fr-FR")} entrée + ${outTok.toLocaleString("fr-FR")} sortie`;
  }

  function bindScenarios() {
    scenarioBtns.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-in]");
      if (!btn) return;
      inputTokensEl.value = btn.dataset.in;
      outputTokensEl.value = btn.dataset.out;
      scenarioBtns.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderEstimate();
    });

    inputTokensEl.addEventListener("input", () => {
      scenarioBtns.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      renderEstimate();
    });
    outputTokensEl.addEventListener("input", () => {
      scenarioBtns.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      renderEstimate();
    });
  }

  function renderSources() {
    sourcesList.innerHTML = TOKEN_SOURCES.map(
      (s) =>
        `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">[${s.id}] ${escapeHtml(s.title)}</a></li>`
    ).join("");
  }

  searchEl.addEventListener("input", () => {
    renderTable();
    renderEstimate();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
      e.preventDefault();
      searchEl.focus();
    }
  });

  function init() {
    document.getElementById("stat-models").textContent = String(TOKEN_PRICING.length);
    document.getElementById("stat-providers").textContent = String(
      new Set(TOKEN_PRICING.map((r) => r.providerKey)).size
    );
    buildFilters();
    bindScenarios();
    renderTable();
    renderEstimate();
    renderSources();
  }

  init();
})();
