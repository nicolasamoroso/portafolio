/**
 * Portfolio runtime. The interaction layer (drag carousels, autoplay, reveals,
 * menu, portrait tilt, cursor) is adapted from the reference implementation so
 * the motion matches it; the language toggle, case selector and code rain are
 * this site's own.
 */
(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Language toggle ─────────────────────────────────────────────────── */

  const root = document.documentElement;
  const LANGS = ["es", "en"];

  function applyLanguage(lang) {
    if (!LANGS.includes(lang)) return;
    root.lang = lang;
    root.dataset.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {}

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = node.dataset[lang];
      if (value !== undefined) node.innerHTML = value;
    });
    const title = document.querySelector("[data-i18n-title]");
    if (title) document.title = title.dataset[lang];
    const description = document.querySelector("[data-i18n-meta]");
    if (description) description.setAttribute("content", description.dataset[lang]);

    document.querySelectorAll("[data-i18n-label]").forEach((node) => {
      const value = node.dataset[lang === "es" ? "labelEs" : "labelEn"];
      if (value !== undefined) node.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-lang-set]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.langSet === lang));
    });
  }

  document.querySelectorAll("[data-lang-set]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.langSet));
  });

  let stored = null;
  try {
    stored = localStorage.getItem("lang");
  } catch {}
  applyLanguage(LANGS.includes(stored) ? stored : "es");

  /* ── Theme: dark / light / system ────────────────────────────────────── */

  const THEMES = ["light", "mixed", "dark"];

  function applyTheme(choice) {
    if (!THEMES.includes(choice)) return;
    root.dataset.theme = choice;
    try {
      localStorage.setItem("theme", choice);
    } catch {}
    document.querySelectorAll("[data-theme-set]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeSet === choice));
    });
  }

  document.querySelectorAll("[data-theme-set]").forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeSet));
  });

  let storedTheme = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch {}
  applyTheme(THEMES.includes(storedTheme) ? storedTheme : "mixed");

  /* ── Lightbox ────────────────────────────────────────────────────────── */

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");

  // Delegated rather than bound per button: the carousels capture the pointer
  // while dragging, which retargets the native click to the track.
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");
    if (!trigger) return;
    const image = trigger.querySelector("img");
    lightboxImage.src = trigger.dataset.lightbox;
    lightboxImage.alt = image ? image.alt : "";
    lightbox.showModal();
  });

  document.querySelector("#lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  document.querySelectorAll("img").forEach((media) => {
    media.draggable = false;
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target.closest("img")) event.preventDefault();
  });

  /* ── Case selector ───────────────────────────────────────────────────── */

  const caseSelector = document.querySelector("#case-selector");
  const casePanels = document.querySelector("#case-panels");
  if (caseSelector && casePanels) {
    const buttons = [...caseSelector.querySelectorAll("button")];
    const panels = [...casePanels.querySelectorAll(".campaign-case")];
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        buttons.forEach((item, i) => item.setAttribute("aria-pressed", String(i === index)));
        panels.forEach((panel, i) => {
          panel.hidden = i !== index;
        });
      });
    });
  }

  /* ── Drag-to-scroll carousels ────────────────────────────────────────── */

  const enableDragScroll = (track) => {
    let startX = 0;
    let initialScroll = 0;
    let isDragging = false;
    let didDrag = false;

    track.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      // Touch is left to the browser: it already scrolls an overflow-x element
      // natively, with momentum, and driving scrollLeft ourselves fights it.
      if (event.pointerType === "touch") return;
      isDragging = true;
      didDrag = false;
      startX = event.clientX;
      initialScroll = track.scrollLeft;
    });
    track.addEventListener("pointermove", (event) => {
      if (!isDragging) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 4 && !didDrag) {
        didDrag = true;
        track.classList.add("dragging");
        // Captured only now: taking the pointer on pointerdown would retarget
        // the click away from the slide and break opening the lightbox.
        if (track.setPointerCapture) track.setPointerCapture(event.pointerId);
      }
      if (didDrag) track.scrollLeft = initialScroll - distance;
    });
    const finish = (event) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("dragging");
      if (track.hasPointerCapture && track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    };
    track.addEventListener("pointerup", finish);
    track.addEventListener("pointercancel", finish);
    // Swallow the click that ends a drag so it never opens a lightbox.
    track.addEventListener(
      "click",
      (event) => {
        if (!didDrag) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
      },
      true
    );
  };
  document.querySelectorAll(".project-carousel").forEach(enableDragScroll);

  /* ── Reel arrows ─────────────────────────────────────────────────────── */

  document.querySelectorAll("[data-reel]").forEach((button) => {
    const track = document.getElementById(button.getAttribute("aria-controls"));
    if (!track) return;

    button.addEventListener("click", () => {
      const cards = [...track.children];
      if (cards.length < 2) return;

      // One card's pitch, gap included. Scrolling by this rather than snapping
      // to a card's offset is what makes every press advance exactly one image:
      // the last cards all clamp against the same maximum scroll position, so
      // "go to the next card" stops moving before you've seen them all.
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      const max = track.scrollWidth - track.clientWidth;
      const direction = button.dataset.reel === "prev" ? -1 : 1;

      // Wrap at the ends so neither arrow is ever dead.
      const target =
        direction > 0 && track.scrollLeft >= max - 4
          ? 0
          : direction < 0 && track.scrollLeft <= 4
            ? max
            : Math.max(0, Math.min(track.scrollLeft + step * direction, max));

      track.scrollTo({
        left: target,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
    });
  });

  /* ── Carousel autoplay ───────────────────────────────────────────────── */

  if (!reducedMotion.matches) {
    const autoplay = (track) => {
      let timer;
      let inView = false;
      let paused = false;
      let manual = false;
      const stop = () => clearTimeout(timer);

      const move = () => {
        stop();
        if (
          !inView ||
          paused ||
          manual ||
          document.hidden ||
          track.scrollWidth <= track.clientWidth
        )
          return;
        const max = track.scrollWidth - track.clientWidth;
        const cards = [...track.children];
        const origin = cards[0]?.offsetLeft || 0;
        const current = cards.reduce((nearest, card, index) => {
          const offset = card.offsetLeft - origin;
          const nearestOffset = cards[nearest].offsetLeft - origin;
          return Math.abs(offset - track.scrollLeft) < Math.abs(nearestOffset - track.scrollLeft)
            ? index
            : nearest;
        }, 0);
        const next = cards[current + 1] ? cards[current + 1].offsetLeft - origin : 0;
        const restart = track.scrollLeft >= max - 6;
        track.scrollTo({ left: restart ? 0 : Math.min(next, max), behavior: "smooth" });
        timer = setTimeout(move, 3400);
      };

      const pause = () => {
        paused = true;
        stop();
      };
      const resume = () => {
        stop();
        paused = false;
        if (inView && !manual && !document.hidden) timer = setTimeout(move, 1800);
      };
      const takeManualControl = () => {
        manual = true;
        stop();
        track.dataset.manual = "true";
      };

      ["pointerdown", "click", "keydown"].forEach((event) =>
        track.addEventListener(event, takeManualControl, { capture: true })
      );
      track.addEventListener(
        "wheel",
        (event) => {
          if (Math.abs(event.deltaX) > 0 || event.shiftKey) takeManualControl();
        },
        { passive: true }
      );
      ["pointerenter", "focusin"].forEach((event) => track.addEventListener(event, pause));
      ["pointerleave", "focusout"].forEach((event) => track.addEventListener(event, resume));
      document.addEventListener("visibilitychange", () => {
        document.hidden ? stop() : resume();
      });

      return (active) => {
        inView = active;
        stop();
        if (active && !paused && !manual && !document.hidden) timer = setTimeout(move, 2200);
      };
    };

    const tracks = new Map();
    document
      .querySelectorAll(".project-carousel[data-autoplay]")
      .forEach((track) => tracks.set(track, autoplay(track)));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => tracks.get(entry.target)(entry.isIntersecting)),
      { threshold: 0.35 }
    );
    tracks.forEach((_, track) => observer.observe(track));
  }

  /* ── Menu ────────────────────────────────────────────────────────────── */

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const setMenuOpen = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    nav.inert = !open;
    nav.classList.toggle("open", open);
  };
  setMenuOpen(false);
  menuButton.addEventListener("click", () =>
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true")
  );
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      setMenuOpen(false);
      menuButton.focus({ preventScroll: true });
    })
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuButton.focus({ preventScroll: true });
    }
  });

  /* ── Reveals & header state ──────────────────────────────────────────── */

  const revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }),
    { threshold: 0.13 }
  );
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const header = document.querySelector(".site-header");
  window.addEventListener(
    "scroll",
    () => header.classList.toggle("scrolled", window.scrollY > 25),
    { passive: true }
  );

  /* ── Keycaps: press, hold and release ────────────────────────────────── */

  const keycaps = [
    ...document.querySelectorAll(".pick"),
    ...document.querySelectorAll(".stack-key-hit"),
  ];
  if (keycaps.length) {
    // Synthesised rather than a sound file: a switch is a short noise transient
    // riding a low wooden thock, which is a handful of Web Audio nodes and saves
    // shipping an asset. The context is built on the first press, because
    // browsers refuse to start audio outside a user gesture.
    let audio = null;

    /* ── Switch sound: tuning knobs ─────────────────────────────────────────
       Edit these and reload the page — this file is served as-is, no build
       step. Each one only touches the thing its name says.

       CLICK_*  — the sharp transient on top. This is what was making it read
                  as a mouse click: short + narrow-band + no body underneath
                  is exactly what a mouse micro-switch sounds like.
       BODY_*   — a low thump mixed under the click. This is the "mechanical
                  switch" cue a mouse click doesn't have. Raise BODY_LEVEL
                  first if it still sounds click-y; lower BODY_FREQ_HZ for
                  more weight, but past ~150Hz it starts reading as bassy
                  again (that was the complaint two iterations ago).
       AIR_*    — the brief high sizzle that reads as "plastic". Cut AIR_LEVEL
                  toward 0 if it sounds hissy rather than crisp.
    */
    const CLICK_FREQ_HZ = 3050;
    const CLICK_Q = 3.4;
    const CLICK_DURATION_MS = 7;
    const CLICK_LEVEL = 0.85;

    const BODY_FREQ_HZ = 240;
    const BODY_DECAY_TO_HZ = 150;
    const BODY_DURATION_MS = 22;
    const BODY_LEVEL = 0.5;

    const AIR_FREQ_HZ = 7000;
    const AIR_DURATION_MS = 2.5;
    const AIR_LEVEL = 0.16;

    const clack = (down = true) => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audio = audio || new Ctx();
        if (audio.state === "suspended") audio.resume();

        const now = audio.currentTime;
        const level = down ? 1 : 0.55;

        const out = audio.createGain();
        out.gain.value = 0.9;
        out.connect(audio.destination);

        // The click: a hard, near-instant attack then a steep decay, baked
        // into the buffer rather than an exponential ramp so the first couple
        // of milliseconds fall off faster than a plain exponential gives.
        const clickDurationMs = down ? CLICK_DURATION_MS : CLICK_DURATION_MS - 1;
        const clickLength = Math.floor((audio.sampleRate * clickDurationMs) / 1000);
        const clickBuffer = audio.createBuffer(1, clickLength, audio.sampleRate);
        const clickChannel = clickBuffer.getChannelData(0);
        const attackMs = 1.1;
        for (let i = 0; i < clickLength; i += 1) {
          const t = (i / audio.sampleRate) * 1000;
          const env =
            t < attackMs
              ? t / attackMs
              : Math.pow(1 - (t - attackMs) / (clickDurationMs - attackMs), 2.6);
          clickChannel[i] = (Math.random() * 2 - 1) * env;
        }
        const click = audio.createBufferSource();
        click.buffer = clickBuffer;
        const core = audio.createBiquadFilter();
        core.type = "bandpass";
        core.frequency.value = down ? CLICK_FREQ_HZ : CLICK_FREQ_HZ + 450;
        core.Q.value = CLICK_Q;
        const coreGain = audio.createGain();
        coreGain.gain.value = CLICK_LEVEL * level;
        click.connect(core).connect(coreGain).connect(out);

        // The body: what's missing from a mouse click. A single low sine,
        // sliding down in pitch, mixed well under the click transient — that
        // "under", not "beside", is what keeps it from reading as bass rather
        // than weight.
        const body = audio.createOscillator();
        body.type = "sine";
        body.frequency.setValueAtTime(down ? BODY_FREQ_HZ : BODY_FREQ_HZ + 60, now);
        body.frequency.exponentialRampToValueAtTime(
          down ? BODY_DECAY_TO_HZ : BODY_DECAY_TO_HZ + 60,
          now + BODY_DURATION_MS / 1000
        );
        const bodyGain = audio.createGain();
        bodyGain.gain.setValueAtTime(BODY_LEVEL * level, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + BODY_DURATION_MS / 1000);
        body.connect(bodyGain).connect(out);
        body.start(now);
        body.stop(now + BODY_DURATION_MS / 1000 + 0.02);

        // The air: a flash of top-end sizzle, shorter than the click, that
        // reads as plastic rather than a dampened knock.
        const airLength = Math.floor((audio.sampleRate * AIR_DURATION_MS) / 1000);
        const airBuffer = audio.createBuffer(1, airLength, audio.sampleRate);
        const airChannel = airBuffer.getChannelData(0);
        for (let i = 0; i < airLength; i += 1) {
          airChannel[i] = (Math.random() * 2 - 1) * (1 - i / airLength) ** 1.8;
        }
        const air = audio.createBufferSource();
        air.buffer = airBuffer;
        const airFilter = audio.createBiquadFilter();
        airFilter.type = "highpass";
        airFilter.frequency.value = AIR_FREQ_HZ;
        const airGain = audio.createGain();
        airGain.gain.value = AIR_LEVEL * level;
        air.connect(airFilter).connect(airGain).connect(out);

        click.start(now);
        air.start(now);
      } catch {
        // Audio is a flourish; never let it break the navigation.
      }
    };

    // Same evaluation a browser does internally for `cubic-bezier()`: solve for
    // the parametric t whose x matches the input, then read y at that t. Used
    // because the keycap's press animation needs the timing function to move
    // from CSS to script (see the comment on `animateCap`) without changing
    // how it looks.
    function cubicBezier(x1, y1, x2, y2) {
      const sampleX = (t) => {
        const c = 3 * x1;
        const b = 3 * (x2 - x1) - c;
        const a = 1 - c - b;
        return ((a * t + b) * t + c) * t;
      };
      const sampleY = (t) => {
        const c = 3 * y1;
        const b = 3 * (y2 - y1) - c;
        const a = 1 - c - b;
        return ((a * t + b) * t + c) * t;
      };
      const sampleDerivativeX = (t) => {
        const c = 3 * x1;
        const b = 3 * (x2 - x1) - c;
        const a = 1 - c - b;
        return (3 * a * t + 2 * b) * t + c;
      };
      const solveX = (x) => {
        let t = x;
        for (let i = 0; i < 8; i += 1) {
          const dx = sampleX(t) - x;
          if (Math.abs(dx) < 1e-6) return t;
          const d = sampleDerivativeX(t);
          if (Math.abs(d) < 1e-6) break;
          t -= dx / d;
        }
        let lo = 0;
        let hi = 1;
        t = x;
        while (lo < hi) {
          const dx = sampleX(t) - x;
          if (Math.abs(dx) < 1e-6) return t;
          if (dx > 0) hi = t;
          else lo = t;
          t = (hi + lo) / 2;
        }
        return t;
      };
      return (t) => (t <= 0 ? 0 : t >= 1 ? 1 : sampleY(solveX(t)));
    }

    // ── Press geometry ─────────────────────────────────────────────────────
    // Redraws the cap's top face at a lower `cy` instead of squashing the
    // whole drawing with a CSS `scaleY` — see the comment on `.keycap` in
    // custom.css for why a uniform vertical scale reads as the cap tipping
    // sideways instead of sinking straight down. The projection math mirrors
    // `face()` in Keycap.astro exactly; `b` never moves; only `cy` does.
    const CY_UP = 52;
    const CY_DOWN = 52 + 13;
    const TOP_S = 46;

    function projectFace(cx, cy, s) {
      const ux = 0.866 * s;
      const uy = 0.25 * s;
      const vx = -0.5 * s;
      const vy = 0.433 * s;
      const p = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;
      return {
        back: p(cx - ux - vx, cy - uy - vy),
        right: p(cx + ux - vx, cy + uy - vy),
        front: p(cx + ux + vx, cy + uy + vy),
        left: p(cx - ux + vx, cy - uy + vy),
      };
    }

    const BASE_FACE = projectFace(100, 118, 56);
    const capGeometry = new WeakMap();

    keycaps.forEach((key) => {
      const svg = key.querySelector(".keycap");
      if (!svg) return;
      const wallLeft = svg.querySelector(".keycap-wall-left");
      const wallRight = svg.querySelector(".keycap-wall-right");
      const top = svg.querySelector(".keycap-top");
      const dish = svg.querySelector(".keycap-dish");
      const legends = [...svg.querySelectorAll(".keycap-legend, .keycap-glyph-line")];
      if (!wallLeft || !wallRight || !top || !dish) return;
      capGeometry.set(key, { wallLeft, wallRight, top, dish, legends, value: 0, raf: 0 });
    });

    const redrawCap = (geo, cy) => {
      const t = projectFace(100, cy, TOP_S);
      const topPoints = `${t.back} ${t.right} ${t.front} ${t.left}`;
      geo.top.setAttribute("points", topPoints);
      geo.dish.setAttribute("points", topPoints);
      geo.wallLeft.setAttribute(
        "points",
        `${t.left} ${t.front} ${BASE_FACE.front} ${BASE_FACE.left}`
      );
      geo.wallRight.setAttribute(
        "points",
        `${t.front} ${t.right} ${BASE_FACE.right} ${BASE_FACE.front}`
      );
      geo.legends.forEach((el) => {
        const suffix = el.tagName.toLowerCase() === "text" ? "" : " scale(2.1) translate(-12 -12)";
        el.setAttribute("transform", `matrix(0.866 0.25 -0.5 0.433 100 ${cy.toFixed(2)})${suffix}`);
      });
    };

    // A registered custom property (`@property`) would normally let a plain
    // CSS transition own this easing while script just reads the
    // interpolated value back each frame — that's cleaner than a hand-rolled
    // tween. It doesn't work here: Chromium computes registered custom
    // properties to their initial value on SVG elements regardless of what
    // the cascade sets, so `--press` never actually moved. This reimplements
    // the same cubic-bezier the CSS used to carry, entirely in script.
    const pressEase = cubicBezier(0.18, 1.3, 0.4, 1);

    const animateCap = (key, down) => {
      const geo = capGeometry.get(key);
      if (!geo) return;
      cancelAnimationFrame(geo.raf);
      const from = geo.value;
      const to = down ? 1 : 0;
      const duration = down ? 180 : 320;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        geo.value = from + (to - from) * pressEase(t);
        redrawCap(geo, CY_UP + (CY_DOWN - CY_UP) * geo.value);
        if (t < 1) geo.raf = requestAnimationFrame(tick);
      };
      geo.raf = requestAnimationFrame(tick);
    };

    // A real click lasts ~60ms but the cap takes 180ms to bottom out, so a plain
    // press would reverse before it ever got down and read as no animation at
    // all. Holding it for a minimum lets the travel finish; holding the button
    // longer than that still keeps it down, and only then does it come back.
    const HOLD_MIN = 190;
    const pressedAt = new WeakMap();
    const pending = new WeakMap();

    const lift = (key) => {
      if (!key.classList.contains("is-held")) return;
      key.classList.remove("is-held");
      clack(false);
      animateCap(key, false);
    };

    const releaseAll = () => {
      keycaps.forEach((key) => {
        if (!key.classList.contains("is-held")) return;
        const elapsed = performance.now() - (pressedAt.get(key) || 0);
        if (elapsed >= HOLD_MIN) {
          lift(key);
          return;
        }
        clearTimeout(pending.get(key));
        pending.set(
          key,
          setTimeout(() => lift(key), HOLD_MIN - elapsed)
        );
      });
    };

    keycaps.forEach((key) => {
      // The index caps are anchors, so a press-and-drag starts a native link
      // drag. That drag swallows pointer events — the page stops responding to
      // the mouse and `pointerup` never arrives, leaving the cap stuck down.
      key.draggable = false;
      key.addEventListener("dragstart", (event) => event.preventDefault());

      const push = () => {
        clearTimeout(pending.get(key));
        pressedAt.set(key, performance.now());
        key.classList.add("is-held");
        clack();
        animateCap(key, true);
      };

      key.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        // Captured on the cap itself, so the release is delivered here even if
        // the pointer has wandered off the key — or off the window. Capturing
        // on the element that was pressed leaves the click target unchanged.
        if (key.setPointerCapture) {
          try {
            key.setPointerCapture(event.pointerId);
          } catch {}
        }
        push();
      });

      // Held with the keyboard too. `repeat` guards against the OS key-repeat
      // firing clack() dozens of times while the key is down.
      key.addEventListener("keydown", (event) => {
        if (event.repeat) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        push();
      });

      key.addEventListener("keyup", releaseAll);
      key.addEventListener("blur", releaseAll);
    });

    // Listened for on the window, not the cap: the pointer is very often
    // released somewhere else on the page, and the cap must come back up anyway.
    window.addEventListener("pointerup", releaseAll);
    window.addEventListener("pointercancel", releaseAll);
    // Last resorts: alt-tabbing or a lost focus mid-press must not strand a cap.
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) releaseAll();
    });
  }

  /* ── Stack board readout ─────────────────────────────────────────────── */

  const readout = document.querySelector(".stack-readout");
  if (readout) {
    const name = readout.querySelector("[data-readout-name]");
    const note = readout.querySelector("[data-readout-note]");
    // The idle copy is the bilingual hint already on the element; keep both
    // languages so the toggle still swaps it when nothing is hovered.
    const idle = { es: note.dataset.es, en: note.dataset.en, name: "" };
    let current = idle;

    const paint = () => {
      const lang = root.dataset.lang === "en" ? "en" : "es";
      name.textContent = current.name;
      note.textContent = current[lang];
    };

    // Pointer, tap and keyboard all drive the same readout. A tap pins the key
    // so the text stays put once the finger lifts; tapping it again unpins.
    let pinned = null;

    const show = (key) => {
      current = {
        name: key.dataset.tech,
        es: key.dataset.noteEs,
        en: key.dataset.noteEn,
      };
      document.querySelectorAll(".stack-key-hit.is-active").forEach((other) => {
        if (other !== key) other.classList.remove("is-active");
      });
      key.classList.add("is-active");
      paint();
    };

    const clear = () => {
      document.querySelectorAll(".stack-key-hit.is-active").forEach((key) => {
        key.classList.remove("is-active");
      });
      current = idle;
      paint();
    };

    document.querySelectorAll(".stack-key-hit").forEach((key) => {
      key.addEventListener("pointerenter", () => {
        if (!pinned) show(key);
      });
      key.addEventListener("pointerleave", () => {
        if (!pinned) clear();
      });
      key.addEventListener("focus", () => show(key));
      key.addEventListener("blur", () => {
        if (!pinned) clear();
      });
      key.addEventListener("click", () => {
        if (pinned === key) {
          pinned = null;
          clear();
          return;
        }
        pinned = key;
        show(key);
      });
    });

    // Re-render on a language switch, since the readout owns its own text.
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-lang"] });
    paint();
  }

  /* ── Cursor dot ──────────────────────────────────────────────────────── */

  /* ---------------------------------------------------------------- portrait
     Hover tilt on the cover illustration. Deliberately pointermove-only: there
     is no press-and-drag, so the image never leaves its frame. */
  const portrait = document.querySelector(".cover-portrait");
  if (portrait && matchMedia("(hover:hover)").matches) {
    const MAX = 7;
    portrait.addEventListener("pointermove", (event) => {
      const box = portrait.getBoundingClientRect();
      // -0.5..0.5 from the centre of the card, in each axis.
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      // Moving the cursor right turns the card's right edge away, and moving it
      // down tips the top toward you, which is why Y drives X and is negated.
      portrait.style.setProperty("--portrait-ry", `${(x * MAX * 2).toFixed(2)}deg`);
      portrait.style.setProperty("--portrait-rx", `${(-y * MAX * 2).toFixed(2)}deg`);
    });
    portrait.addEventListener("pointerleave", () => {
      portrait.style.setProperty("--portrait-ry", "0deg");
      portrait.style.setProperty("--portrait-rx", "0deg");
    });
  }

  if (matchMedia("(pointer:fine)").matches) {
    const cursor = document.querySelector(".cursor-dot");
    window.addEventListener("pointermove", (event) => {
      cursor.style.opacity = "1";
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("pointerenter", () => {
        cursor.style.width = "28px";
        cursor.style.height = "28px";
      });
      element.addEventListener("pointerleave", () => {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
      });
    });
  }
})();
