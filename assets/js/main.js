/* =====================================================================
   Miracle Breath — interactions
   ===================================================================== */
(function () {
  "use strict";

  // Signal that the interaction script is running (used by the reveal failsafe)
  window.__mbReady = true;
  document.documentElement.classList.add("js");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state + progress ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress");
  var toTop = document.querySelector(".to-top");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (toTop) toTop.classList.toggle("show", y > 600);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  var isMobileNav = function () { return window.matchMedia("(max-width: 860px)").matches; };
  function closeMenu(focusToggle) {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (focusToggle) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = menu.querySelector("a, button");
        if (first) first.focus();
      }
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) closeMenu(true);
    });
    // keep focus within the panel while open on mobile
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !menu.classList.contains("open") || !isMobileNav()) return;
      var f = menu.querySelectorAll("a, button");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Active nav link via scroll-spy ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var id = e.target.getAttribute("id");
            navLinks.forEach(function (l) {
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Animated number counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !prefersReduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- Interactive breathing exercise ---------- */
  var circle = document.querySelector(".breath-circle");
  var phaseEl = document.querySelector(".breath-phase");
  var countEl = document.querySelector(".breath-count");
  var startBtn = document.querySelector("[data-breath-toggle]");
  var patternBtns = document.querySelectorAll("[data-pattern]");

  var patterns = {
    calm:   { name: "Calm 4-7-8",   phases: [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]] },
    box:    { name: "Box 4-4-4-4",  phases: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]] },
    relax:  { name: "Relax 4-6",    phases: [["Breathe in", 4], ["Breathe out", 6]] },
  };

  var current = "calm";
  var running = false;
  var timer = null;
  var phaseIndex = 0;
  var remaining = 0;

  function setCircle(scale, seconds) {
    if (!circle) return;
    circle.style.transitionDuration = seconds + "s";
    circle.style.transform = "scale(" + scale + ")";
  }

  function runPhase() {
    var phases = patterns[current].phases;
    var phase = phases[phaseIndex];
    var label = phase[0];
    var secs = phase[1];
    remaining = secs;

    if (phaseEl) phaseEl.textContent = label;

    if (!prefersReduced) {
      if (/in/i.test(label)) setCircle(1.5, secs);
      else if (/out/i.test(label)) setCircle(0.8, secs);
      // hold: keep current scale
    }

    if (countEl) countEl.textContent = remaining + "s";
    timer = setInterval(function () {
      remaining -= 1;
      if (countEl) countEl.textContent = (remaining > 0 ? remaining : 0) + "s";
      if (remaining <= 0) {
        clearInterval(timer);
        phaseIndex = (phaseIndex + 1) % phases.length;
        if (running) runPhase();
      }
    }, 1000);
  }

  function startBreathing() {
    running = true;
    phaseIndex = 0;
    if (startBtn) startBtn.textContent = "Pause";
    if (circle) circle.classList.add("is-running");
    runPhase();
  }

  function stopBreathing() {
    running = false;
    clearInterval(timer);
    if (startBtn) startBtn.textContent = "Begin";
    if (phaseEl) phaseEl.textContent = "Ready when you are";
    if (countEl) countEl.textContent = patterns[current].name;
    if (circle) { circle.classList.remove("is-running"); setCircle(1, 1); }
  }

  if (startBtn) {
    startBtn.addEventListener("click", function () {
      if (running) stopBreathing();
      else startBreathing();
    });
  }

  patternBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      current = btn.getAttribute("data-pattern");
      patternBtns.forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });
      stopBreathing();
    });
  });

  // initialise label
  if (countEl) countEl.textContent = patterns[current].name;

  /* ---------- Forms (front-end only demo) ---------- */
  document.querySelectorAll("[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = "Thank you — this is a concept site, so nothing was sent. We'd love to hear from you for real soon!";
        status.classList.add("ok");
      }
      form.reset();
    });
  });

  /* ---------- Drifting dandelion-seed particles ---------- */
  var seedLayer = document.querySelector(".seeds");
  if (seedLayer && !prefersReduced) {
    var count = window.innerWidth < 700 ? 9 : 16;
    for (var s = 0; s < count; s++) {
      var seed = document.createElement("span");
      seed.className = "seed";
      seed.style.left = Math.random() * 100 + "%";
      seed.style.animationDuration = 14 + Math.random() * 16 + "s";
      seed.style.animationDelay = -(Math.random() * 20) + "s";
      var scale = 0.5 + Math.random() * 1.1;
      seed.style.transform = "scale(" + scale + ")";
      seedLayer.appendChild(seed);
    }
  }

  /* ---------- Timetable filtering ---------- */
  var filterBtns = document.querySelectorAll("[data-filter]");
  var sessionCards = document.querySelectorAll("[data-tags]");
  var emptyState = document.querySelector(".tt-empty");
  if (filterBtns.length && sessionCards.length) {
    var active = "all";
    function applyFilter() {
      var shown = 0;
      sessionCards.forEach(function (card) {
        var tags = card.getAttribute("data-tags") || "";
        var match = active === "all" || tags.indexOf(active) !== -1;
        card.classList.toggle("hide", !match);
        if (match) shown++;
      });
      if (emptyState) emptyState.classList.toggle("show", shown === 0);
    }
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        active = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        applyFilter();
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
