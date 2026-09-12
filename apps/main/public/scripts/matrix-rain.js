const canvas = document.querySelector("[data-matrix-rain]");
const desktop = window.matchMedia("(min-width: 1024px) and (min-height: 700px)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const glyphs = "01アイウエオカキクケコサシスセソン攻防鍵暗号<>[]{}#$%&*+=/\\\\|~";
let raf = 0;
let width = 0;
let height = 0;

const stop = () => cancelAnimationFrame(raf);
const draw = () => {
  if (!canvas || !desktop.matches || reduceMotion.matches) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const fontSize = 13;
  const streams = Array.from({ length: Math.ceil(width / fontSize) }, (_, index) => ({
    x: index * fontSize,
    y: Math.random() * height,
    speed: 1.24 + Math.random() * 2.3,
    length: 7 + Math.floor(Math.random() * 9),
    visible: Math.random() > 0.18
  }));
  const render = () => {
    context.clearRect(0, 0, width, height);
    context.font = "12px DM Mono, monospace";
    streams.forEach((stream) => {
      if (!stream.visible) return;
      for (let trail = 0; trail < stream.length; trail += 1) {
        const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
        const opacity = Math.max(0.025, 0.46 - trail * (0.42 / stream.length));
        context.fillStyle = trail === 0 ? "rgb(222 255 232 / .9)" : `rgb(82 210 124 / ${opacity})`;
        context.fillText(glyph, stream.x, stream.y - trail * fontSize);
      }
      stream.y += stream.speed;
      if (stream.y - stream.length * fontSize > height) {
        stream.y = -Math.random() * Math.min(height * 0.6, 420) - 30;
        stream.length = 7 + Math.floor(Math.random() * 9);
        stream.visible = Math.random() > 0.4;
      }
    });
    raf = requestAnimationFrame(render);
  };
  render();
};

const refresh = () => { stop(); draw(); };
desktop.addEventListener("change", refresh);
reduceMotion.addEventListener("change", refresh);
window.addEventListener("resize", refresh);
draw();
