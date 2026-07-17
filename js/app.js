/**
 * Shell Guide — Linux Bash ↔ CMD Windows
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

  let activeCat = "all";
  let toastTimer = null;

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

  function getFiltered() {
    const q = (searchEl.value || "").trim().toLowerCase();
    return COMMANDS.filter((cmd) => {
      if (activeCat !== "all" && cmd.cat !== activeCat) return false;
      if (!q) return true;
      const hay = [cmd.linux, cmd.win, cmd.desc, cmd.cat].join(" ").toLowerCase();
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
    const parts = String(code).split(/(#.*)$/);
    if (parts.length > 1) {
      return `<code>${escapeHtml(parts[0])}</code><span class="code-comment">${escapeHtml(parts[1] || "")}</span>`;
    }
    return `<code>${escapeHtml(code)}</code>`;
  }

  function extractCopyText(cmd) {
    return String(cmd).split("#")[0].trim();
  }

  function render() {
    const list = getFiltered();
    visibleCountEl.textContent = String(list.length);
    emptyEl.hidden = list.length > 0;

    body.innerHTML = list
      .map((cmd) => {
        const cat = CATEGORIES[cmd.cat] || { label: cmd.cat, icon: "" };
        const idx = COMMANDS.indexOf(cmd);
        return `
          <tr class="cmd-row" data-index="${idx}" tabindex="0" title="Cliquer pour copier la commande Windows">
            <td class="col-cat"><span class="cat-pill cat-${cmd.cat}">${cat.icon} ${cat.label}</span></td>
            <td class="col-linux">${highlightCode(cmd.linux)}</td>
            <td class="col-win">${highlightCode(cmd.win)}</td>
            <td class="col-desc">${escapeHtml(cmd.desc)}</td>
          </tr>
        `;
      })
      .join("");
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
    const cmd = COMMANDS[Number(row.dataset.index)];
    if (!cmd) return;
    copyText(extractCopyText(cmd.win));
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

  searchEl.addEventListener("input", render);

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

  function renderMemo() {
    const essentials = COMMANDS.filter((c) => c.essential);
    memoGrid.innerHTML = essentials
      .map(
        (cmd) => `
      <article class="memo-card" data-win="${escapeHtml(extractCopyText(cmd.win))}" title="Copier la commande Windows">
        <div class="memo-linux"><code>${escapeHtml(cmd.linux)}</code></div>
        <div class="memo-arrow">→</div>
        <div class="memo-win"><code>${escapeHtml(extractCopyText(cmd.win))}</code></div>
        <p class="memo-desc">${escapeHtml(cmd.desc)}</p>
      </article>
    `
      )
      .join("");

    memoGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".memo-card");
      if (!card) return;
      copyText(card.dataset.win);
    });
  }

  function init() {
    statCountEl.textContent = String(COMMANDS.length);
    buildFilters();
    render();
    renderMemo();
  }

  init();
})();
