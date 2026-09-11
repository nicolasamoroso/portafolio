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

  /* ── Draggable / tilting profile card ────────────────────────────────── */

  // Both the cover illustration and the CV terminal card use this.
  const enablePortrait = (sketch) => {
    // Feeds the corrected pencil-sweep keyframe its travel distance.
    const syncWidth = () => sketch.style.setProperty("--portrait-width", `${sketch.offsetWidth}px`);
    syncWidth();
    addEventListener("resize", syncWidth, { passive: true });

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    const reset = () => {
      sketch.classList.remove("is-interactive");
      sketch.style.setProperty("--portrait-rx", "0deg");
      sketch.style.setProperty("--portrait-ry", "0deg");
      sketch.style.setProperty("--portrait-x", "0px");
      sketch.style.setProperty("--portrait-y", "0px");
    };
    const tilt = (event) => {
      const bounds = sketch.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      sketch.classList.add("is-interactive");
      sketch.style.setProperty("--portrait-rx", `${-y * 9}deg`);
      sketch.style.setProperty("--portrait-ry", `${x * 11}deg`);
      sketch.style.setProperty("--portrait-x", `${x * -10}px`);
      sketch.style.setProperty("--portrait-y", `${y * -10}px`);
      sketch.style.setProperty("--portrait-light-x", `${(x + 0.5) * 100}%`);
      sketch.style.setProperty("--portrait-light-y", `${(y + 0.5) * 100}%`);
    };
    const drag = (event) => {
      offsetX = Math.max(-72, Math.min(72, offsetX + event.clientX - startX));
      offsetY = Math.max(-78, Math.min(78, offsetY + event.clientY - startY));
      startX = event.clientX;
      startY = event.clientY;
      sketch.style.setProperty("--portrait-drag-x", `${offsetX}px`);
      sketch.style.setProperty("--portrait-drag-y", `${offsetY}px`);
    };
    const tap = () => {
      sketch.classList.remove("portrait-tapped");
      void sketch.offsetWidth;
      sketch.classList.add("portrait-tapped");
    };

    sketch.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      dragging = true;
      moved = false;
      startX = event.clientX;
      startY = event.clientY;
      sketch.classList.add("is-dragging", "is-interactive");
      if (sketch.setPointerCapture) sketch.setPointerCapture(event.pointerId);
    });
    window.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      if (Math.abs(event.clientX - startX) > 1 || Math.abs(event.clientY - startY) > 1)
        moved = true;
      drag(event);
    });
    sketch.addEventListener("pointermove", (event) => {
      if (!dragging && matchMedia("(pointer:fine)").matches) tilt(event);
    });
    window.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      sketch.classList.remove("is-dragging");
      if (sketch.hasPointerCapture && sketch.hasPointerCapture(event.pointerId)) {
        sketch.releasePointerCapture(event.pointerId);
      }
      if (!moved) tap();
    });
    window.addEventListener("pointercancel", () => {
      dragging = false;
      sketch.classList.remove("is-dragging");
    });
    sketch.addEventListener("pointerleave", () => {
      if (!dragging) reset();
    });
    sketch.addEventListener("dblclick", () => {
      offsetX = 0;
      offsetY = 0;
      sketch.style.setProperty("--portrait-drag-x", "0px");
      sketch.style.setProperty("--portrait-drag-y", "0px");
    });
    sketch.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        tap();
      }
    });
  };
  document.querySelectorAll(".profile-sketch").forEach(enablePortrait);

  /* ── Index keycaps: press, hold and release ──────────────────────────── */

  const keycaps = [...document.querySelectorAll(".pick")];
  if (keycaps.length) {
    // Synthesised rather than a sound file: a switch click is a sharp noise
    // transient plus a low thock, which is a few nodes of Web Audio and saves
    // shipping an asset. The context is built on the first press, because
    // browsers refuse to start audio outside a user gesture.
    let audio = null;

    const clack = (down = true) => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audio = audio || new Ctx();
        if (audio.state === "suspended") audio.resume();

        const now = audio.currentTime;
        // The upstroke is quieter and brighter than the downstroke, the way a
        // real switch sounds when the spring lets go.
        const level = down ? 1 : 0.55;

        // The click: a short burst of decaying noise through a bandpass, landing
        // in the range a keycap's edge actually rattles at.
        const length = Math.floor(audio.sampleRate * 0.045);
        const buffer = audio.createBuffer(1, length, audio.sampleRate);
        const channel = buffer.getChannelData(0);
        for (let i = 0; i < length; i += 1) {
          channel[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2;
        }
        const noise = audio.createBufferSource();
        noise.buffer = buffer;
        const band = audio.createBiquadFilter();
        band.type = "bandpass";
        band.frequency.value = down ? 2600 : 3400;
        band.Q.value = 0.8;
        const clickGain = audio.createGain();
        clickGain.gain.setValueAtTime(0.16 * level, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        noise.connect(band).connect(clickGain).connect(audio.destination);
        noise.start(now);

        // The thock: the body of the cap meeting the plate. Only on the way down.
        if (down) {
          const body = audio.createOscillator();
          body.type = "triangle";
          body.frequency.setValueAtTime(190, now);
          body.frequency.exponentialRampToValueAtTime(85, now + 0.07);
          const bodyGain = audio.createGain();
          bodyGain.gain.setValueAtTime(0.09, now);
          bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
          body.connect(bodyGain).connect(audio.destination);
          body.start(now);
          body.stop(now + 0.1);
        }
      } catch {
        // Audio is a flourish; never let it break the navigation.
      }
    };

    // A real click lasts ~60ms but the cap takes 180ms to bottom out, so a plain
    // press would reverse before it ever got down and read as no animation at
    // all. Holding it for a minimum lets the travel finish; holding the button
    // longer than that still keeps it down, and only then does it come back.
    const HOLD_MIN = 190;
    const pressedAt = new WeakMap();
    const pending = new WeakMap();

    const lift = (pick) => {
      if (!pick.classList.contains("is-held")) return;
      pick.classList.remove("is-held");
      clack(false);
    };

    const releaseAll = () => {
      keycaps.forEach((pick) => {
        if (!pick.classList.contains("is-held")) return;
        const elapsed = performance.now() - (pressedAt.get(pick) || 0);
        if (elapsed >= HOLD_MIN) {
          lift(pick);
          return;
        }
        clearTimeout(pending.get(pick));
        pending.set(
          pick,
          setTimeout(() => lift(pick), HOLD_MIN - elapsed)
        );
      });
    };

    keycaps.forEach((pick) => {
      // These are anchors, so a press-and-drag starts a native link drag. That
      // drag swallows pointer events — the page stops responding to the mouse
      // and `pointerup` never arrives, leaving the cap stuck down.
      pick.draggable = false;
      pick.addEventListener("dragstart", (event) => event.preventDefault());

      const push = () => {
        clearTimeout(pending.get(pick));
        pressedAt.set(pick, performance.now());
        pick.classList.add("is-held");
        clack();
      };

      pick.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        // Captured on the cap itself, so the release is delivered here even if
        // the pointer has wandered off the key — or off the window. Capturing
        // on the element that was pressed leaves the click target unchanged.
        if (pick.setPointerCapture) {
          try {
            pick.setPointerCapture(event.pointerId);
          } catch {}
        }
        push();
      });

      // Held with the keyboard too. `repeat` guards against the OS key-repeat
      // firing clack() dozens of times while the key is down.
      pick.addEventListener("keydown", (event) => {
        if (event.repeat) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        push();
      });

      pick.addEventListener("keyup", releaseAll);
      pick.addEventListener("blur", releaseAll);
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
