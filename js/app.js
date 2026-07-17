/**
 * Power-Shell Guide — interactions
 * Design by Grok
 */

(function () {
  "use strict";

  const body = document.getElementById("cmd-body");
  const filtersEl = document.getElementById("filters");
  const searchEl = document.getElementById("search");
  const emptyEl = document.getElementById("empty-state");
  const visibleCountEl = document.getElementById("visible-count");
  const statCountEl = document.getElementById("stat-count");
  const toastEl = document.getElementById("toast");
  const memoGrid = document.getElementById("memo-grid");
  const table = document.getElementById("cmd-table");

  const showLinux = document.getElementById("show-linux");
  const showPs = document.getElementById("show-ps");
  const showCmd = document.getElementById("show-cmd");

  let activeCat = "all";
  let toastTimer = null;

  /* ——— Init filters ——— */
  function buildFilters() {
    const cats = Object.keys(CATEGORIES);
    filtersEl.innerHTML = cats
      .map((key) => {
        const c = CATEGORIES[key];
        const active = key === "all" ? " active" : "";
        return `<button type="button" class="filter-btn${active}" data-cat="${key}">${c.icon} ${c.label}</button>`;
      })
      .join("");

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeCat = btn.dataset.cat;
      filtersEl.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  }

  /* ——— Render table ——— */
  function getFiltered() {
    const q = (searchEl.value || "").trim().toLowerCase();
    return COMMANDS.filter((cmd) => {
      if (activeCat !== "all" && cmd.cat !== activeCat) return false;
      if (!q) return true;
      const hay = [cmd.linux, cmd.ps, cmd.cmd, cmd.desc, cmd.cat].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightCode(code) {
    // Sépare commentaire PowerShell / bash style pour le style
    const parts = String(code).split(/(#.*)$/);
    if (parts.length > 1) {
      return `<code>${escapeHtml(parts[0])}</code><span class="code-comment">${escapeHtml(parts[1] || "")}</span>`;
    }
    return `<code>${escapeHtml(code)}</code>`;
  }

  function render() {
    const list = getFiltered();
    visibleCountEl.textContent = String(list.length);
    emptyEl.hidden = list.length > 0;

    body.innerHTML = list
      .map((cmd, i) => {
        const cat = CATEGORIES[cmd.cat] || { label: cmd.cat, icon: "" };
        return `
          <tr class="cmd-row" data-index="${COMMANDS.indexOf(cmd)}" tabindex="0" title="Cliquer pour copier la commande PowerShell">
            <td class="col-cat"><span class="cat-pill cat-${cmd.cat}">${cat.icon} ${cat.label}</span></td>
            <td class="col-linux">${highlightCode(cmd.linux)}</td>
            <td class="col-ps">${highlightCode(cmd.ps)}</td>
            <td class="col-cmd">${highlightCode(cmd.cmd)}</td>
            <td class="col-desc">${escapeHtml(cmd.desc)}</td>
          </tr>
        `;
      })
      .join("");
  }

  /* ——— Column visibility ——— */
  function updateColumns() {
    table.classList.toggle("hide-linux", !showLinux.checked);
    table.classList.toggle("hide-ps", !showPs.checked);
    table.classList.toggle("hide-cmd", !showCmd.checked);
  }

  [showLinux, showPs, showCmd].forEach((el) => el.addEventListener("change", updateColumns));

  /* ——— Copy on click ——— */
  function extractCopyText(psCmd) {
    // Prend la partie avant le commentaire #
    return psCmd.split("#")[0].trim();
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copié : ${text}`);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast(`Copié : ${text}`);
    }
  }

  body.addEventListener("click", (e) => {
    const row = e.target.closest(".cmd-row");
    if (!row) return;
    const idx = Number(row.dataset.index);
    const cmd = COMMANDS[idx];
    if (!cmd) return;
    copyText(extractCopyText(cmd.ps));
    row.classList.add("copied");
    setTimeout(() => row.classList.remove("copied"), 400);
  });

  body.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const row = e.target.closest(".cmd-row");
    if (!row) return;
    e.preventDefault();
    row.click();
  });

  /* ——— Search ——— */
  searchEl.addEventListener("input", render);

  // Raccourci /
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchEl && document.activeElement?.tagName !== "INPUT") {
      e.preventDefault();
      searchEl.focus();
    }
    if (e.key === "Escape" && document.activeElement === searchEl) {
      searchEl.value = "";
      searchEl.blur();
      render();
    }
  });

  /* ——— Mémo des essentiels ——— */
  function renderMemo() {
    const essentials = COMMANDS.filter((c) => c.essential);
    memoGrid.innerHTML = essentials
      .map(
        (cmd) => `
      <article class="memo-card" data-ps="${escapeHtml(extractCopyText(cmd.ps))}" title="Copier PowerShell">
        <div class="memo-linux"><code>${escapeHtml(cmd.linux)}</code></div>
        <div class="memo-arrow">→</div>
        <div class="memo-ps"><code>${escapeHtml(extractCopyText(cmd.ps))}</code></div>
        <p class="memo-desc">${escapeHtml(cmd.desc)}</p>
      </article>
    `
      )
      .join("");

    memoGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".memo-card");
      if (!card) return;
      copyText(card.dataset.ps);
    });
  }

  /* ——— Boot ——— */
  function init() {
    statCountEl.textContent = String(COMMANDS.length);
    buildFilters();
    render();
    updateColumns();
    renderMemo();
  }

  init();
})();
