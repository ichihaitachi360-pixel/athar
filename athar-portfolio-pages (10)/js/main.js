/* ============================================================
   ATHAR ISTIAQ SHADHIN — main.js
   Navigation · Canvas universe · Interactions · Modals
   ============================================================ */
(function () {
  "use strict";
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch   = window.matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  document.body.classList.add("js");
  if (!reduced && !touch) document.body.classList.add("has-cursor");

  /* ---------------- CUSTOM CURSOR ---------------- */
  if (!reduced && !touch) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
    }, { passive: true });
    (function ringLoop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(ringLoop);
    })();
    document.addEventListener("pointerover", (e) => {
      if (e.target.closest("a,button,[role='button'],[data-hover]"))
        document.body.classList.add("cursor-hover");
    });
    document.addEventListener("pointerout", (e) => {
      if (e.target.closest("a,button,[role='button'],[data-hover]"))
        document.body.classList.remove("cursor-hover");
    });
    document.addEventListener("pointerdown", () => document.body.classList.add("cursor-down"));
    document.addEventListener("pointerup", () => document.body.classList.remove("cursor-down"));
  }

  /* ---------------- SCROLL PROGRESS + NAV ---------------- */
  const progress = $("#progress");
  const navbar = $("#navbar");
  const bgImg = $(".bg-space img");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      navbar.classList.toggle("scrolled", y > 40);
      updateJourneyProgress();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- FULLSCREEN MENU ---------------- */
  const menu = $("#menu");
  const menuBtn = $("#menuBtn");
  const menuClose = $("#menuClose");
  const menuItems = $$(".menu-item");
  menuItems.forEach((it, i) => { it.style.transitionDelay = (i * 45) + "ms"; });
  const previews = $$(".menu-preview img");
  function showPreview(key) {
    previews.forEach((p) => p.classList.toggle("show", p.dataset.key === key));
  }
  function openMenu() {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (menuClose) menuClose.focus();
  }
  function closeMenu() {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    menuItems.forEach((it) => (it.style.transitionDelay = "0ms"));
  }
  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", () => { closeMenu(); menuBtn.focus(); });
  menuItems.forEach((it) => {
    it.addEventListener("mouseenter", () => showPreview(it.dataset.preview || ""));
  });
  menu.addEventListener("mouseleave", () => showPreview("home"));

  /* smooth anchor scroll (closes menu first) — delegated so dynamic links work too */
  function scrollToTarget(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (href.length < 2) return;
    const target = $(href);
    if (!target) return;
    e.preventDefault();
    const wasOpen = menu.classList.contains("open");
    if (wasOpen) closeMenu();
    setTimeout(() => {
      scrollToTarget(target);
      history.replaceState(null, "", href);
    }, wasOpen ? 320 : 0);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (menu.classList.contains("open")) { closeMenu(); menuBtn.focus(); }
      if (modal.classList.contains("open")) closeModal();
    }
  });

  /* ---------------- SECTION + SUBSECTION OBSERVERS ---------------- */
  const NAV_MAP = {
    home: "home", about: "about", direction: "about", journey: "journey",
    education: "journey", dates: "journey", work: "work", skills: "work",
    languages: "work", experience: "work", projects: "work",
    certifications: "work", achievements: "work", volunteering: "work",
    life: "life", currently: "vision", quote: "vision", vision: "vision",
    contact: "contact"
  };
  const SUBS = {
    about: [
      ["who-i-am", "Who I Am"], ["different", "What Makes Me Different"],
      ["personality", "My Personality"], ["interests", "My Interests"],
      ["philosophy", "My Philosophy"]
    ],
    journey: [
      ["t-beginning", "The Beginning"], ["t-curiosity", "Early Curiosity"],
      ["t-school", "School Years"], ["t-teen", "The Turning Point"],
      ["t-tech", "Technology"], ["t-ai", "AI"], ["t-mkt", "Marketing"],
      ["t-build", "Building"], ["t-now", "Now"], ["t-next", "What Comes Next"]
    ],
    education: [
      ["e-schools", "Academic Timeline"], ["e-perf", "Academic Performance"],
      ["e-miles", "Milestones"], ["e-records", "Official Records"], ["e-unconv", "Unconventional Student"]
    ],
    skills: [
      ["sk-ai", "AI"], ["sk-mkt", "Digital Marketing"], ["sk-data", "Data & Analytics"],
      ["sk-tech", "Technology"], ["sk-write", "Writing & Content"],
      ["sk-auto", "Automation"], ["sk-office", "Microsoft Office"], ["sk-coffee", "Coffee / Barista"]
    ],
    languages: [
      ["lg-en", "English"], ["lg-bn", "Bangla"], ["lg-hi", "Hindi"],
      ["lg-ur", "Urdu"], ["lg-de", "German"]
    ],
    experience: [
      ["xp-tutor", "Tutoring"], ["xp-revise", "Book / Document Revision"],
      ["xp-sales", "Sales & Customer Interaction"], ["xp-gigs", "Side Gigs"],
      ["xp-lessons", "Lessons Learned"]
    ],
    projects: [
      ["pj-ai", "AI Projects"], ["pj-web", "Web Projects"], ["pj-mkt", "Marketing Experiments"],
      ["pj-data", "Data Projects"], ["pj-auto", "Automation"], ["pj-content", "Content Projects"], ["pj-exp", "Experiments"]
    ],
    certifications: [
      ["c-main", "Verified Certificates"], ["c-demo", "Extra-Curricular"]
    ],
    achievements: [
      ["a-hall", "Hall of Achievements"], ["a-real", "Real Achievements"], ["a-demo", "Wider Field"]
    ],
    volunteering: [
      ["v-events", "Events"], ["v-org", "Organizing"], ["v-exam", "Examiner / Evaluator"],
      ["v-youth", "Youth Events"], ["v-culture", "Cultural Activities"]
    ],
    life: [
      ["lf-gaming", "Gaming"], ["lf-travel", "Travel"], ["lf-reading", "Reading"],
      ["lf-coffee", "Coffee"], ["lf-tech", "Technology"], ["lf-curio", "Curiosity"]
    ],
    currently: [
      ["nw-adm", "Admission"], ["nw-lang", "Language / IELTS"], ["nw-ai", "AI"],
      ["nw-mkt", "Digital Marketing"], ["nw-proj", "Projects"], ["nw-exp", "Experiments"]
    ],
    vision: [
      ["vi-focus", "Current Focus"], ["vi-abroad", "Study Abroad"], ["vi-before30", "Before 30"],
      ["vi-plans", "Future Plans"], ["vi-build", "What I Want To Build"]
    ],
    contact: [
      ["ct-talk", "Let's Talk"], ["ct-email", "Email"], ["ct-wa", "WhatsApp"],
      ["ct-social", "Socials"], ["ct-collab", "Future Collaborations"]
    ]
  };
  const SUB_TITLES = {
    about: "ABOUT", journey: "JOURNEY", education: "EDUCATION", skills: "SKILLS",
    languages: "LANGUAGES", experience: "EXPERIENCE", projects: "PROJECTS",
    certifications: "CERTIFICATIONS", achievements: "ACHIEVEMENTS",
    volunteering: "VOLUNTEERING", life: "LIFE", currently: "CURRENTLY",
    vision: "VISION", contact: "CONTACT"
  };
  const subsEl = $("#subs");
  const railMain = $("#railMain");
  const railDiv = $("#railDiv");
  const navLinks = $$(".nav-links a");
  let activeSec = "home";
  if (railMain) {
    railMain.innerHTML = [
      ["home", "HOME"], ["about", "ABOUT"], ["journey", "JOURNEY"], ["work", "WORK"],
      ["life", "LIFE"], ["vision", "VISION"], ["contact", "CONTACT"]
    ].map((s) => '<a href="#' + s[0] + '" data-sec="' + s[0] + '"><i></i><span>' + s[1] + "</span></a>").join("");
  }

  function renderSubs(sec) {
    if (!subsEl) return;
    const list = SUBS[sec];
    if (!list) {
      subsEl.classList.remove("show");
      if (railDiv) railDiv.classList.remove("show");
      return;
    }
    subsEl.innerHTML = '<div class="subs-title">' + (SUB_TITLES[sec] || sec.toUpperCase()) + "</div>" +
      list.map((s) => '<a href="#' + s[0] + '" data-sub="' + s[0] + '"><span>' + s[1] + "</span><i></i></a>").join("");
    subsEl.classList.add("show");
    if (railDiv) railDiv.classList.add("show");
  }
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const sec = en.target.id;
      const navKey = NAV_MAP[sec] || sec;
      if (sec === activeSec) return;
      activeSec = sec;
      navLinks.forEach((a) => a.classList.toggle("active", a.dataset.sec === navKey));
      if (railMain) $$(".rail-main a", railMain).forEach((a) => a.classList.toggle("active", a.dataset.sec === navKey));
      renderSubs(sec);
      const activeSub = $(SUBS[sec] ? 'a[data-sub="' + SUBS[sec][0][0] + '"]' : null);
      if (activeSub) activeSub.classList.add("active");
    });
  }, { rootMargin: "-38% 0px -55% 0px" });
  $$("section[id], div#work").forEach((s) => { if (s.id) secObserver.observe(s); });

  const subObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.dataset.sub || en.target.id;
      $$('#subs a[data-sub]').forEach((a) => a.classList.toggle("active", a.dataset.sub === id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  $$(".subblock[id], .t-item[id], [data-sub]").forEach((s) => subObserver.observe(s));

  /* ---------------- REVEALS ---------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, .databars, .school, .roadmap").forEach((el) => revealObserver.observe(el));

  /* ---------------- COUNTERS ---------------- */
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = parseInt(el.dataset.to, 10) || 0, suf = el.dataset.suffix || "";
      countObserver.unobserve(el);
      if (reduced) { el.textContent = to + suf; return; }
      const t0 = performance.now(), dur = 1300;
      (function tick(t) {
        const p = clamp((t - t0) / dur, 0, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$(".count").forEach((el) => countObserver.observe(el));

  /* ---------------- JOURNEY TIMELINE PROGRESS ---------------- */
  const timeline = $(".timeline");
  const tProgress = $(".t-progress");
  function updateJourneyProgress() {
    if (!timeline || !tProgress) return;
    const r = timeline.getBoundingClientRect();
    const center = window.innerHeight * 0.55;
    const p = clamp((center - r.top) / r.height, 0, 1);
    tProgress.style.height = (p * 100) + "%";
  }

  /* ---------------- IDENTITY ROTATOR ---------------- */
  const rotWords = $$(".rotator span");
  if (rotWords.length) {
    let ri = 0;
    rotWords[0].classList.add("on");
    if (!reduced) setInterval(() => {
      rotWords[ri].classList.remove("on");
      ri = (ri + 1) % rotWords.length;
      rotWords[ri].classList.add("on");
    }, 2100);
  }

  /* ---------------- WORD CYCLE (writing skill) ---------------- */
  const wcWords = $$(".word-cycle span");
  if (wcWords.length) {
    let wi = 0;
    wcWords[0].classList.add("on");
    if (!reduced) setInterval(() => {
      wcWords[wi].classList.remove("on");
      wi = (wi + 1) % wcWords.length;
      wcWords[wi].classList.add("on");
    }, 2300);
  }

  /* ---------------- THEME (dark / light) ---------------- */
  const themeAttr = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  const themeBtn = $("#themeBtn");
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("athar-theme", t); } catch (e) {}
    if (themeBtn) themeBtn.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
  }
  if (themeBtn) {
    themeBtn.setAttribute("aria-label", themeAttr() === "light" ? "Switch to dark mode" : "Switch to light mode");
    themeBtn.addEventListener("click", () => setTheme(themeAttr() === "light" ? "dark" : "light"));
  }
  /* theme palettes for the space canvas */
  const PAL = {
    dark: {
      stars: ["#cfd8ff", "#aab8e8", "#e8ecff", "#8fa0d8", "#9fb4ff", "#cfd8ff", "#e8ecff", "#ffe9a0"],
      nebs: ["rgba(64,88,180,0.13)", "rgba(112,76,190,0.10)", "rgba(234,255,0,0.04)", "rgba(70,160,150,0.07)"],
      rocks: ["#8b93a7", "#7d8598", "#99a1b5", "#6f7789"],
      crater: "rgba(10,13,24,0.4)", rockRim: "rgba(238,242,255,0.2)", pink: "rgba(255,150,190,0.7)",
      moteY: "#eaff00", moteB: "#cfd8ff",
      shoot0: "rgba(234,255,0,0)", shoot1: "rgba(240,255,120,", head: "rgba(240,255,160,0.85)",
      flare: "rgba(215,228,255,", flareY: "rgba(255,244,180,",
      netLine: "rgba(140,160,220,", netY: "rgba(234,255,0,.8)", netB: "rgba(190,205,255,.55)"
    },
    light: {
      stars: ["#4a5470", "#6a7390", "#3c4459", "#7c84a0", "#5a6478", "#4a5470", "#38405a", "#a8811c"],
      nebs: ["rgba(196,152,42,0.12)", "rgba(120,150,200,0.12)", "rgba(214,164,84,0.10)", "rgba(150,175,205,0.11)"],
      rocks: ["#b5ab93", "#a89d85", "#c2b8a0", "#9a9078"],
      crater: "rgba(120,105,70,0.35)", rockRim: "rgba(70,60,30,0.22)", pink: "rgba(214,120,110,0.55)",
      moteY: "#a87b00", moteB: "#5a6478",
      shoot0: "rgba(190,130,20,0)", shoot1: "rgba(205,150,30,", head: "rgba(215,160,40,0.8)",
      flare: "rgba(255,255,255,", flareY: "rgba(170,130,25,",
      netLine: "rgba(80,95,140,", netY: "rgba(168,123,0,.85)", netB: "rgba(90,100,130,.5)"
    }
  };
  const TP = () => PAL[themeAttr()];

  /* ---------------- CERTIFICATE SHOWCASE — HORIZONTAL SLIDE ROW ---------------- */
  const rcRing = $("#rcRing");
  if (rcRing) {
    const rcCards = $$(".rc-card", rcRing);
    const N = rcCards.length;
    let rcFocus = 0, rcDrag = false, rcLastX = 0, rcMoved = 0, rcAcc = 0, rcHover = false;
    function rcOffset(i) {
      let o = (i - rcFocus) % N;
      if (o > N / 2) o -= N;
      if (o < -N / 2) o += N;
      return o;
    }
    function rcApply(animate) {
      rcCards.forEach((c, i) => {
        const o = rcOffset(i);
        const abs = Math.abs(o);
        let s = 1, op = 1, bl = 0, r = 0, z = 0;
        if (abs === 1) { s = 0.88; op = 0.5; bl = 2; r = o > 0 ? 14 : -14; z = 90; }
        else if (abs === 2) { s = 0.8; op = 0; bl = 3; r = o > 0 ? 24 : -24; z = 170; }
        if (!animate) c.style.transition = "none";
        c.style.transform = "translate(-50%,-50%) translateX(" + (o * 116) + "%) translateZ(-" + z + "px) rotateY(" + r + "deg) scale(" + s + ")";
        c.style.opacity = op;
        c.style.filter = bl ? "blur(" + bl + "px) brightness(.72)" : "none";
        c.style.zIndex = abs === 0 ? 5 : abs === 1 ? 3 : 1;
        c.classList.toggle("focus", o === 0);
      });
      if (!animate) requestAnimationFrame(() => rcCards.forEach((c) => { c.style.transition = ""; }));
    }
    function rcNext(dir) { rcFocus = (rcFocus + dir + N) % N; rcApply(true); }
    rcApply(false);
    window.addEventListener("resize", () => rcApply(false));
    rcRing.addEventListener("pointerenter", () => { rcHover = true; });
    rcRing.addEventListener("pointerleave", () => { rcHover = false; });
    rcRing.addEventListener("pointerdown", (e) => {
      rcDrag = true; rcMoved = 0; rcAcc = 0; rcLastX = e.clientX;
      try { rcRing.setPointerCapture(e.pointerId); } catch (err) {}
    });
    rcRing.addEventListener("pointermove", (e) => {
      if (!rcDrag) return;
      const dx = e.clientX - rcLastX; rcLastX = e.clientX; rcMoved += Math.abs(dx);
      if (Math.abs(rcAcc) >= 60) { rcNext(rcAcc < 0 ? 1 : -1); rcAcc = 0; }
      else rcAcc += dx;
    });
    const rcStop = () => { rcDrag = false; };
    rcRing.addEventListener("pointerup", rcStop);
    rcRing.addEventListener("pointercancel", rcStop);
    rcCards.forEach((c) => c.addEventListener("click", (e) => { if (rcMoved > 8) e.preventDefault(); }));
    setInterval(() => {
      if (reduced || rcDrag || rcHover || document.hidden) return;
      rcNext(1);
    }, 3600);
  }

  /* ---------------- LIVE PIXEL-SPACE BACKGROUND ---------------- */
  const starsCanvas = $("#stars");
  const STAR_COLORS = ["#cfd8ff", "#aab8e8", "#e8ecff", "#8fa0d8", "#9fb4ff", "#cfd8ff", "#e8ecff", "#ffe9a0"];
  /* pixel-art planet sprites (crisp, drawn at low res then scaled up) */
  function buildBody(rad, pal) {
    const d = Math.ceil(rad * 2), c = document.createElement("canvas");
    c.width = c.height = d;
    const g = c.getContext("2d");
    for (let y = 0; y < d; y++) for (let x = 0; x < d; x++) {
      const dx = x - rad + 0.5, dy = y - rad + 0.5, dist = Math.hypot(dx, dy);
      if (dist > rad - 0.4) continue;
      let col = pal.base;
      if (pal.bands && Math.floor(y / Math.max(2, rad / pal.bands)) % 2 === 1) col = pal.band;
      if (pal.patch && (x * 7 + y * 13 + pal.seed * 5) % 31 === 0 && dist < rad * 0.75) col = pal.patch;
      const t = dist / rad;
      if (t > 0.82) col = pal.shade;
      else if (t > 0.62 && pal.limb) col = pal.limb;
      g.fillStyle = col; g.fillRect(x, y, 1, 1);
    }
    return c;
  }
  function buildSaturn(rad, pal) {
    const rx = Math.ceil(rad * 1.95), size = Math.ceil(rx * 2) + 2;
    const c = document.createElement("canvas"); c.width = c.height = size;
    const g = c.getContext("2d"), cx = size / 2, cy = size / 2;
    const P = (x, y, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
    const ry = rad * 0.5;
    for (let x = -rx; x <= rx; x++) { const t = x / rx, yy = Math.sqrt(Math.max(0, 1 - t * t)) * ry; P(cx + x, cy - yy, pal.ring); }
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const dx = x - cx + 0.5, dy = y - cy + 0.5, dist = Math.hypot(dx, dy);
      if (dist > rad - 0.4) continue;
      let col = pal.base;
      if (Math.floor(y / Math.max(2, rad / 4)) % 2 === 1) col = pal.band;
      if (dist > (rad - 0.4) * 0.82) col = pal.shade;
      P(x, y, col);
    }
    for (let x = -rx; x <= rx; x++) { const t = x / rx, yy = Math.sqrt(Math.max(0, 1 - t * t)) * ry; P(cx + x, cy + yy, pal.ring); P(cx + x, cy + yy - 1, pal.ring2); }
    return c;
  }
  const PLANET_DEFS = [
    { spr: buildSaturn(14, { base: "#c8a06a", band: "#a97e4e", shade: "#6e4d2e", ring: "#d9c08a", ring2: "#8a6f45" }), k: 3.1, fx: 0.10, fy: 0.24, vx: 0.004, z: 0.35, al: 0.9 },
    { spr: buildBody(11, { base: "#3f74d8", patch: "#4fae6a", shade: "#1f3f8c", limb: "#2c55b0", seed: 3 }), k: 2.9, fx: 0.84, fy: 0.66, vx: -0.003, z: 0.55, al: 0.85 },
    { spr: buildBody(7, { base: "#8b93a7", patch: "#6d7488", shade: "#454b5e", seed: 7 }), k: 2.6, fx: 0.60, fy: 0.15, vx: 0.0025, z: 0.7, al: 0.8 },
    { spr: buildBody(5, { base: "#7a63c9", bands: 3, band: "#5a4699", shade: "#332863", seed: 11 }), k: 2.4, fx: 0.92, fy: 0.38, vx: -0.002, z: 0.8, al: 0.75 }
  ];
  if (starsCanvas && !reduced) {
    const ctx = starsCanvas.getContext("2d");
    let W, H, scrollYv = 0, mouseNX = 0, cursorDX = -9999, cursorDY = -9999;
    let layers = [], planets = [], nebulas = [], motes = [], asteroids = [], flares = [];
    const BH = { fx: 0.5, fy: 0.33, rot: 0 };
    let shooter = null, lastShot = 0;
    function sizeSpace() {
      W = starsCanvas.width = Math.floor(window.innerWidth * dpr);
      H = starsCanvas.height = Math.floor(window.innerHeight * dpr);
      ctx.imageSmoothingEnabled = false;
      const area = window.innerWidth * window.innerHeight;
      const mk = (n, sMax, b0) => { const a = []; for (let i = 0; i < n; i++) a.push({
        x: Math.random() * W, y: Math.random() * H,
        s: (Math.random() < 0.75 ? 1 : sMax) * dpr,
        ci: (Math.random() * 8) | 0,
        ph: Math.random() * Math.PI * 2, sp: 0.3 + Math.random() * 1.1,
        dr: (Math.random() - 0.5) * 0.0016, b: b0 * (0.6 + Math.random() * 0.4)
      }); return a; };
      layers = [
        mk(Math.min(150, Math.floor(area / 8000)), 1, 0.5),
        mk(Math.min(80, Math.floor(area / 15000)), 2, 0.72),
        mk(Math.min(42, Math.floor(area / 30000)), 2, 0.95)
      ];
      planets = PLANET_DEFS.map((p) => Object.assign({}, p, { x: p.fx * W, y: p.fy * H }));
      nebulas = [
        { x: W * 0.22, y: H * 0.30, r: Math.max(220, W * 0.34), ni: 0, fx: 0.000041, fy: 0.000033, ax: 60 * dpr, ay: 40 * dpr },
        { x: W * 0.78, y: H * 0.68, r: Math.max(260, W * 0.40), ni: 1, fx: 0.000033, fy: 0.000045, ax: 70 * dpr, ay: 46 * dpr },
        { x: W * 0.55, y: H * 0.16, r: Math.max(180, W * 0.26), ni: 2, fx: 0.000052, fy: 0.000027, ax: 50 * dpr, ay: 34 * dpr },
        { x: W * 0.40, y: H * 0.78, r: Math.max(200, W * 0.30), ni: 3, fx: 0.000037, fy: 0.000041, ax: 64 * dpr, ay: 42 * dpr }
      ];
      const mn = clamp(Math.floor(area / 42000), 18, 44);
      motes = [];
      for (let i = 0; i < mn; i++) motes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12 * dpr, vy: (Math.random() - 0.5) * 0.12 * dpr,
        yel: Math.random() < 0.28, tw: Math.random() * Math.PI * 2
      });
            /* drifting flat asteroids (black-hole reference style) */
      const ROCKS = ["#8b93a7", "#7d8598", "#99a1b5", "#6f7789"];
      const an = clamp(Math.floor(area / 30000), 8, 15);
      asteroids = [];
      for (let i = 0; i < an; i++) {
        const npts = 9 + ((Math.random() * 4) | 0), pts = [];
        for (let k = 0; k < npts; k++) pts.push(0.6 + Math.random() * 0.4);
        const craters = [], nc = 1 + ((Math.random() * 3) | 0);
        for (let k = 0; k < nc; k++) craters.push({ a: Math.random() * 6.283, d: Math.random() * 0.5, r: 0.14 + Math.random() * 0.2 });
        asteroids.push({
          x: Math.random() * W, y: Math.random() * H,
          r: (7 + Math.random() * 24) * dpr,
          pts, craters, ri: (Math.random() * 4) | 0,
          rot: Math.random() * 6.283, rs: (Math.random() - 0.5) * 0.0013,
          vx: (0.05 + Math.random() * 0.13) * dpr * (Math.random() < 0.5 ? -1 : 1),
          z: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.283,
          pink: Math.random() < 0.25
        });
      }
      /* pulsing flare stars */
      flares = [];
      for (let i = 0; i < 6; i++) flares.push({ x: Math.random() * W, y: Math.random() * H * 0.8, s: (5 + Math.random() * 6) * dpr, ph: Math.random() * 6.283, yel: i % 2 === 0 });
    }
    sizeSpace();
    window.addEventListener("resize", sizeSpace);
    window.addEventListener("scroll", () => { scrollYv = window.scrollY; }, { passive: true });
    window.addEventListener("pointermove", (e) => {
      mouseNX = e.clientX / window.innerWidth - 0.5;
      cursorDX = e.clientX * dpr; cursorDY = e.clientY * dpr;
    }, { passive: true });

    function drawNebulas(t) {
      for (const n of nebulas) {
        const nx = n.x + Math.sin(t * n.fx) * n.ax;
        const ny = n.y + Math.cos(t * n.fy) * n.ay;
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
        g.addColorStop(0, TP().nebs[n.ni]); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(nx - n.r, ny - n.r, n.r * 2, n.r * 2);
      }
    }
    function drawLayer(arr, depth, t) {
      const oy = (scrollYv * 0.05 * depth) % (H + 40);
      const ox = mouseNX * 34 * depth;
      for (let i = 0; i < arr.length; i++) {
        const s = arr[i];
        const tw = 0.42 + 0.58 * Math.abs(Math.sin(t * 0.001 * s.sp + s.ph));
        const yy = (s.y - oy + H * 3) % H;
        const xx = (s.x + t * s.dr + ox + W * 2) % W;
        ctx.globalAlpha = tw * s.b * (0.3 + depth * 0.6);
        ctx.fillStyle = TP().stars[s.ci];
        ctx.fillRect(xx, yy, s.s, s.s);
      }
      ctx.globalAlpha = 1;
    }
    function drawPlanets(t) {
      for (const p of planets) {
        p.x += p.vx * dpr;
        if (p.x < -170 * dpr) p.x = W + 160 * dpr;
        else if (p.x > W + 170 * dpr) p.x = -160 * dpr;
        const ox = mouseNX * 18 * dpr * (1.1 - p.z * 0.5);
        const oy = Math.sin(t * 0.00005 + p.fx * 9) * 7 * dpr;
        const size = p.spr.width * p.k;
        ctx.globalAlpha = p.al;
        ctx.drawImage(p.spr, p.x + ox - size / 2, p.y + oy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }
    function drawShooter(t) {
      const P = TP();
      if (!shooter && t - lastShot > 4200 + Math.random() * 5500) {
        shooter = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.4, vx: (4.5 + Math.random() * 3) * dpr, vy: (1.6 + Math.random() * 1.6) * dpr, life: 1 };
        lastShot = t;
      }
      if (shooter) {
        shooter.life -= 0.011;
        if (shooter.life <= 0) shooter = null;
        else {
          const g = ctx.createLinearGradient(shooter.x - shooter.vx * 16, shooter.y - shooter.vy * 16, shooter.x, shooter.y);
          g.addColorStop(0, P.shoot0);
          g.addColorStop(1, P.shoot1 + (0.8 * shooter.life) + ")");
          ctx.strokeStyle = g; ctx.lineWidth = 1.4 * dpr;
          ctx.beginPath();
          ctx.moveTo(shooter.x - shooter.vx * 16, shooter.y - shooter.vy * 16);
          ctx.lineTo(shooter.x, shooter.y);
          ctx.stroke();
          const hg = ctx.createRadialGradient(shooter.x, shooter.y, 0, shooter.x, shooter.y, 12 * dpr);
          hg.addColorStop(0, P.head); hg.addColorStop(1, P.shoot0);
          ctx.globalAlpha = shooter.life; ctx.fillStyle = hg;
          ctx.beginPath(); ctx.arc(shooter.x, shooter.y, 12 * dpr, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
          shooter.x += shooter.vx; shooter.y += shooter.vy;
        }
      }
    }
    function drawFlares(t) {
      const P = TP();
      for (const f of flares) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.0006 + f.ph);
        const a = 0.2 + 0.65 * tw;
        const col = (f.yel ? P.flareY : P.flare) + (a * 0.9).toFixed(3) + ")";
        ctx.fillStyle = col;
        ctx.fillRect(f.x - f.s / 2, f.y - 0.6 * dpr, f.s, 1.2 * dpr);
        ctx.fillRect(f.x - 0.6 * dpr, f.y - f.s / 2, 1.2 * dpr, f.s);
        ctx.globalAlpha = a * 0.5;
        ctx.fillRect(f.x - 1.5 * dpr, f.y - 1.5 * dpr, 3 * dpr, 3 * dpr);
        ctx.globalAlpha = 1;
      }
    }
    function drawMotes(t) {
      const R = 130 * dpr;
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.x < 0) m.x += W; else if (m.x > W) m.x -= W;
        if (m.y < 0) m.y += H; else if (m.y > H) m.y -= H;
        const dx = m.x - cursorDX, dy = m.y - cursorDY;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (1 - d / R) * 0.55;
          m.x += (dx / d) * f; m.y += (dy / d) * f;
        }
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.0012 + m.tw));
        ctx.globalAlpha = tw * 0.75;
        ctx.fillStyle = m.yel ? TP().moteY : TP().moteB;
        const s = (m.yel ? 2 : 1.5) * dpr;
        ctx.fillRect(m.x, m.y, s, s);
        if (m.yel) { ctx.globalAlpha = tw * 0.16; ctx.fillRect(m.x - 2 * dpr, m.y - 2 * dpr, s + 4 * dpr, s + 4 * dpr); }
      }
      ctx.globalAlpha = 1;
    }
    function drawAsteroids(t) {
      for (const a of asteroids) {
        a.x += a.vx; a.rot += a.rs;
        if (a.x < -80 * dpr) a.x = W + 80 * dpr;
        else if (a.x > W + 80 * dpr) a.x = -80 * dpr;
        const ox = mouseNX * 24 * a.z * dpr;
        const oy = Math.sin(t * 0.00006 + a.ph) * 9 * dpr + scrollYv * 0.018 * a.z;
        const span = H + 140 * dpr;
        const yy = (((a.y + oy) % span) + span) % span - 70 * dpr;
        const xx = a.x + ox;
        if (xx < -90 * dpr || xx > W + 90 * dpr) continue;
        const n = a.pts.length;
        const PX = (i) => Math.cos((i / n) * 6.283) * a.pts[i] * a.r;
        const PY = (i) => Math.sin((i / n) * 6.283) * a.pts[i] * a.r;
        ctx.save();
        ctx.translate(xx, yy);
        ctx.rotate(a.rot);
        ctx.globalAlpha = 0.45 + a.z * 0.45;
        ctx.beginPath();
        ctx.moveTo((PX(0) + PX(1)) / 2, (PY(0) + PY(1)) / 2);
        for (let k = 1; k <= n; k++) {
          const i = k % n, j = (i + 1) % n;
          ctx.quadraticCurveTo(PX(i), PY(i), (PX(i) + PX(j)) / 2, (PY(i) + PY(j)) / 2);
        }
        ctx.closePath();
        ctx.fillStyle = TP().rocks[a.ri];
        ctx.fill();
        ctx.fillStyle = TP().crater;
        for (const c of a.craters) {
          ctx.beginPath();
          ctx.arc(Math.cos(c.a) * c.d * a.r, Math.sin(c.a) * c.d * a.r, c.r * a.r, 0, 6.283);
          ctx.fill();
        }
        if (a.pink) {
          ctx.fillStyle = TP().pink;
          ctx.beginPath(); ctx.arc(a.r * 0.32, -a.r * 0.28, a.r * 0.15, 0, 6.283); ctx.fill();
        }
        ctx.strokeStyle = TP().rockRim;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath(); ctx.arc(0, 0, a.r * 0.9, -2.5, -0.7); ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    function drawBlackHole(t) {
      const L = themeAttr() === "light";
      const R = Math.min(W, H) * 0.085;
      const cx = W * BH.fx + Math.sin(t * 0.00003) * 14 * dpr;
      const cy = H * BH.fy + Math.cos(t * 0.000024) * 10 * dpr;
      const tilt = -0.3;
      BH.rot += 0.0016;
      ctx.save();
      ctx.translate(cx, cy);
      let g = ctx.createRadialGradient(0, 0, R * 0.4, 0, 0, R * 3.6);
      g.addColorStop(0, L ? "rgba(255,196,96,0.16)" : "rgba(255,214,140,0.09)");
      g.addColorStop(0.55, L ? "rgba(205,160,80,0.08)" : "rgba(120,110,210,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(-R * 3.8, -R * 3.8, R * 7.6, R * 7.6);
      const RINGS = L ? [
        { r: 2.5, w: 0.5, c: "rgba(255,178,84,0.32)" },
        { r: 2.15, w: 0.44, c: "rgba(255,204,124,0.42)" },
        { r: 1.8, w: 0.52, c: "rgba(255,158,52,0.6)" },
        { r: 1.48, w: 0.56, c: "rgba(255,233,174,0.85)" },
        { r: 1.24, w: 0.36, c: "rgba(255,250,236,0.95)" }
      ] : [
        { r: 2.5, w: 0.5, c: "rgba(255,150,190,0.22)" },
        { r: 2.15, w: 0.44, c: "rgba(159,224,176,0.26)" },
        { r: 1.8, w: 0.52, c: "rgba(255,222,120,0.5)" },
        { r: 1.48, w: 0.56, c: "rgba(255,244,214,0.75)" },
        { r: 1.24, w: 0.36, c: "rgba(255,252,240,0.9)" }
      ];
      function diskHalf(a0, a1, front) {
        for (const d of RINGS) {
          ctx.beginPath();
          ctx.ellipse(0, 0, d.r * R, d.r * R * 0.34, tilt, a0, a1);
          ctx.strokeStyle = d.c;
          ctx.lineWidth = d.w * R * (front ? 1 : 0.65);
          ctx.globalAlpha = front ? 0.95 : 0.5;
          ctx.stroke();
        }
        for (let i = 0; i < 26; i++) {
          const rr = 1.3 + (i / 26) * 1.25;
          const th = BH.rot * (1.7 - rr * 0.3) + i * 2.39996;
          if ((Math.sin(th) > 0) !== front) continue;
          ctx.globalAlpha = front ? 0.85 : 0.3;
          ctx.fillStyle = L ? (front ? "rgba(255,190,92,0.9)" : "rgba(222,172,120,0.4)") : (front ? "rgba(255,240,190,0.9)" : "rgba(255,220,240,0.35)");
          ctx.beginPath();
          ctx.arc(Math.cos(th) * rr * R, Math.sin(th) * rr * R * 0.34, (0.5 + (i % 3) * 0.35) * dpr, 0, 6.283);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      diskHalf(Math.PI, Math.PI * 2, false);
      g = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R);
      if (L) { g.addColorStop(0, "#fffef8"); g.addColorStop(0.82, "#fff3d2"); g.addColorStop(1, "#ffe3a4"); }
      else { g.addColorStop(0, "#000000"); g.addColorStop(0.82, "#020308"); g.addColorStop(1, "#0a0f22"); }
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283); ctx.fill();
      ctx.strokeStyle = L ? "rgba(255,186,84,0.7)" : "rgba(120,160,255,0.45)";
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath(); ctx.arc(0, 0, R * 1.004, 0, 6.283); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -R * 0.14, R * 1.05, R * 0.3, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = L ? "rgba(255,255,255,0.95)" : "rgba(255,236,170,0.85)";
      ctx.lineWidth = 2 * dpr;
      ctx.shadowColor = L ? "rgba(255,198,100,0.9)" : "rgba(255,220,120,0.8)";
      ctx.shadowBlur = 12 * dpr;
      ctx.stroke();
      ctx.shadowBlur = 0;
      diskHalf(0, Math.PI, true);
      ctx.restore();
    }
    (function frame(t) {
      t = t || 0;
      if (!document.hidden) {
        /* base image: ultra-slow drift + breath + scroll parallax */
        if (bgImg) {
          const iw = window.innerWidth, ih = window.innerHeight;
          const panX = Math.sin(t * 0.00004) * iw * 0.013;
          const panY = Math.cos(t * 0.000031) * ih * 0.011;
          const sc = 1.07 + Math.sin(t * 0.000052) * 0.014;
          bgImg.style.transform = "scale(" + sc + ") translate(" + panX + "px," + (scrollYv * 0.04 + panY) + "px)";
        }
        ctx.clearRect(0, 0, W, H);
        drawNebulas(t);
        drawLayer(layers[0], 0.35, t);
        drawBlackHole(t);
        drawAsteroids(t);
        drawPlanets(t);
        drawLayer(layers[1], 0.6, t);
        drawLayer(layers[2], 0.9, t);
        drawFlares(t);
        drawShooter(t);
        drawMotes(t);
      }
      requestAnimationFrame(frame);
    })();
  } else if (starsCanvas) {
    /* static single frame for reduced motion */
    const ctx = starsCanvas.getContext("2d");
    const W2 = starsCanvas.width = Math.floor(window.innerWidth * dpr);
    const H2 = starsCanvas.height = Math.floor(window.innerHeight * dpr);
    ctx.imageSmoothingEnabled = false;
    const nebs = [
      { x: W2 * 0.22, y: H2 * 0.30, r: W2 * 0.34, c: PAL[themeAttr()].nebs[0] },
      { x: W2 * 0.78, y: H2 * 0.68, r: W2 * 0.40, c: PAL[themeAttr()].nebs[1] },
      { x: W2 * 0.55, y: H2 * 0.16, r: W2 * 0.26, c: PAL[themeAttr()].nebs[2] },
      { x: W2 * 0.40, y: H2 * 0.78, r: W2 * 0.30, c: PAL[themeAttr()].nebs[3] }
    ];
    for (const n of nebs) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.c); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
    }
    for (let i = 0; i < 220; i++) {
      ctx.globalAlpha = 0.2 + Math.random() * 0.55;
      ctx.fillStyle = Math.random() < 0.9 ? PAL[themeAttr()].stars[(Math.random() * 8) | 0] : PAL[themeAttr()].moteY;
      const s = (Math.random() < 0.85 ? 1 : 2) * dpr;
      ctx.fillRect(Math.random() * W2, Math.random() * H2, s, s);
    }
    ctx.globalAlpha = 1;
    for (const p of PLANET_DEFS) {
      const size = p.spr.width * p.k;
      ctx.globalAlpha = p.al;
      ctx.drawImage(p.spr, p.fx * W2 - size / 2, p.fy * H2 - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- HERO NETWORK CANVAS ---------------- */
  const net = $("#net");
  if (net && !reduced && !touch) {
    const ctx = net.getContext("2d");
    const hero = $("#home");
    let W, H, nodes = [], visible = false, mx = -9999, my = -9999;
    function sizeNet() {
      const r = hero.getBoundingClientRect();
      W = net.width = Math.floor(r.width * dpr);
      H = net.height = Math.floor(r.height * dpr);
      const n = window.innerWidth < 760 ? 26 : 46;
      nodes = [];
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35 * dpr, vy: (Math.random() - 0.5) * 0.35 * dpr,
          yel: Math.random() < 0.18
        });
      }
    }
    sizeNet();
    window.addEventListener("resize", sizeNet);
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) * dpr; my = (e.clientY - r.top) * dpr;
    }, { passive: true });
    hero.addEventListener("pointerleave", () => { mx = my = -9999; });
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(hero);

    (function netLoop() {
      if (visible && !document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (const p of nodes) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < 130 * dpr && d > 0.01) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
        }
        const maxD = 150 * dpr;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
            if (d < maxD) {
              ctx.strokeStyle = TP().netLine + (0.16 * (1 - d / maxD)) + ")";
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        for (const p of nodes) {
          ctx.fillStyle = p.yel ? TP().netY : TP().netB;
          ctx.fillRect(p.x - 1, p.y - 1, p.yel ? 3 : 2, p.yel ? 3 : 2);
        }
      }
      requestAnimationFrame(netLoop);
    })();
  }

  /* ---------------- MAGNETIC BUTTONS ---------------- */
  if (!reduced && !touch) {
    $$(".btn.magnet").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transition = "none";
        btn.style.transform = "translate(" + dx * 0.18 + "px," + dy * 0.22 + "px)";
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transition = "transform .5s cubic-bezier(.22,.9,.28,1)";
        btn.style.transform = "translate(0,0)";
      });
    });
  }

  /* ---------------- 3D TILT ---------------- */
  if (!reduced && !touch) {
    $$(".tilt").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = "transform .08s linear";
        el.style.transform = "perspective(900px) rotateX(" + (-py * 7) + "deg) rotateY(" + (px * 9) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .6s cubic-bezier(.22,.9,.28,1)";
        el.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      });
    });
  }

  /* ---------------- TERMINAL TYPING ---------------- */
  const term = $("#term");
  if (term) {
    const LINES = [
      { p: "athar@dhaka:~$ ", t: "whoami" },
      { p: "", t: "> curious · independent · building", c: true },
      { p: "athar@dhaka:~$ ", t: "stack --list" },
      { p: "", t: "> ai / web / marketing / writing / coffee", c: true },
      { p: "athar@dhaka:~$ ", t: "goal --year 2036" },
      { p: "", t: "> build something of my own_", c: true }
    ];
    function renderStatic() {
      term.innerHTML = LINES.map((l) =>
        (l.p ? '<span class="p">' + l.p + "</span>" : "") +
        '<span class="' + (l.c ? "c" : "") + '">' + l.t + "</span>\n").join("") + '<span class="cursor-b"></span>';
    }
    if (reduced) { renderStatic(); }
    else {
      let visible = false;
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(term);
      let li = 0, ci = 0, started = false;
      function typeLoop() {
        if (!visible) { requestAnimationFrame(typeLoop); return; }
        if (!started) { started = true; term.innerHTML = ""; }
        if (li >= LINES.length) {
          const cur = document.createElement("span"); cur.className = "cursor-b";
          const last = term.lastElementChild;
          if (last && !last.classList.contains("cursor-b")) term.appendChild(cur);
          setTimeout(() => { started = false; li = 0; ci = 0; term.innerHTML = ""; }, 4200);
          requestAnimationFrame(typeLoop);
          return;
        }
        const line = LINES[li];
        if (ci === 0) {
          const row = document.createElement("div");
          if (line.p) { const ps = document.createElement("span"); ps.className = "p"; ps.textContent = line.p; row.appendChild(ps); }
          const ts = document.createElement("span"); if (line.c) ts.className = "c";
          row.appendChild(ts); term.appendChild(row);
          line._target = ts;
        }
        line._target.textContent = line.t.slice(0, ++ci);
        if (ci >= line.t.length) { li++; ci = 0; setTimeout(typeLoop, 260); return; }
        setTimeout(typeLoop, 34);
      }
      requestAnimationFrame(typeLoop);
    }
  }

  /* ---------------- MODAL ---------------- */
  const modal = $("#modal");
  const modalBox = $("#modalBox");
  let lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    modalBox.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const c = $(".modal-close", modalBox);
    if (c) c.focus();
  }
  function closeModal() {
    if (!modal.classList.contains("open")) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("click", (e) => {
    const c = e.target.closest(".modal-close");
    if (c) closeModal();
  });
  window.closeModal = closeModal;

  /* certificate modals */
  $$(".js-cert").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const d = el.dataset;
      let html =
        '<div class="modal-head"><span class="t">' + (d.kind || "CERTIFICATE") + "</span>" +
        '<button class="modal-close" aria-label="Close">✕</button></div>';
      if (d.img) {
        if (/\.pdf$/i.test(d.img)) html += '<div class="modal-pdf"><iframe src="' + d.img + '" title="' + d.title + ' — PDF preview"></iframe></div>';
        else html += '<div class="modal-img"><img src="' + d.img + '" alt="' + d.title + ' certificate" loading="lazy"></div>';
      }
      html += '<div class="modal-body">';
      html += '<div class="modal-meta">';
      if (d.issuer) html += '<div class="m"><div class="k">Issuer</div><div class="v">' + d.issuer + "</div></div>";
      if (d.date)   html += '<div class="m"><div class="k">Date</div><div class="v">' + d.date + "</div></div>";
      if (d.ref)    html += '<div class="m"><div class="k">Reference</div><div class="v">' + d.ref + "</div></div>";
      if (d.type)   html += '<div class="m"><div class="k">Type</div><div class="v">' + d.type + "</div></div>";
      html += "</div>";
      if (d.desc) html += '<p class="modal-desc">' + d.desc + "</p>";
      html += '<div class="modal-actions">';
      if (d.img) html += '<a class="btn magnet" href="' + d.img + '" target="_blank" rel="noopener"><span>' + (/\.pdf$/i.test(d.img) ? "Open Full PDF ↗" : "Open Full Image ↗") + '</span></a>';
      if (d.verify) html += '<a class="btn btn-primary magnet" href="' + d.verify + '" target="_blank" rel="noopener"><span>Verify Certificate ↗</span></a>';
      if (d.download) html += '<a class="btn" href="' + d.download + '" download><span>Download</span></a>';
      html += "</div></div>";
      openModal(html);
    });
  });

  /* shared: parse "Label|URL, Label|URL" into modal action buttons */
  const linkBtns = (s) => s.split(",").map((pair) => {
    const i = pair.indexOf("|");
    if (i < 0) return "";
    const t = pair.slice(0, i).trim(), u = pair.slice(i + 1).trim();
    const ext = /^https?:/.test(u);
    return '<a class="btn ' + (ext ? "btn-primary" : "") + '" href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + "><span>" + t + (ext ? " ↗" : "") + "</span></a>";
  }).join("");

  /* generic info boxes (personality, interests, games, skills, experience, volunteering, ECA, achievements) */
  $$(".js-info").forEach((el) => {
    const open = (e) => {
      e.preventDefault();
      const d = el.dataset;
      let html = '<div class="modal-head"><span class="t">' + (d.sub || "INFO") + "</span>" +
        '<button class="modal-close" aria-label="Close">✕</button></div>' +
        '<div class="modal-body"><h3 style="font-size:24px;margin-bottom:16px">' + (d.title || "") + "</h3>";
      (d.body || "").split(" // ").forEach((p) => { if (p.trim()) html += "<p class='modal-desc'>" + p + "</p>"; });
      if (d.links) html += '<div class="modal-actions">' + linkBtns(d.links) + "</div>";
      html += "</div>";
      openModal(html);
    };
    el.addEventListener("click", open);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } });
  });

  /* project modals */
  $$(".js-proj").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const d = el.dataset;
      const row = (k, v, strong) => '<div class="pf"><div class="k">' + k + '</div><div class="v">' + (strong ? "<b>" : "") + v + (strong ? "</b>" : "") + "</div></div>";
      let html =
        '<div class="modal-head"><span class="t">' + (d.pcat || "PROJECT") + " · " + (d.pdemo ? "DEMO PROJECT" : "PROJECT") + "</span>" +
        '<button class="modal-close" aria-label="Close">✕</button></div>' +
        '<div class="modal-body">' +
        (d.pdemo ? '<p class="modal-desc"><span class="badge-demo">DEMO PROJECT</span> &nbsp;A concept example showing how I think and document work — not a shipped product.</p>' : "") +
        "<h3 style='font-size:24px;margin-bottom:18px'>" + d.ptitle + "</h3>" +
        '<div class="proj-fields">' +
        row("Problem", d.prob) + row("Idea", d.idea) + row("Tools", d.tools, true) +
        row("Process", d.proc) + row("Result", d.res) + row("Status", d.stat, true) +
        "</div>" +
        (d.pwhat ? "<h4 style='font-size:11px;letter-spacing:.3em;color:var(--yellow);margin:20px 0 8px'>WHAT IS THIS?</h4><p class='modal-desc'>" + d.pwhat + "</p>" : "") +
        (d.pext ? '<div class="modal-actions">' + linkBtns(d.pext) + "</div>" : "") +
        "</div>";
      openModal(html);
    });
  });

  /* ---------------- DIRECTION NODES ---------------- */
  const dirNodes = $$(".dir-node");
  const dirPanel = $("#dirPanel p");
  const dirWho = $("#dirPanel .who");
  if (dirNodes.length && dirPanel) {
    function setDir(node) {
      dirNodes.forEach((n) => n.classList.toggle("active", n === node));
      dirPanel.style.opacity = 0;
      setTimeout(() => {
        dirWho.textContent = node.dataset.name;
        dirPanel.innerHTML = node.dataset.desc;
        dirPanel.style.opacity = 1;
      }, 180);
    }
    dirNodes.forEach((n) => n.addEventListener("click", () => setDir(n)));
    if (dirNodes[0]) { dirNodes[0].classList.add("active"); }
  }

  /* ---------------- COFFEE FACTS ---------------- */
  const coffeeBtn = $("#coffeeBtn");
  if (coffeeBtn) {
    const FACTS = [
      "I learned espresso basics, milk texturing and bean profiling in the Professional Barista Course at Awake Coffee Academy.",
      "Coffee is where technology meets patience — the same discipline I apply to building things.",
      "Best pairings for my life: a fresh brew, a new idea, and a screen that compiles on the first try.",
      "If I had to pick a third place between home and wherever I build my future — it's a café with good wifi."
    ];
    const fEl = $("#coffeeFact"), nEl = $("#coffeeNo");
    let fi = 0;
    const next = () => {
      fEl.style.opacity = 0;
      setTimeout(() => {
        fi = (fi + 1) % FACTS.length;
        fEl.textContent = FACTS[fi];
        nEl.textContent = "NOTE 0" + (fi + 1) + " / 0" + FACTS.length;
        fEl.style.opacity = 1;
      }, 180);
    };
    coffeeBtn.addEventListener("click", next);
    coffeeBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
    });
  }

  /* ---------------- WORLD MAP (remove SMIL for reduced) ---------------- */
  if (reduced) { $$(".wm-pulse, animateMotion").forEach((n) => n.remove()); }

  /* ---------------- 3D PORTRAIT — DRAG / SWIPE TO ROTATE ---------------- */
  const p3d = $("#p3d");
  if (p3d) {
    const pInner = $(".p3d-inner", p3d);
    const pDots = $$(".p3d-dots i", document);
    let pAng = 0, pTilt = 0, pVel = 0, pDrag = false, pLastX = 0, pFace = 0, pFlip = false;
    function pFaceOf(a) { const n = ((a % 360) + 360) % 360; return (n >= 90 && n < 270) ? 1 : 0; }
    function pApply() {
      pInner.style.transform = "rotateX(" + pTilt.toFixed(2) + "deg) rotateY(" + pAng.toFixed(2) + "deg)";
      const f = pFaceOf(pAng);
      if (f !== pFace) {
        pFace = f;
        if (pDots[0]) pDots[0].classList.toggle("on", f === 0);
        if (pDots[1]) pDots[1].classList.toggle("on", f === 1);
      }
    }
    p3d.addEventListener("pointerdown", (e) => {
      if (e.button > 0) return;
      pDrag = true; pVel = 0; pLastX = e.clientX;
      p3d.classList.add("grab");
      try { p3d.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });
    p3d.addEventListener("pointermove", (e) => {
      if (!pDrag) return;
      const dx = e.clientX - pLastX;
      pLastX = e.clientX;
      pAng += dx * 0.5;
      pTilt = clamp(pTilt - dx * 0.05, -12, 12);
      pVel = dx * 0.5;
      pApply();
    });
    const pUp = () => { if (pDrag) { pDrag = false; p3d.classList.remove("grab"); } };
    p3d.addEventListener("pointerup", pUp);
    p3d.addEventListener("pointercancel", pUp);
    p3d.addEventListener("dblclick", () => { pFlip = true; });
    const pSpin = reduced ? 0.05 : 0.15; /* permanent auto-rotation — slow on reduced-motion, so BOTH photos stay visible */
    (function pLoop() {
      if (!document.hidden && !pDrag) {
        if (pFlip) { pFlip = false; pVel = 24; }
        pAng += pVel + pSpin;
        pVel *= 0.93;
        if (Math.abs(pVel) < 0.05) pVel = 0;
        pTilt *= 0.9;
        pApply();
      }
      requestAnimationFrame(pLoop);
    })();
    pApply();
  }

  /* ---------------- BLACK HOLE NAV — ROTATE TO NAVIGATE ---------------- */
  const holeNav = $("#holeNav");
  if (holeNav) {
    const hRing = $(".hole-ring", holeNav);
    const hTicks = $$(".hole-ticks i", holeNav);
    const H_SECTIONS = ["home", "about", "direction", "journey", "work", "life", "contact"];
    const H_N = H_SECTIONS.length, H_STEP = 360 / H_N;
    let hRot = 0, hStep = -1, hDrag = false, hLastA = 0, hDownT = 0, hStartRot = 0;
    function hSetStep(s) {
      s = ((s % H_N) + H_N) % H_N;
      if (s === hStep) return;
      hStep = s;
      hTicks.forEach((tk, i) => tk.classList.toggle("on", i === s));
      holeNav.setAttribute("aria-valuenow", String(s));
    }
    function hApply(rot) {
      hRot = rot;
      hRing.style.transform = "rotate(" + rot + "deg)";
      hSetStep(Math.round(rot / H_STEP));
    }
    function hGo(idx) {
      const id = H_SECTIONS[((idx % H_N) + H_N) % H_N];
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      holeNav.classList.remove("pulse");
      void holeNav.offsetWidth;
      holeNav.classList.add("pulse");
    }
    function hSpin(dir) {
      hRot += dir * H_STEP;
      hRing.style.transition = "transform .5s var(--ease)";
      hApply(hRot);
      setTimeout(() => { hRing.style.transition = ""; }, 520);
      hGo(Math.round(hRot / H_STEP));
    }
    hSetStep(0);
    function hAngle(e) {
      const r = holeNav.getBoundingClientRect();
      return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
    }
    holeNav.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      hDrag = true;
      hLastA = hAngle(e);
      hDownT = performance.now();
      hStartRot = hRot;
      holeNav.classList.add("grab");
      try { holeNav.setPointerCapture(e.pointerId); } catch (err) {}
    });
    holeNav.addEventListener("pointermove", (e) => {
      if (!hDrag) return;
      const a = hAngle(e);
      let d = a - hLastA;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      hLastA = a;
      hApply(hRot + d);
    });
    const hUp = () => {
      if (!hDrag) return;
      hDrag = false;
      holeNav.classList.remove("grab");
      const isTap = performance.now() - hDownT < 280 && Math.abs(hRot - hStartRot) < 5;
      if (isTap) { hSpin(1); return; }
      const target = Math.round(hRot / H_STEP) * H_STEP;
      hRing.style.transition = "transform .45s var(--ease)";
      hApply(target);
      setTimeout(() => { hRing.style.transition = ""; }, 480);
      hGo(hStep);
    };
    holeNav.addEventListener("pointerup", hUp);
    holeNav.addEventListener("pointercancel", hUp);
    holeNav.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); hSpin(1); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); hSpin(-1); }
      else if (e.key === "Home") { e.preventDefault(); hGo(0); }
    });
    /* keep the active tick synced while scrolling normally */
    if ("IntersectionObserver" in window) {
      const hObs = new IntersectionObserver((entries) => {
        for (const en of entries) if (en.isIntersecting) hSetStep(H_SECTIONS.indexOf(en.target.id));
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      H_SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) hObs.observe(el); });
    }
  }

  /* ---------------- SECRET: TYPE "EAST" ---------------- */
  let eggBuf = "";
  document.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;
    eggBuf = (eggBuf + e.key.toLowerCase()).slice(-4);
    if (eggBuf === "east") {
      eggBuf = "";
      const el = document.createElement("div");
      el.className = "egg-toast";
      el.setAttribute("role", "status");
      el.textContent = "✦ You found the road East. That's the point.";
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add("show"));
      setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 700); }, 3400);
    }
  });

  /* ---------------- YEAR ---------------- */
  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- BOOT SEQUENCE — “Athar” signature + loading bar ---------------- */
  (function boot() {
    const el = $("#boot");
    if (!el) return;
    const fill = document.getElementById("bootFill");
    const pct = document.getElementById("bootPct");
    const stat = document.getElementById("bootStat");
    let ended = false;
    document.body.classList.add("is-loading");
    function setBar(v) {
      v = Math.min(100, Math.max(0, v));
      if (fill) fill.style.width = v + "%";
      if (pct) pct.textContent = Math.floor(v) + "%";
    }
    function done() {
      if (ended) return;
      ended = true;
      setBar(100);
      if (stat) stat.textContent = "UNIVERSE ONLINE";
      el.classList.add("signed", "done");
      document.body.classList.remove("is-loading");
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 750);
    }
    if (reduced) { setBar(100); setTimeout(done, 400); return; }
    const t1 = $("#bootType1"), t2 = $("#bootType2");
    const s1 = t1 ? (t1.getAttribute("data-text") || "whoami") : "whoami";
    const TOTAL = s1.length + 5;
    let i1 = 0, i2 = 0;
    (function type1() {
      if (ended) return;
      if (i1 <= s1.length) {
        if (t1) t1.textContent = s1.slice(0, i1);
        setBar((i1 / TOTAL) * 100);
        i1++;
        setTimeout(type1, 70);
      } else setTimeout(type2, 240);
    })();
    function type2() {
      if (ended) return;
      if (i2 <= 5) {
        if (t2) t2.textContent = "Athar".slice(0, i2);
        setBar(((s1.length + i2) / TOTAL) * 100);
        i2++;
        setTimeout(type2, 135);
      } else setTimeout(done, 700);
    }
    setTimeout(done, 5200); /* failsafe */
  })();
})();
