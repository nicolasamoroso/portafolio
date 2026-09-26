// Device orientation stays local; activation is always a user action.
(() => {
  const buttons = [...document.querySelectorAll("[data-device-tilt]")];
  const labels = [...document.querySelectorAll("[data-tilt-status]")];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width:1100px) and (pointer:coarse)");
  let enabled = false,
    pending = false,
    baseline = null,
    frame = 0,
    timeout;
  let x = 0,
    y = 0;
  const status = (message) =>
    labels.forEach((label) => {
      label.textContent = message;
    });
  function syncButtons() {
    buttons.forEach((button) => {
      button.disabled = pending;
      button.setAttribute("aria-pressed", String(enabled));
      button.textContent = enabled ? "Desactivar movimiento" : "Activar movimiento al inclinar ↗";
    });
  }
  function stop(message) {
    enabled = false;
    baseline = null;
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("deviceorientation", orient);
    root.classList.remove("device-tilt-active");
    root.style.removeProperty("--device-tilt-x");
    root.style.removeProperty("--device-tilt-y");
    syncButtons();
    if (message) status(message);
  }
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  function orient(event) {
    if (
      !enabled ||
      document.hidden ||
      !mobile.matches ||
      reduce.matches ||
      !Number.isFinite(event.beta) ||
      !Number.isFinite(event.gamma)
    )
      return;
    if (!baseline) {
      baseline = { beta: event.beta, gamma: event.gamma };
      clearTimeout(timeout);
      root.classList.add("device-tilt-active");
      status("Movimiento activo: inclina suavemente tu celular.");
    }
    const angle = ((screen.orientation?.angle ?? window.orientation ?? 0) * Math.PI) / 180;
    const horizontal = event.gamma - baseline.gamma;
    const vertical = event.beta - baseline.beta;
    x = clamp((horizontal * Math.cos(angle) + vertical * Math.sin(angle)) * 0.45, 12);
    y = clamp((vertical * Math.cos(angle) - horizontal * Math.sin(angle)) * -0.35, 9);
    if (!frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--device-tilt-x", `${x.toFixed(2)}deg`);
        root.style.setProperty("--device-tilt-y", `${y.toFixed(2)}deg`);
        frame = 0;
      });
  }
  buttons.forEach((button) =>
    button.addEventListener("click", async () => {
      if (enabled) {
        stop("Movimiento desactivado. Puedes seguir explorando con el dedo.");
        return;
      }
      if (pending) return;
      if (reduce.matches) {
        status("Tu celular tiene movimiento reducido activado; lo respetamos.");
        return;
      }
      if (!mobile.matches) {
        status("Esta función está disponible en celulares y tabletas.");
        return;
      }
      if (!window.isSecureContext || !window.DeviceOrientationEvent) {
        status(
          "El sensor no está disponible aquí. Prueba el sitio publicado con HTTPS; los carruseles funcionan con el dedo."
        );
        return;
      }
      pending = true;
      syncButtons();
      try {
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission !== "granted") {
            status("No se autorizó el sensor. Puedes seguir usando los carruseles normalmente.");
            return;
          }
        }
        if (reduce.matches || !mobile.matches) return;
        enabled = true;
        window.addEventListener("deviceorientation", orient, { passive: true });
        status("Inclina suavemente el celular para iniciar.");
        timeout = setTimeout(
          () =>
            stop("No recibimos datos del sensor. Revisa el permiso de movimiento de tu navegador."),
          6000
        );
      } catch {
        stop("No fue posible activar el sensor. Los carruseles siguen disponibles.");
      } finally {
        pending = false;
        syncButtons();
      }
    })
  );
  reduce.addEventListener("change", () => {
    if (reduce.matches) stop("Movimiento reducido activado.");
  });
  mobile.addEventListener("change", () => {
    if (!mobile.matches) stop("Movimiento desactivado.");
  });
  window.addEventListener("orientationchange", () => {
    baseline = null;
  });
  document.addEventListener("visibilitychange", () => {
    baseline = null;
  });
})();
