/**
 * Icônes SVG partagées (remplacent tous les emojis)
 * Usage : icon("folder") → string SVG
 *         icon("folder", "icon-lg")
 */
(function (global) {
  "use strict";

  const PATHS = {
    // logo / brand
    logo: '<path d="M12 2L4 7v5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V7l-8-5z"/>',
    spark: '<path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/>',

    // terminal / OS
    terminal: '<path d="M4 5h16v14H4z"/><path d="M8 10l3 2-3 2"/><path d="M13 14h4"/>',
    linux: '<circle cx="12" cy="8" r="3.5"/><path d="M8 14c0-1.5 1.8-2.5 4-2.5s4 1 4 2.5v1.5H8V14z"/><path d="M9 20c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5"/><path d="M7.5 9.5c-1.5.3-2.5 1.2-2.5 2.5"/><path d="M16.5 9.5c1.5.3 2.5 1.2 2.5 2.5"/>',
    windows: '<path d="M3 5.5l7.5-1.2V11H3V5.5zM12 4l9-1.5V11h-9V4zM3 13h7.5v6.7L3 18.5V13zM12 13h9v6.2L12 20.5V13z"/>',
    cmd: '<path d="M4 6h16v12H4z"/><path d="M8 10l2.5 2L8 14"/><path d="M12 14h4"/>',

    // providers
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
    openai: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    claude: '<path d="M12 3l7 4v6l-7 4-7-4V7l7-4z"/>',
    vibe: '<path d="M12 3l7 4v6l-7 4-7-4V7l7-4z"/><path d="M12 8v8"/>',

    // categories
    folder: '<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>',
    file: '<path d="M7 3h7l5 5v13H7V3z"/><path d="M14 3v5h5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    wrench: '<path d="M14.5 5.5a4 4 0 00-5.7 5.4L4 15.7 6.3 18l4.8-4.8a4 4 0 005.4-5.7l-2.5 2.5-2.5-2.5 2.5-2.5z"/>',
    pencil: '<path d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5 4 20z"/><path d="M13.5 7l3.5 3.5"/>',
    package: '<path d="M3 8l9-5 9 5v9l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v9"/>',
    download: '<path d="M12 3v12M7 11l5 5 5-5M5 20h14"/>',

    // features
    monitor: '<path d="M3 5h18v12H3z"/><path d="M8 21h8M12 17v4"/>',
    brain: '<path d="M9 4a3 3 0 00-3 3v1a3 3 0 000 6v1a3 3 0 003 3"/><path d="M15 4a3 3 0 013 3v1a3 3 0 010 6v1a3 3 0 01-3 3"/><path d="M9 4c1 0 2 .5 3 1.5C13 4.5 14 4 15 4"/><path d="M12 5.5V20"/>',
    plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 01-5 5h0a5 5 0 01-5-5V8z"/><path d="M12 16v5"/>',
    box: '<path d="M3 8l9-5 9 5v9l-9 5-9-5V8z"/><path d="M12 13V22M3 8l9 5 9-5"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z"/>',
    puzzle: '<path d="M8 4h3a2 2 0 114 0h3v3a2 2 0 110 4v3h-3a2 2 0 11-4 0H8v-3a2 2 0 110-4V4z"/>',
    link: '<path d="M10 13a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L10.5 5.5"/><path d="M14 11a5 5 0 00-7.07 0L4.8 13.12a5 5 0 007.07 7.07L13.5 18.5"/>',
    earth: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>',
    chat: '<path d="M5 5h14v10H8l-3 3V5z"/>',
    tools: '<path d="M14.5 5.5a3.5 3.5 0 01-1 6.3L9 16.3 7.7 15l4.5-4.5a3.5 3.5 0 012.3-5z"/><path d="M5 19l3-1 7-7"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    warning: '<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/>',
    usage: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    compare: '<path d="M4 6h7v12H4zM13 6h7v12h-7z"/><path d="M8 10h0M8 14h0M17 10h0M17 14h0"/>',
    rates: '<path d="M4 19V5M4 19h16"/><path d="M8 16l3-5 3 3 4-7"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };

  /**
   * @param {string} name
   * @param {string} [className]
   * @param {number} [size]
   */
  function icon(name, className, size) {
    const d = PATHS[name];
    if (!d) {
      console.warn("[icons] unknown:", name);
      return "";
    }
    const s = size || 20;
    const cls = className ? ` icon ${className}` : " icon";
    return (
      `<svg class="${cls.trim()}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" ` +
      `aria-hidden="true" focusable="false">${d}</svg>`
    );
  }

  function iconFilled(name, className, size) {
    const d = PATHS[name];
    if (!d) return "";
    const s = size || 20;
    const cls = className ? ` icon icon-fill ${className}` : " icon icon-fill";
    return (
      `<svg class="${cls.trim()}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" ` +
      `stroke="none" aria-hidden="true" focusable="false">${d}</svg>`
    );
  }

  function hydrateIcons(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      const size = Number(el.getAttribute("data-icon-size") || 20);
      const cls = el.getAttribute("data-icon-class") || "";
      el.innerHTML = icon(name, cls, size);
    });
  }

  global.ICONS = PATHS;
  global.icon = icon;
  global.iconFilled = iconFilled;
  global.hydrateIcons = hydrateIcons;

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => hydrateIcons(document));
    } else {
      hydrateIcons(document);
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
