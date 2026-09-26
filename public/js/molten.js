/**
 * Molten background: thin, bright filaments of light that bend and flow like
 * caustics, very faint. Rendered with a small WebGL fragment shader in each
 * section, in the section's own text colour (dark on paper, light on ink,
 * never a hue).
 *
 * The layer sits at z-index -1 in a section that is its own stacking context,
 * so text and images always paint above it. The pattern is computed in page
 * coordinates, so it runs on across section boundaries. Rendered at half
 * resolution, ~30fps, only for sections on screen, paused in hidden tabs,
 * still with reduced motion. Without WebGL it simply doesn't draw.
 */
(() => {
  const HOSTS = [
    ".hero",
    "#trayectoria",
    ".interests-section",
    ".chapter",
    ".logo-section",
    ".contact-section",
    ".project-band",
    // Blocks with their own background inside a section, which would
    // otherwise cover the section's layer.
    ".project-file-alt",
  ];
  const RES = 0.5; // canvas pixels per CSS pixel
  const ALPHA = 0.1; // opacity at the brightest point of a filament
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const VERT = `
    attribute vec2 a;
    void main() { gl_Position = vec4(a, 0.0, 1.0); }
  `;
  // The domain is folded a few times by sine/cosine offsets that drift with
  // time, then a sharp ridge is taken along one of its level lines: what comes
  // out is a handful of thin, curving streaks that slide and merge.
  const FRAG = `
    precision mediump float;
    uniform vec2 uRes;
    uniform vec2 uOffset;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uAlpha;
    void main() {
      vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / ${RES.toFixed(2)};
      vec2 p = (css + uOffset) * 0.0022;
      float t = uTime;
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        p += 0.42 * vec2(
          sin(p.y * 1.6 + t * 0.55 + fi * 1.3),
          cos(p.x * 1.3 - t * 0.45 + fi * 2.1)
        );
      }
      float ridge = abs(sin(p.x * 1.9 + p.y * 1.1 + t * 0.2));
      float glow = 0.018 / (ridge + 0.018);
      glow = pow(glow, 1.6);
      gl_FragColor = vec4(uColor * glow * uAlpha, glow * uAlpha);
    }
  `;

  const fields = [];
  const hosts = [...document.querySelectorAll(HOSTS.join(","))];
  hosts.forEach((host) => {
    const layer = document.createElement("div");
    layer.className = "molten";
    layer.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    layer.append(canvas);
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false });
    if (!gl) return;
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    host.classList.add("molten-host");
    host.prepend(layer);
    fields.push({
      host,
      canvas,
      gl,
      u: {
        res: gl.getUniformLocation(prog, "uRes"),
        offset: gl.getUniformLocation(prog, "uOffset"),
        time: gl.getUniformLocation(prog, "uTime"),
        color: gl.getUniformLocation(prog, "uColor"),
        alpha: gl.getUniformLocation(prog, "uAlpha"),
      },
      top: 0,
      visible: true,
    });
  });
  if (!fields.length) return;

  const measure = () => {
    fields.forEach((f) => {
      // Layout position in the page, walked through offsetParents rather than
      // read from getBoundingClientRect: the latter includes transforms (the
      // reveal animation lifts blocks 35px), which put nested layers out of
      // step with their section's. Left counts too, for inset blocks.
      let left = 0;
      let top = 0;
      for (let el = f.host; el; el = el.offsetParent) {
        left += el.offsetLeft;
        top += el.offsetTop;
      }
      f.left = left;
      f.top = top;
      const width = f.host.offsetWidth;
      const height = f.host.offsetHeight;
      f.canvas.width = Math.max(1, Math.round(width * RES));
      f.canvas.height = Math.max(1, Math.round(height * RES));
      const rgb = (getComputedStyle(f.host).color.match(/\d+/g) || [0, 0, 0])
        .slice(0, 3)
        .map((v) => Number(v) / 255);
      const { gl, u } = f;
      gl.viewport(0, 0, f.canvas.width, f.canvas.height);
      gl.uniform2f(u.res, f.canvas.width, f.canvas.height);
      gl.uniform2f(u.offset, f.left, f.top);
      gl.uniform3f(u.color, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(u.alpha, ALPHA);
    });
  };

  const draw = (t) => {
    fields.forEach((f) => {
      if (!f.visible) return;
      f.gl.uniform1f(f.u.time, t * 0.00025);
      f.gl.drawArrays(f.gl.TRIANGLES, 0, 3);
    });
  };

  const redraw = () => {
    measure();
    draw(performance.now());
  };
  redraw();
  new ResizeObserver(redraw).observe(document.body);
  new MutationObserver(redraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  if (reduced) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const f = fields.find((x) => x.host === e.target);
      if (f) f.visible = e.isIntersecting;
    });
  });
  fields.forEach((f) => io.observe(f.host));

  let last = 0;
  const frame = (t) => {
    if (!document.hidden && t - last > 33) {
      last = t;
      draw(t);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
