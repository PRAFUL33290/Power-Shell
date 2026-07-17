/**
 * Suivi d’usage Grok — % restant, compteurs, localStorage
 * Design by Grok
 */

(function () {
  "use strict";

  const STORAGE_KEY = "grok-usage-tracker-v1";

  const categoryEl = document.getElementById("category-tabs");
  const planEl = document.getElementById("plan-tabs");
  const metersEl = document.getElementById("meters");
  const planNoteEl = document.getElementById("plan-note");
  const overallFill = document.getElementById("overall-fill");
  const overallPct = document.getElementById("overall-pct");
  const overallLabel = document.getElementById("overall-label");
  const summaryUsed = document.getElementById("summary-used");
  const summaryLeft = document.getElementById("summary-left");
  const tipsEl = document.getElementById("tips-grid");
  const toastEl = document.getElementById("toast");

  let state = loadState();
  let toastTimer = null;

  function defaultState() {
    return {
      category: "consumer",
      plan: "super",
      // usage[category][plan][meterId] = { used, limitOverride? }
      usage: {},
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getPlanDef() {
    const cat = USAGE_PRESETS[state.category];
    if (!cat) return null;
    return cat.plans[state.plan] || Object.values(cat.plans)[0];
  }

  function ensureUsageBucket() {
    if (!state.usage[state.category]) state.usage[state.category] = {};
    if (!state.usage[state.category][state.plan]) {
      state.usage[state.category][state.plan] = {};
    }
    return state.usage[state.category][state.plan];
  }

  function getMeterValues(meter) {
    const bucket = ensureUsageBucket();
    const stored = bucket[meter.id] || {};
    const limit = Number(stored.limit ?? meter.limit) || 0;
    const used = Math.max(0, Number(stored.used) || 0);
    const remaining = Math.max(0, limit - used);
    const usedPct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
    const leftPct = limit > 0 ? Math.max(0, 100 - usedPct) : 0;
    return { limit, used, remaining, usedPct, leftPct };
  }

  function formatNum(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toLocaleString("fr-FR", { maximumFractionDigits: 2 }) + "M";
    if (n >= 10_000) return (n / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 }) + "k";
    return n.toLocaleString("fr-FR");
  }

  function statusClass(leftPct) {
    if (leftPct > 50) return "ok";
    if (leftPct > 20) return "warn";
    return "crit";
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
  }

  /* ——— Tabs ——— */
  function renderCategoryTabs() {
    categoryEl.innerHTML = Object.entries(USAGE_PRESETS)
      .map(([key, cat]) => {
        const active = key === state.category ? " active" : "";
        const ic = typeof icon === "function" ? icon(cat.icon, "icon-sm", 14) : "";
        return `<button type="button" class="filter-btn${active}" data-cat="${key}">${ic}<span>${cat.label}</span></button>`;
      })
      .join("");
  }

  function renderPlanTabs() {
    const cat = USAGE_PRESETS[state.category];
    const plans = Object.entries(cat.plans);
    if (!cat.plans[state.plan]) {
      state.plan = plans[0][0];
    }
    planEl.innerHTML = plans
      .map(([key, plan]) => {
        const active = key === state.plan ? " active" : "";
        return `<button type="button" class="filter-btn${active}" data-plan="${key}">${plan.label}</button>`;
      })
      .join("");
  }

  /* ——— Overall ring ——— */
  function updateOverall() {
    const plan = getPlanDef();
    if (!plan) return;

    const activeMeters = plan.meters.filter((m) => {
      const { limit } = getMeterValues(m);
      return limit > 0;
    });

    if (activeMeters.length === 0) {
      overallPct.textContent = "—";
      overallLabel.textContent = "Définis une limite pour voir le reste";
      overallFill.style.strokeDashoffset = "283";
      overallFill.className = "ring-fill ok";
      summaryUsed.textContent = "—";
      summaryLeft.textContent = "—";
      return;
    }

    // Moyenne des % restants (pondérée par importance égale)
    const lefts = activeMeters.map((m) => getMeterValues(m).leftPct);
    const avgLeft = lefts.reduce((a, b) => a + b, 0) / lefts.length;
    const avgUsed = 100 - avgLeft;

    // Circle circumference ≈ 2 * π * 45 ≈ 282.7
    const C = 283;
    const offset = C - (avgLeft / 100) * C;
    overallFill.style.strokeDashoffset = String(offset);
    overallFill.className = `ring-fill ${statusClass(avgLeft)}`;
    overallPct.textContent = `${Math.round(avgLeft)}%`;
    overallLabel.textContent = "reste en moyenne";
    summaryUsed.textContent = `${Math.round(avgUsed)}% consommé`;
    summaryLeft.textContent = `${Math.round(avgLeft)}% restant`;
  }

  /* ——— Meters ——— */
  function renderMeters() {
    const plan = getPlanDef();
    if (!plan) return;
    planNoteEl.textContent = plan.note;

    metersEl.innerHTML = plan.meters
      .map((meter) => {
        const v = getMeterValues(meter);
        const st = statusClass(v.leftPct);
        const disabled = v.limit === 0 && meter.limit === 0;

        return `
          <article class="meter-card ${st}" data-id="${meter.id}">
            <header class="meter-head">
              <div>
                <h3>${escapeHtml(meter.label)}</h3>
                <p class="meter-period">${escapeHtml(meter.period)} · ${escapeHtml(meter.unit)}</p>
              </div>
              <div class="meter-pct ${st}">
                <span class="pct-num">${disabled ? "—" : Math.round(v.leftPct) + "%"}</span>
                <span class="pct-label">restant</span>
              </div>
            </header>

            <div class="meter-track" aria-hidden="true">
              <div class="meter-used" style="width:${disabled ? 0 : v.usedPct}%"></div>
            </div>

            <div class="meter-stats">
              <span>Utilisé <strong>${formatNum(v.used)}</strong></span>
              <span>Reste <strong>${formatNum(v.remaining)}</strong></span>
              <span>Limite <strong>${formatNum(v.limit)}</strong></span>
            </div>

            <div class="meter-inputs">
              <label>
                <span>Utilisé</span>
                <input type="number" min="0" step="any" data-field="used" data-id="${meter.id}" value="${v.used}" ${disabled && meter.limit === 0 ? "" : ""} />
              </label>
              <label>
                <span>Limite</span>
                <input type="number" min="0" step="any" data-field="limit" data-id="${meter.id}" value="${v.limit}" />
              </label>
              <div class="meter-actions">
                <button type="button" class="btn-sm" data-action="plus" data-id="${meter.id}" title="+1">+1</button>
                <button type="button" class="btn-sm" data-action="minus" data-id="${meter.id}" title="-1">−1</button>
                <button type="button" class="btn-sm ghost" data-action="reset" data-id="${meter.id}" title="Remettre à 0">Reset</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    updateOverall();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function setMeterField(id, field, value) {
    const bucket = ensureUsageBucket();
    if (!bucket[id]) bucket[id] = { used: 0 };
    const n = Math.max(0, Number(value) || 0);
    if (field === "used") bucket[id].used = n;
    if (field === "limit") bucket[id].limit = n;
    saveState();
    renderMeters();
  }

  function bumpMeter(id, delta) {
    const plan = getPlanDef();
    const meter = plan.meters.find((m) => m.id === id);
    if (!meter) return;
    const v = getMeterValues(meter);
    setMeterField(id, "used", Math.max(0, v.used + delta));
    showToast(delta > 0 ? `+1 ${meter.label}` : `−1 ${meter.label}`);
  }

  function resetMeter(id) {
    setMeterField(id, "used", 0);
    showToast("Compteur remis à 0");
  }

  function resetAllUsage() {
    const bucket = ensureUsageBucket();
    Object.keys(bucket).forEach((id) => {
      bucket[id] = { ...bucket[id], used: 0 };
    });
    saveState();
    renderMeters();
    showToast("Tout l’usage de ce plan remis à 0");
  }

  function restoreLimits() {
    const plan = getPlanDef();
    const bucket = ensureUsageBucket();
    plan.meters.forEach((m) => {
      if (!bucket[m.id]) bucket[m.id] = { used: 0 };
      delete bucket[m.id].limit;
    });
    saveState();
    renderMeters();
    showToast("Limites du preset restaurées");
  }

  /* ——— Events ——— */
  categoryEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    const plans = Object.keys(USAGE_PRESETS[state.category].plans);
    state.plan = plans[0];
    saveState();
    renderCategoryTabs();
    renderPlanTabs();
    renderMeters();
  });

  planEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-plan]");
    if (!btn) return;
    state.plan = btn.dataset.plan;
    saveState();
    renderPlanTabs();
    renderMeters();
  });

  metersEl.addEventListener("change", (e) => {
    const input = e.target.closest("input[data-field]");
    if (!input) return;
    setMeterField(input.dataset.id, input.dataset.field, input.value);
  });

  metersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    if (action === "plus") bumpMeter(id, 1);
    if (action === "minus") bumpMeter(id, -1);
    if (action === "reset") resetMeter(id);
  });

  document.getElementById("btn-reset-all").addEventListener("click", resetAllUsage);
  document.getElementById("btn-restore-limits").addEventListener("click", restoreLimits);

  /* ——— Tips ——— */
  function renderTips() {
    tipsEl.innerHTML = USAGE_TIPS.map(
      (t) => `
      <article class="tip-card">
        <span class="tip-num">${t.num}</span>
        <h3>${escapeHtml(t.title)}</h3>
        <p>${escapeHtml(t.body)}</p>
      </article>
    `
    ).join("");
  }

  function init() {
    // Ensure valid category/plan
    if (!USAGE_PRESETS[state.category]) state.category = "consumer";
    if (!USAGE_PRESETS[state.category].plans[state.plan]) {
      state.plan = Object.keys(USAGE_PRESETS[state.category].plans)[0];
    }
    renderCategoryTabs();
    renderPlanTabs();
    renderMeters();
    renderTips();
  }

  init();
})();
