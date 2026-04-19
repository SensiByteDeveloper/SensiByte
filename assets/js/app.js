(function () {
  function getTheme() {
    const stored = localStorage.getItem("sensibyte-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function updateFavicon(theme) {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return;
    let href = link.getAttribute("href");
    if (!href || href.indexOf("sensibyte-logo") === -1) return;
    if (theme === "dark") {
      href = href.replace("sensibyte-logo.png", "sensibyte-logo-dark.png");
    } else {
      href = href.replace("sensibyte-logo-dark.png", "sensibyte-logo.png");
    }
    link.setAttribute("href", href);
  }

  function setTheme(theme) {
    if (theme !== "light" && theme !== "dark") return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sensibyte-theme", theme);
    updateFavicon(theme);
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute(
        "aria-label",
        theme === "dark"
          ? t(getLang(), "common.theme_light")
          : t(getLang(), "common.theme_dark")
      );
      btn.textContent = theme === "dark" ? "☀" : "☾";
    }
  }

  function toggleTheme() {
    const next = getTheme() === "dark" ? "light" : "dark";
    setTheme(next);
  }

  function initLangDropdown() {
    const root = document.querySelector(".lang");
    const toggle = document.querySelector(".lang-toggle");
    const panel = document.querySelector(".lang-panel");
    if (!root || !toggle || !panel) return;

    function close() {
      root.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function open() {
      root.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (root.classList.contains("open")) close();
      else open();
    });

    panel.querySelectorAll(".lang-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang === "en" || lang === "nl") {
          setLang(lang);
          applyI18n(lang);
          setTheme(getTheme());
          close();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initMobileNav() {
    const btn = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector(".nav-wrap");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        open
          ? t(getLang(), "common.close_menu")
          : t(getLang(), "common.open_menu")
      );
    });
  }

  function init() {
    const lang = getLang();
    applyI18n(lang);
    setTheme(getTheme());
    initLangDropdown();
    initMobileNav();

    const themeBtn = document.querySelector("[data-theme-toggle]");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
