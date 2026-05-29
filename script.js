/* ─────────────────────────────────────────────────────────────────
   Danish portfolio — v0.3 cinematic showcase
   ───────────────────────────────────────────────────────────────── */
(function () {

  /* ── nav blur on scroll ────────────────────────────────────── */
  function navScroll() {
    var nav = document.getElementById("dp-nav");
    if (!nav) return;
    function update() {
      if (window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ── top scroll-progress bar ──────────────────────────────── */
  function scrollProgress() {
    var bar = document.getElementById("dp-progress");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var total = h.scrollHeight - h.clientHeight;
      var pct = total > 0 ? (h.scrollTop || window.scrollY) / total * 100 : 0;
      bar.style.width = pct + "%";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ── floating counter — shows current project index ──────── */
  function counter() {
    var holder = document.getElementById("dp-counter");
    if (!holder) return;
    var num = holder.querySelector(".num");
    var lbl = document.getElementById("dp-counter-lbl");
    var scenes = document.querySelectorAll(".dp-scene[data-idx]");
    if (!scenes.length) return;

    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      var maxRatio = 0, active = null;
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio > maxRatio) {
          maxRatio = e.intersectionRatio;
          active = e.target;
        }
      });
      if (active) {
        num.textContent = active.getAttribute("data-idx") || "00";
        if (lbl) lbl.textContent = active.getAttribute("data-name") || "";
        holder.classList.add("show");
      }
    }, { threshold: [0.25, 0.5, 0.75] });

    scenes.forEach(function (s) { io.observe(s); });

    // hide when nothing is in view (above projects or after)
    var fader = new IntersectionObserver(function (entries) {
      var anyActive = false;
      entries.forEach(function (e) {
        if (e.isIntersecting) anyActive = true;
      });
      if (!anyActive) holder.classList.remove("show");
    }, { threshold: 0.05 });
    scenes.forEach(function (s) { fader.observe(s); });
  }

  /* ── reveal-on-scroll ─────────────────────────────────────── */
  function revealOnScroll() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── animated stat counters ───────────────────────────────── */
  function countUp() {
    var els = document.querySelectorAll(".dp-stat .num[data-target]");
    if (!els.length) return;
    function animate(el) {
      var target = parseFloat(el.getAttribute("data-target")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1500;
      var start = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        var v = target * eased;
        var display;
        if (target >= 1000) display = Math.floor(v).toLocaleString();
        else if (target >= 100) display = Math.floor(v);
        else if (target >= 10) display = Math.floor(v);
        else display = v.toFixed(1).replace(/\.0$/, "");
        el.textContent = prefix + display + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if (!("IntersectionObserver" in window)) {
      els.forEach(animate); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          animate(e.target); io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ── mouse parallax on hero ───────────────────────────────── */
  function heroParallax() {
    var art = document.querySelector(".dp-hero-art");
    var orbs = document.querySelectorAll(".orb");
    var hero = document.querySelector(".dp-hero");
    if (!hero) return;
    hero.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5);
      var y = (e.clientY / window.innerHeight - 0.5);
      if (art) art.style.transform =
        "translate(" + (x * -22) + "px, calc(-50% + " + (y * -16) + "px))";
      orbs.forEach(function (orb, i) {
        var depth = (i + 1) * 14;
        orb.style.transform =
          "translate(" + (x * -depth) + "px, " + (y * -depth) + "px)";
      });
    });
    hero.addEventListener("mouseleave", function () {
      if (art) art.style.transform = "";
      orbs.forEach(function (orb) { orb.style.transform = ""; });
    });
  }

  /* ── fake GitHub commit graph ─────────────────────────────── */
  function ghGraph() {
    var holder = document.getElementById("dp-gh-graph");
    if (!holder) return;
    var cells = 26 * 7;
    var html = "";
    for (var i = 0; i < cells; i++) {
      var col = Math.floor(i / 7);
      var bias = col / 26;
      var r = Math.random();
      var lvl = 0;
      if (r < bias * 0.20) lvl = 0;
      else if (r < bias * 0.45 + 0.15) lvl = 1;
      else if (r < bias * 0.70 + 0.25) lvl = 2;
      else if (r < bias * 0.85 + 0.45) lvl = 3;
      else lvl = 4;
      var alpha = [0.05, 0.18, 0.35, 0.6, 0.92][lvl];
      var color =
        lvl === 0 ? "rgba(255,255,255,0.05)"
        : "rgba(124,92,255," + alpha + ")";
      html += '<div class="cell" style="background:' + color + ';"></div>';
    }
    holder.innerHTML = html;
  }

  /* ── MIRAX animated illusion — company morphs in real time ─ */
  function illusion() {
    var holder = document.getElementById("illusion-browser");
    if (!holder) return;
    var flash = document.getElementById("illusion-flash");

    var companies = [
      { domain:"aegis-dynamics.com", ticker:"NYSE: ADX", cap:"95.2",
        t1:"Securing", t2:"Tomorrow's Horizon.",
        people:"62,500", offices:"42", rev:"48" },
      { domain:"helios-systems.com", ticker:"NYSE: HLS", cap:"108.7",
        t1:"Engineering", t2:"The High Frontier.",
        people:"71,200", offices:"38", rev:"56" },
      { domain:"vortex-defense.com", ticker:"NYSE: VTX", cap:"73.4",
        t1:"Beyond", t2:"The Visible Battlefield.",
        people:"48,800", offices:"31", rev:"39" },
      { domain:"astraeus-corp.com", ticker:"NYSE: ASTR", cap:"127.9",
        t1:"Where Defense", t2:"Meets the Stars.",
        people:"86,400", offices:"52", rev:"64" },
      { domain:"meridian-aero.com", ticker:"NYSE: MRDN", cap:"81.6",
        t1:"Quietly", t2:"Holding the Line.",
        people:"54,100", offices:"35", rev:"42" },
      { domain:"sentinel-prime.com", ticker:"NYSE: SNTL", cap:"112.3",
        t1:"The Watchful", t2:"Edge of Tomorrow.",
        people:"79,800", offices:"47", rev:"58" }
    ];

    var attacks = [
      { tag:"T1190", cls:"d", txt:"Exploit Public-Facing App" },
      { tag:"T1083", cls:"w", txt:"File &amp; Directory Discovery" },
      { tag:"T1110", cls:"d", txt:"Brute Force" },
      { tag:"T1059", cls:"d", txt:"Command &amp; Scripting Interpreter" },
      { tag:"T1003", cls:"d", txt:"OS Credential Dumping" },
      { tag:"T1071", cls:"w", txt:"Application Layer Protocol" },
      { tag:"T1018", cls:"w", txt:"Remote System Discovery" },
      { tag:"T1133", cls:"d", txt:"External Remote Services" },
      { tag:"T1497", cls:"w", txt:"Sandbox / VM Detection" },
      { tag:"T1027", cls:"d", txt:"Obfuscated Files" }
    ];

    var i = 0;

    function setText(sel, val) {
      var els = holder.querySelectorAll('[data-illusion="' + sel + '"]');
      els.forEach(function (e) { e.innerHTML = val; });
    }

    function morph() {
      i = (i + 1) % companies.length;
      var c = companies[i];

      // glitch flash
      if (flash) {
        flash.classList.add("fire");
        setTimeout(function () { flash.classList.remove("fire"); }, 220);
      }

      // glitch title for a moment
      var title = holder.querySelector(".glitch-text");
      if (title) {
        title.setAttribute("data-text", c.t1 + " " + c.t2);
        title.classList.add("glitching");
        setTimeout(function () { title.classList.remove("glitching"); }, 420);
      }

      // domain swap glow
      var dom = holder.querySelector(".illusion-domain");
      if (dom) {
        dom.classList.add("swap");
        setTimeout(function () { dom.classList.remove("swap"); }, 600);
      }

      // 120ms after the flash starts → swap the content
      setTimeout(function () {
        setText("domain",   c.domain);
        setText("ticker",   c.ticker);
        setText("cap",      c.cap);
        setText("title-1",  c.t1);
        setText("title-2",  c.t2);
        setText("people",   c.people);
        setText("offices",  c.offices);
        setText("rev",      c.rev);
      }, 120);
    }

    // Watcher feed: shuffle in new attack lines
    function shuffleAttacks() {
      var rows = ["wt-feed-0", "wt-feed-1", "wt-feed-2"]
        .map(function (id) { return document.getElementById(id); });
      // pick 3 random distinct attacks
      var pool = attacks.slice().sort(function () { return Math.random() - 0.5; });
      rows.forEach(function (r, idx) {
        if (!r) return;
        var a = pool[idx];
        r.innerHTML = '<span class="wt-tag wt-tag-' + a.cls + '">' + a.tag +
          '</span> &middot; ' + a.txt;
      });
    }

    // run on a slow cinematic cadence
    setInterval(morph, 3500);
    setInterval(shuffleAttacks, 2800);
  }

  /* ── live HUD telemetry tickers ──────────────────────────── */
  function telemetry() {
    var ticks = document.querySelectorAll(".tick[data-low][data-high]");
    if (!ticks.length) return;
    setInterval(function () {
      ticks.forEach(function (el) {
        var lo = parseFloat(el.getAttribute("data-low")) || 0;
        var hi = parseFloat(el.getAttribute("data-high")) || 100;
        var cur = parseFloat(el.textContent) || lo;
        // small random walk inside [lo, hi]
        var delta = Math.round((Math.random() - 0.5) * Math.max(2, (hi - lo) * 0.06));
        var next = Math.max(lo, Math.min(hi, cur + delta));
        el.textContent = next;
      });
    }, 1200);
  }

  function init() {
    navScroll();
    scrollProgress();
    counter();
    revealOnScroll();
    countUp();
    heroParallax();
    ghGraph();
    telemetry();
    illusion();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
