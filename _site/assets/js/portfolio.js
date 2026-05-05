/* Aravind Cheruvu - Portfolio site interactions
 * - Theme toggle with localStorage persistence
 * - Mobile nav toggle
 * - Header shadow on scroll
 * - Active section highlighting via IntersectionObserver
 * - Show more / less for the News timeline
 * - Reveal-on-scroll animations
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portfolio-theme";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function getStoredTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStoredTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = document.getElementById("themeToggle");
    if (btn) {
      var icon = btn.querySelector("i");
      if (icon) {
        icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
      }
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function initTheme() {
    var current = getStoredTheme() ||
      (document.documentElement.getAttribute("data-theme") || "dark");
    applyTheme(current);

    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.querySelector(".primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      var icon = toggle.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars";
      }
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          var icon = toggle.querySelector("i");
          if (icon) icon.className = "fa-solid fa-bars";
        }
      });
    });
  }

  function initHeaderShadow() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var update = function () {
      if (window.scrollY > 4) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initActiveSection() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
    if (!sections.length) return;
    var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a[href^='#']"));
    if (!navLinks.length) return;

    var idToLink = {};
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.length > 1) idToLink[href.slice(1)] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute("id");
        var link = idToLink[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove("is-active"); });
          link.classList.add("is-active");
        }
      });
    }, {
      rootMargin: "-45% 0px -50% 0px",
      threshold: 0
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  function initNewsToggle() {
    var btn = document.getElementById("newsToggle");
    var list = document.getElementById("newsList");
    if (!btn || !list) return;
    var hidden = list.querySelectorAll(".news-item.is-hidden");
    if (!hidden.length) {
      btn.style.display = "none";
      return;
    }
    var labelEl = btn.querySelector(".label");
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      hidden.forEach(function (item) {
        item.classList.toggle("is-hidden", expanded);
      });
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (labelEl) labelEl.textContent = expanded ? "Show all news" : "Show fewer";
      var icon = btn.querySelector("i");
      if (icon) icon.className = expanded ? "fa-solid fa-chevron-down" : "fa-solid fa-chevron-up";
    });
  }

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  ready(function () {
    initTheme();
    initMobileNav();
    initHeaderShadow();
    initActiveSection();
    initNewsToggle();
    initReveal();
  });
})();
