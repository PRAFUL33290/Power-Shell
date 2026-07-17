/**
 * Page rate limits — Claude · Codex · Grok
 */
(function () {
  "use strict";

  const list = [PROVIDERS.claude, PROVIDERS.codex, PROVIDERS.grok];

  function $(id) {
    return document.getElementById(id);
  }

  function renderHeroDate() {
    const el = $("rates-date");
    if (el) el.textContent = RATES_DATE;
  }

  function renderCards() {
    $("provider-cards").innerHTML = list
      .map(
        (p) => `
      <article class="rate-card rate-${p.color}">
        <div class="rate-card-icon">${typeof icon === "function" ? icon(p.icon, "icon-lg", 22) : ""}</div>
        <h2>${p.name}</h2>
        <p class="rate-vendor">${p.vendor} · ${p.product}</p>
        <p class="rate-tagline">${p.tagline}</p>
        <div class="rate-meta">
          <div>
            <span class="meta-label">Latence</span>
            <span class="meta-text">${p.latencyNote}</span>
          </div>
          <div>
            <span class="meta-label">Reset</span>
            <span class="meta-text">${p.resetNote}</span>
          </div>
        </div>
        <p class="rate-best"><strong>Idéal</strong> ${p.bestFor}</p>
        <p class="rate-worst"><strong>Faible pour</strong> ${p.worstFor}</p>
      </article>
    `
      )
      .join("");
  }

  function renderScoreTable() {
    const head = `
      <tr>
        <th>Critère (refaire des req.)</th>
        ${list.map((p) => `<th class="col-${p.color}">${p.name}</th>`).join("")}
      </tr>`;

    const body = SCORE_KEYS.map((key) => {
      const vals = list.map((p) => p.scores[key]);
      const max = Math.max(...vals);
      return `
        <tr>
          <td class="dim-label">${SCORE_LABELS[key]}</td>
          ${list
            .map((p) => {
              const s = p.scores[key];
              const pct = (s / 10) * 100;
              const win = s === max ? " score-win" : "";
              return `
                <td class="score-cell${win}">
                  <div class="score-row">
                    <span class="score-num">${s.toFixed(1)}</span>
                    <div class="score-bar"><span class="bar-${p.color}" style="width:${pct}%"></span></div>
                  </div>
                </td>`;
            })
            .join("")}
        </tr>`;
    }).join("");

    // Moyenne
    const avgs = list.map((p) => {
      const vals = SCORE_KEYS.map((k) => p.scores[k]);
      return vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    const maxAvg = Math.max(...avgs);
    const avgRow = `
      <tr class="avg-row">
        <td class="dim-label"><strong>Score global</strong></td>
        ${avgs
          .map((a, i) => {
            const p = list[i];
            const win = a === maxAvg ? " score-win" : "";
            return `<td class="score-cell${win}"><span class="score-num big">${a.toFixed(1)}</span> <span class="avg-name name-${p.color}">${p.name}</span></td>`;
          })
          .join("")}
      </tr>`;

    $("rates-score-head").innerHTML = head;
    $("rates-score-body").innerHTML = body + avgRow;
  }

  function renderLimitTables() {
    const keys = Object.keys(LIMIT_TABLES);
    $("limit-tables").innerHTML = keys
      .map((key) => {
        const t = LIMIT_TABLES[key];
        return `
          <article class="limit-block">
            <h3>${t.title}</h3>
            <p class="limit-note">${t.note}</p>
            <div class="table-wrap">
              <table class="cmd-table limit-table">
                <thead>
                  <tr>${t.columns.map((c) => `<th>${c}</th>`).join("")}</tr>
                </thead>
                <tbody>
                  ${t.rows
                    .map(
                      (row) =>
                        `<tr>${row.map((cell, i) => `<td${i === 0 ? ' class="row-key"' : ""}>${cell}</td>`).join("")}</tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function renderScenarios() {
    $("retry-scenarios").innerHTML = RETRY_SCENARIOS.map((sc) => {
      const entries = ["claude", "codex", "grok"].map((id) => {
        const p = PROVIDERS[id];
        const d = sc[id];
        return `
          <div class="retry-col rate-${p.color}">
            <h4>${p.name}</h4>
            <p class="retry-wait">Attente typique : <strong>${d.wait}</strong></p>
            <div class="retry-meter" aria-hidden="true">
              <span style="width:${d.score * 10}%"></span>
            </div>
            <p class="retry-detail">${d.detail}</p>
          </div>
        `;
      });
      return `
        <article class="retry-card">
          <h3>${sc.title}</h3>
          <div class="retry-grid">${entries.join("")}</div>
        </article>
      `;
    }).join("");
  }

  function renderVerdicts() {
    $("rates-verdicts").innerHTML = VERDICTS.map((v) => {
      const p = PROVIDERS[v.winner];
      const cls = v.invert ? "invert" : "";
      return `
        <article class="verdict-mini rate-${p.color} ${cls}">
          <h3>${v.title}</h3>
          <p class="vw">${v.invert ? "Attention : " : "Gagnant : "}<strong>${p.name}</strong></p>
          <p>${v.why}</p>
        </article>
      `;
    }).join("");
  }

  function renderTips() {
    $("rates-tips").innerHTML = TIPS.map(
      (t) => `
      <article class="tip-card">
        <span class="tip-num">${t.num}</span>
        <h3>${t.title}</h3>
        <p>${t.body}</p>
      </article>
    `
    ).join("");
  }

  function renderWinnerBanner() {
    // Highest average score
    let best = list[0];
    let bestAvg = 0;
    list.forEach((p) => {
      const avg =
        SCORE_KEYS.map((k) => p.scores[k]).reduce((a, b) => a + b, 0) / SCORE_KEYS.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        best = p;
      }
    });
    $("winner-banner").innerHTML = `
      <div class="winner-panel rate-${best.color}">
        <span class="winner-label">Pour refaire des requêtes le plus vite (API / agents)</span>
        <h2>${typeof icon === "function" ? icon(best.icon, "icon-lg", 28) : ""} ${best.name} mène en général</h2>
        <p>
          Score global indicatif <strong>${bestAvg.toFixed(1)}/10</strong> —
          débit, latence, récupération après limite et boucles agent.
          Claude et Codex restent excellents en qualité ; leurs plafonds
          <em>5&nbsp;h</em> freinent plus souvent le spam de retries.
        </p>
        <p class="winner-caveat">Indicatif uniquement — ton tier, plan et charge serveur changent le résultat réel.</p>
      </div>
    `;
  }

  function bindFilters() {
    const filters = $("table-filters");
    if (!filters) return;
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      filters.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".limit-block").forEach((block) => {
        if (f === "all") {
          block.hidden = false;
          return;
        }
        const title = block.querySelector("h3")?.textContent.toLowerCase() || "";
        block.hidden = !title.includes(f);
      });
    });
  }

  function init() {
    renderHeroDate();
    renderCards();
    renderWinnerBanner();
    renderScoreTable();
    renderLimitTables();
    renderScenarios();
    renderVerdicts();
    renderTips();
    bindFilters();
  }

  init();
})();
