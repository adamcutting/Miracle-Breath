/* =====================================================================
   Miracle Breath — interactions
   ===================================================================== */
(function () {
  "use strict";

  // Signal that the interaction script is running (used by the reveal failsafe)
  window.__mbReady = true;
  document.documentElement.classList.add("js");

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Assign directional / media reveal variants ---------- */
  document.querySelectorAll(".split").forEach(function (split) {
    var reverse = split.classList.contains("reverse");
    Array.prototype.forEach.call(split.children, function (child) {
      if (!child.classList.contains("reveal")) child.classList.add("reveal");
      if (child.matches(".split__art, .portrait-card, .split__media")) {
        child.classList.add("reveal--media");
      } else {
        child.classList.add(reverse ? "reveal--left" : "reveal--right");
      }
    });
  });

  /* ---------- Header scroll state + progress ---------- */
  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".scroll-progress");
  var toTop = document.querySelector(".to-top");

  var heroEl = document.querySelector(".hero");

  /* Parallax — positions are cached on load/resize so the scroll loop never
     reads layout (no forced reflow per frame). */
  var parallaxItems = [];
  function buildParallax() {
    parallaxItems = [];
    if (prefersReduced) return;
    var y = window.scrollY || window.pageYOffset;
    document.querySelectorAll(".ambient__img").forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      parallaxItems.push({ img: img, top: r.top + y, height: r.height });
    });
  }

  /* Scroll-based reveal safety net — guarantees anything reaching the
     viewport becomes visible even if the IntersectionObserver misses it. */
  var _revealCache = null;
  function revealInView() {
    if (prefersReduced) return;
    if (!_revealCache) _revealCache = document.querySelectorAll(".reveal");
    var vh = window.innerHeight;
    _revealCache.forEach(function (el) {
      if (el.classList.contains("in")) return;
      // Reveal anything whose top has reached (or passed) the lower viewport —
      // including elements already scrolled above the fold.
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("in");
    });
  }

  function applyParallax() {
    if (!parallaxItems.length) return;
    var vh = window.innerHeight;
    var y = window.scrollY || window.pageYOffset;
    for (var i = 0; i < parallaxItems.length; i++) {
      var it = parallaxItems[i];
      var relTop = it.top - y;
      if (relTop + it.height < -100 || relTop > vh + 100) continue;
      var progress = (relTop + it.height / 2 - vh / 2) / vh; // ~ -1..1
      var shift = Math.max(-28, Math.min(28, progress * -30));
      it.img.style.transform = "scale(1.18) translate3d(0," + shift.toFixed(1) + "px,0)";
    }
  }

  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("scrolled", y > 24);
    if (heroEl) heroEl.classList.toggle("scrolled-past", y > 120);
    if (toTop) toTop.classList.toggle("show", y > 600);
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { applyParallax(); revealInView(); ticking = false; });
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { buildParallax(); applyParallax(); }, { passive: true });
  // recompute once images/fonts settle (section heights can change)
  window.addEventListener("load", function () { buildParallax(); applyParallax(); });
  buildParallax();
  onScroll();
  applyParallax();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");
  var isMobileNav = function () { return window.matchMedia("(max-width: 1024px)").matches; };
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

  /* ---------- Guided breathing ---------- */
  (function () {
    var stage = document.querySelector(".breath-stage");
    if (!stage) return;

    var orb = stage.querySelector(".breath-orb");
    var fill = stage.querySelector(".bp-fill");
    var phaseEl = document.querySelector(".breath-phase");
    var countEl = document.querySelector(".breath-count");
    var startBtn = document.querySelector("[data-breath-toggle]");
    var soundBtn = document.querySelector("[data-breath-sound]");
    var patternBtns = Array.prototype.slice.call(document.querySelectorAll("[data-pattern]"));
    var hintEl = document.querySelector("#breath-hint");
    var roundsEl = document.querySelector(".breath-rounds");

    var R = 112, CIRC = 2 * Math.PI * R;
    if (fill) { fill.style.strokeDasharray = CIRC; fill.style.strokeDashoffset = CIRC; }

    var PATTERNS = {
      calm:  { hint: "Best for winding down and sleep.", rounds: 4,
        phases: [{ l: "Breathe in", s: 4, t: "in" }, { l: "Hold", s: 7, t: "hold" }, { l: "Breathe out", s: 8, t: "out" }] },
      box:   { hint: "Best for steady focus and reset.", rounds: 4,
        phases: [{ l: "Breathe in", s: 4, t: "in" }, { l: "Hold", s: 4, t: "hold" }, { l: "Breathe out", s: 4, t: "out" }, { l: "Hold", s: 4, t: "holdEmpty" }] },
      relax: { hint: "Best for an easy, gentle calm.", rounds: 5,
        phases: [{ l: "Breathe in", s: 4, t: "in" }, { l: "Breathe out", s: 6, t: "out" }] }
    };

    var current = "calm", running = false, finished = false;
    var raf = null, rmTimer = null, phaseIdx = 0, phaseStart = 0, round = 0;

    /* optional, lazily-created soft tones */
    var actx = null, soundOn = false;
    function ensureAudio() {
      if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { actx = null; } }
      if (actx && actx.state === "suspended") actx.resume();
    }
    function tone(freq, dur) {
      if (!soundOn || !actx) return;
      var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.05, t + Math.min(0.6, dur * 0.4));
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + dur + 0.1);
    }
    function cue(type, secs) { if (type === "in") tone(330, secs); else if (type === "out") tone(247, secs); }

    function easeInOut(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }
    function fullness(type, t) {
      if (type === "in") return easeInOut(t);
      if (type === "hold") return 1;
      if (type === "out") return easeInOut(1 - t);
      return 0; // holdEmpty
    }

    function buildDots() {
      if (!roundsEl) return;
      roundsEl.innerHTML = "";
      for (var i = 0; i < PATTERNS[current].rounds; i++) {
        var d = document.createElement("span"); d.className = "breath-dot"; roundsEl.appendChild(d);
      }
    }
    function paintDots() {
      if (!roundsEl) return;
      var dots = roundsEl.children;
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("on", i < round);
    }
    function setPhase(label) {
      if (!phaseEl || phaseEl.textContent === label) return;
      phaseEl.textContent = label;
      phaseEl.style.animation = "none"; void phaseEl.offsetWidth; phaseEl.style.animation = "phaseIn .5s var(--ease)";
    }
    function render(f) {
      if (orb) {
        orb.style.transform = "scale(" + (0.56 + f * 0.44).toFixed(3) + ")";
        orb.style.boxShadow = "0 0 " + (30 + f * 60).toFixed(0) + "px rgba(242,196,90," + (0.25 + f * 0.45).toFixed(2) + ")";
      }
      if (fill) fill.style.strokeDashoffset = (CIRC * (1 - f)).toFixed(1);
    }

    function advance(now) {
      phaseIdx++;
      if (phaseIdx >= PATTERNS[current].phases.length) { phaseIdx = 0; round++; paintDots(); }
      if (round >= PATTERNS[current].rounds) { finish(); return false; }
      var p = PATTERNS[current].phases[phaseIdx];
      setPhase(p.l); cue(p.t, p.s);
      phaseStart = now;
      return true;
    }

    function frame(now) {
      var p = PATTERNS[current].phases[phaseIdx];
      var elapsed = (now - phaseStart) / 1000;
      var t = Math.min(1, elapsed / p.s);
      render(fullness(p.t, t));
      if (countEl) countEl.textContent = Math.max(0, Math.ceil(p.s - elapsed)) || "";
      if (elapsed >= p.s) { if (!advance(now)) return; }
      raf = requestAnimationFrame(frame);
    }

    /* reduced-motion: timed phases, no per-frame scaling */
    function rmStep() {
      var p = PATTERNS[current].phases[phaseIdx];
      setPhase(p.l); cue(p.t, p.s);
      render(p.t === "hold" ? 1 : (p.t === "in" ? 1 : 0));
      var rem = p.s; if (countEl) countEl.textContent = rem;
      rmTimer = setInterval(function () {
        rem--; if (countEl) countEl.textContent = Math.max(0, rem);
        if (rem <= 0) {
          clearInterval(rmTimer);
          phaseIdx++;
          if (phaseIdx >= PATTERNS[current].phases.length) { phaseIdx = 0; round++; paintDots(); }
          if (round >= PATTERNS[current].rounds) { finish(); return; }
          rmStep();
        }
      }, 1000);
    }

    function start() {
      finished = false; running = true; round = 0; phaseIdx = 0; paintDots();
      stage.classList.add("running");
      if (startBtn) startBtn.textContent = "Pause";
      ensureAudio();
      var p = PATTERNS[current].phases[0];
      setPhase(p.l); cue(p.t, p.s);
      phaseStart = performance.now();
      if (prefersReduced) rmStep(); else raf = requestAnimationFrame(frame);
    }
    function halt() {
      running = false; stage.classList.remove("running");
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (rmTimer) { clearInterval(rmTimer); rmTimer = null; }
    }
    function stop() {
      halt(); finished = false;
      if (startBtn) startBtn.textContent = "Begin";
      render(0); setPhase("Ready"); if (countEl) countEl.textContent = "";
      round = 0; paintDots();
    }
    function finish() {
      halt(); finished = true;
      if (orb) { orb.style.transform = "scale(0.8)"; orb.style.boxShadow = "0 0 70px rgba(242,196,90,0.5)"; }
      if (fill) fill.style.strokeDashoffset = 0;
      setPhase("Beautifully done"); if (countEl) countEl.textContent = "";
      if (startBtn) startBtn.textContent = "Again";
    }

    if (startBtn) startBtn.addEventListener("click", function () { if (running) stop(); else start(); });
    patternBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        current = btn.getAttribute("data-pattern");
        patternBtns.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        if (hintEl) hintEl.textContent = PATTERNS[current].hint;
        stop(); buildDots(); paintDots();
      });
    });
    if (soundBtn) soundBtn.addEventListener("click", function () {
      soundOn = !soundOn;
      soundBtn.setAttribute("aria-pressed", soundOn ? "true" : "false");
      soundBtn.classList.toggle("on", soundOn);
      if (soundOn) ensureAudio();
    });

    buildDots(); paintDots(); render(0);
    if (hintEl) hintEl.textContent = PATTERNS[current].hint;
  })();

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

  /* ---------- Jewel theme: rising gold sparkles ---------- */
  if (!prefersReduced) {
    var spLayer = document.createElement("div");
    spLayer.className = "jewel-sparkles";
    spLayer.setAttribute("aria-hidden", "true");
    var spCount = window.innerWidth < 700 ? 12 : 20;
    for (var sp = 0; sp < spCount; sp++) {
      var spark = document.createElement("span");
      spark.className = "jewel-spark";
      spark.style.left = Math.random() * 100 + "%";
      spark.style.animationDuration = (12 + Math.random() * 14) + "s";
      spark.style.animationDelay = -(Math.random() * 20) + "s";
      spark.style.transform = "scale(" + (0.5 + Math.random()) + ")";
      spLayer.appendChild(spark);
    }
    document.body.appendChild(spLayer);
  }
})();
