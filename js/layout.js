/**
 * Layout partagé — sidebar gauche + footer
 * La sidebar est en HTML dans chaque page (#site-sidebar).
 * Ce script : lien actif, menu mobile, footer.
 *
 * Nouvelle page :
 *   1. Copie le bloc <aside id="site-sidebar">…</aside> + mobile-topbar
 *   2. <div id="site-footer"></div>
 *   3. <script src="js/layout.js"></script>
 *   4. Ajoute le fichier dans FILE_TO_ID + un lien dans NAV (footer)
 */
(function () {
  "use strict";

  const FILE_TO_ID = {
    "index.html": "shell",
    "tokens.html": "tokens",
    "usage.html": "usage",
    "rates.html": "rates",
    "grok-cli.html": "cli",
    "compare.html": "compare",
  };

  const FOOTER_LINKS = [
    { href: "index.html", label: "Linux → Windows" },
    { href: "usage.html", label: "Usage Grok" },
    { href: "rates.html", label: "Rate limits" },
    { href: "tokens.html", label: "Prix tokens" },
    { href: "compare.html", label: "Comparer IA" },
    { href: "grok-cli.html", label: "Grok CLI" },
  ];

  function currentFile() {
    const path = (window.location.pathname || "").replace(/\/+$/, "");
    let file = path.split("/").pop() || "index.html";
    if (!file || file === "" || !file.includes(".")) file = "index.html";
    return file.toLowerCase();
  }

  function activeId() {
    return FILE_TO_ID[currentFile()] || null;
  }

  function markActive() {
    const active = activeId();
    document.body.classList.add("has-sidebar");

    document.querySelectorAll(".sidebar-nav .nav-link").forEach((a) => {
      const id = a.getAttribute("data-nav");
      const isActive = id && id === active;
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    document.querySelectorAll(".nav-cat").forEach((cat) => {
      const has = cat.querySelector(".nav-link.active");
      cat.classList.toggle("is-active-cat", !!has);
    });
  }

  function setSidebarOpen(open) {
    document.body.classList.toggle("sidebar-open", open);
    const toggle = document.getElementById("nav-toggle");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }
    if (backdrop) backdrop.hidden = !open;
  }

  function bindMobile() {
    const toggle = document.getElementById("nav-toggle");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (toggle) {
      toggle.addEventListener("click", () => {
        setSidebarOpen(!document.body.classList.contains("sidebar-open"));
      });
    }
    if (backdrop) {
      backdrop.addEventListener("click", () => setSidebarOpen(false));
    }
    document.querySelectorAll(".sidebar-nav .nav-link").forEach((a) => {
      a.addEventListener("click", () => setSidebarOpen(false));
    });
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    const year = new Date().getFullYear();
    const links = FOOTER_LINKS.map((l) => `<a href="${l.href}">${l.label}</a>`).join(
      '<span class="footer-dot" aria-hidden="true">·</span>'
    );
    el.outerHTML = `
<footer class="site-footer" id="site-footer">
  <div class="container footer-inner">
    <nav class="footer-nav" aria-label="Pied de page">${links}</nav>
    <p class="footer-cred">Design by <strong>Grok</strong> · xAI · ${year}</p>
  </div>
</footer>`;
  }

  function mount() {
    markActive();
    bindMobile();
    renderFooter();
  }

  window.SiteLayout = { mount, activeId, FILE_TO_ID };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
