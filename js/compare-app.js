/**
 * Comparaison Grok 4.5 · GPT-5.6 · Claude Fable 5
 */

(function () {
  "use strict";

  const models = [MODELS.grok, MODELS.gpt, MODELS.fable];

  function $(id) {
    return document.getElementById(id);
  }

  function formatUsd(n) {
    if (n == null) return "—";
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: n % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    });
  }

  function renderCards() {
    $("model-cards").innerHTML = models
      .map(
        (m) => `
      <article class="model-card model-${m.color}">
        <div class="model-card-top">
          <span class="model-badge">${m.badge}</span>
          <h2>${m.name}</h2>
          <p class="model-vendor">${m.vendor}</p>
          <p class="model-tagline">${m.tagline}</p>
        </div>
        <dl class="model-specs">
          <div><dt>Sortie</dt><dd>${m.released}</dd></div>
          <div><dt>Contexte</dt><dd>${m.context}</dd></div>
          <div><dt>Entrée / 1M</dt><dd class="price-in">${formatUsd(m.input)}</dd></div>
          <div><dt>Sortie / 1M</dt><dd class="price-out">${formatUsd(m.output)}</dd></div>
        </dl>
        ${m.notePrice ? `<p class="price-note">${m.notePrice}</p>` : ""}
        <p class="model-best"><strong>Idéal pour</strong> ${m.bestFor}</p>
      </article>
    `
      )
      .join("");
  }

  function renderScoreTable() {
    const head = `
      <tr>
        <th>Dimension</th>
        ${models.map((m) => `<th class="col-${m.color}">${m.name}</th>`).join("")}
      </tr>`;

    const rows = DIMENSIONS.map((dim) => {
      const vals = models.map((m) => m.scores[dim]);
      const max = Math.max(...vals);
      return `
        <tr>
          <td class="dim-label">${SCORE_LABELS[dim]}</td>
          ${models
            .map((m) => {
              const s = m.scores[dim];
              const pct = (s / 10) * 100;
              const win = s === max ? " score-win" : "";
              return `
                <td class="score-cell${win}">
                  <div class="score-row">
                    <span class="score-num">${s.toFixed(1)}</span>
                    <div class="score-bar"><span style="width:${pct}%"></span></div>
                  </div>
                </td>`;
            })
            .join("")}
        </tr>`;
    }).join("");

    $("score-head").innerHTML = head;
    $("score-body").innerHTML = rows;
  }

  function renderPriceBars() {
    const maxIn = Math.max(...models.map((m) => m.input));
    const maxOut = Math.max(...models.map((m) => m.output));

    $("price-bars").innerHTML = models
      .map((m) => {
        const inPct = Math.round((m.input / maxIn) * 100);
        const outPct = Math.round((m.output / maxOut) * 100);
        const ratio = ((m.input + m.output) / (MODELS.grok.input + MODELS.grok.output)).toFixed(1);
        return `
          <article class="price-card model-${m.color}">
            <h3>${m.name}</h3>
            <div class="price-metric">
              <div class="price-metric-label">
                <span>Entrée</span>
                <strong>${formatUsd(m.input)} / 1M</strong>
              </div>
              <div class="price-track"><span class="fill in" style="width:${inPct}%"></span></div>
            </div>
            <div class="price-metric">
              <div class="price-metric-label">
                <span>Sortie</span>
                <strong>${formatUsd(m.output)} / 1M</strong>
              </div>
              <div class="price-track"><span class="fill out" style="width:${outPct}%"></span></div>
            </div>
            <p class="price-ratio">
              ${
                m.id === "grok"
                  ? "Référence coût (1×)"
                  : `≈ <strong>${ratio}×</strong> le coût Grok 4.5 (in+out simplifié)`
              }
            </p>
          </article>
        `;
      })
      .join("");
  }

  function costEstimate(m, inTok, outTok) {
    return (inTok / 1e6) * m.input + (outTok / 1e6) * m.output;
  }

  function renderEstimate() {
    const inTok = Math.max(0, Number($("cmp-in").value) || 0);
    const outTok = Math.max(0, Number($("cmp-out").value) || 0);
    const costs = models.map((m) => ({ m, c: costEstimate(m, inTok, outTok) }));
    const max = Math.max(...costs.map((x) => x.c), 0.00001);

    $("cmp-estimate-body").innerHTML = costs
      .map(({ m, c }) => {
        const pct = Math.max(4, Math.round((c / max) * 100));
        return `
          <tr>
            <td><strong class="name-${m.color}">${m.name}</strong></td>
            <td class="mono">${formatUsd(c)}</td>
            <td><div class="price-track thin"><span class="fill cost-${m.color}" style="width:${pct}%"></span></div></td>
          </tr>
        `;
      })
      .join("");

    $("cmp-scenario-label").textContent =
      `${inTok.toLocaleString("fr-FR")} entrée + ${outTok.toLocaleString("fr-FR")} sortie`;
  }

  function renderProsCons() {
    $("pros-cons").innerHTML = models
      .map(
        (m) => `
      <article class="pc-card model-${m.color}">
        <h3>${m.name}</h3>
        <div class="pc-cols">
          <div>
            <h4 class="pro">Forces</h4>
            <ul>${m.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
          </div>
          <div>
            <h4 class="con">Limites</h4>
            <ul>${m.weaknesses.map((s) => `<li>${s}</li>`).join("")}</ul>
          </div>
        </div>
      </article>
    `
      )
      .join("");
  }

  function renderVerdicts() {
    $("verdicts").innerHTML = VERDICTS.map((v) => {
      if (v.winner === "mixed") {
        return `
          <article class="verdict-card mixed">
            <h3>${v.title}</h3>
            <p class="verdict-winner">Stack mixte</p>
            <p>${v.why}</p>
          </article>`;
      }
      const m = MODELS[v.winner];
      return `
        <article class="verdict-card model-${m.color}">
          <h3>${v.title}</h3>
          <p class="verdict-winner">${m.name}</p>
          <p>${v.why}</p>
        </article>`;
    }).join("");
  }

  function renderNews() {
    $("news-grid").innerHTML = NEWS.map((n) => {
      const m = MODELS[n.model];
      return `
        <article class="news-card model-${m.color}">
          <span class="news-tag">${m.name}</span>
          <h3>${n.title}</h3>
          <p>${n.body}</p>
        </article>
      `;
    }).join("");
  }

  function renderScenarios() {
    $("scenarios").innerHTML = SCENARIOS.map((s) => {
      let pickLabel = "Mix Grok + Fable + GPT";
      let color = "mixed";
      if (s.pick !== "mixed") {
        pickLabel = MODELS[s.pick].name;
        color = MODELS[s.pick].color;
      }
      return `
        <button type="button" class="scenario-btn model-${color}" data-pick="${s.pick}">
          <span class="sc-label">${s.label}</span>
          <span class="sc-desc">${s.desc}</span>
          <span class="sc-pick">→ ${pickLabel}</span>
        </button>
      `;
    }).join("");

    $("scenarios").addEventListener("click", (e) => {
      const btn = e.target.closest(".scenario-btn");
      if (!btn) return;
      document.querySelectorAll(".scenario-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const pick = btn.dataset.pick;
      const out = $("scenario-result");
      if (pick === "mixed") {
        out.innerHTML = `
          <strong>Stratégie mixte (recommandée en prod)</strong>
          <ul>
            <li><strong>Grok 4.5</strong> — volume, agents, itérations, CLI</li>
            <li><strong>Claude Fable 5</strong> — tâches critiques où 1 erreur coûte cher</li>
            <li><strong>GPT-5.6 Sol</strong> — UX ChatGPT, computer use, outils métier</li>
          </ul>`;
      } else {
        const m = MODELS[pick];
        out.innerHTML = `
          <strong class="name-${m.color}">${m.name}</strong>
          <p>${m.bestFor}</p>
          <p class="muted">${m.tagline}</p>`;
      }
      out.hidden = false;
    });
  }

  function bindEstimate() {
    ["cmp-in", "cmp-out"].forEach((id) => {
      $(id).addEventListener("input", renderEstimate);
    });
    $("cmp-scenarios").addEventListener("click", (e) => {
      const b = e.target.closest("[data-in]");
      if (!b) return;
      $("cmp-in").value = b.dataset.in;
      $("cmp-out").value = b.dataset.out;
      $("cmp-scenarios").querySelectorAll("button").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderEstimate();
    });
  }

  function init() {
    $("compare-date").textContent = COMPARE_DATE;
    renderCards();
    renderScoreTable();
    renderPriceBars();
    renderProsCons();
    renderVerdicts();
    renderNews();
    renderScenarios();
    bindEstimate();
    renderEstimate();
  }

  init();
})();
