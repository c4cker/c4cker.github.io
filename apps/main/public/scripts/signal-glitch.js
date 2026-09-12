const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const logo = document.querySelector("[data-glitch-logo]");
const brandText = logo?.querySelector("[data-brand-text]");
const glitch = document.querySelector("[data-signal-glitch]");
const glitchWords = glitch?.querySelector("[data-glitch-words]");
const source = brandText?.textContent?.trim() ?? "c4cker";
let restoreLogo;
let logoHovered = false;

const toHex = (value) => Array.from(value).map((character) => character.charCodeAt(0).toString(16).padStart(2, "0")).join("");
const toBinary = (value) => Array.from(value).map((character) => character.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
const toUnicode = (value) => Array.from(value).map((character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
const toAscii = (value) => Array.from(value).map((character) => character.charCodeAt(0)).join(" ");
const toOctal = (value) => Array.from(value).map((character) => character.charCodeAt(0).toString(8).padStart(3, "0")).join(" ");
const toAssembly = (value) => Array.from(value).map((character) => `mov al,0x${character.charCodeAt(0).toString(16).padStart(2, "0")}`).join(";");
const toPercent = (value) => Array.from(value).map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`).join("");
const toBase32 = (value) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let buffer = 0;
  let bits = 0;
  let output = "";
  for (const character of value) {
    buffer = (buffer << 8) | character.charCodeAt(0);
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(buffer >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  return bits ? output + alphabet[(buffer << (5 - bits)) & 31] : output;
};
const encoders = [
  { name: "b64", encode: (value) => btoa(value) }, { name: "hex", encode: toHex }, { name: "bin", encode: toBinary },
  { name: "unicode", encode: toUnicode }, { name: "percent", encode: toPercent }, { name: "ascii", encode: toAscii },
  { name: "oct", encode: toOctal }, { name: "b32", encode: toBase32 }, { name: "asm", encode: toAssembly }
];
const restartAnimation = (element, className) => {
  element.classList.remove(className);
  window.requestAnimationFrame(() => element.classList.add(className));
};
const corruptLogo = () => {
  if (!logo || !brandText) return;
  const encoded = encoders[Math.floor(Math.random() * encoders.length)].encode(source);
  brandText.textContent = encoded;
  brandText.dataset.glitchCopy = encoded;
  restartAnimation(logo, "is-corrupted");
};
const restore = () => {
  if (!logo || !brandText) return;
  brandText.textContent = source;
  delete brandText.dataset.glitchCopy;
  logo.classList.remove("is-corrupted");
};
const flashBlock = () => {
  if (!glitch || !glitchWords) return;
  const words = ["ACCESS", "UPLINK", "CIPHER", "SIGNAL", "PACKET", "VAULT", "SHELL", "TRACE"];
  const lines = Array.from({ length: 2 + Math.floor(Math.random() * 3) }, () => {
    const encoder = encoders[Math.floor(Math.random() * encoders.length)];
    return { codec: encoder.name, value: encoder.encode(words[Math.floor(Math.random() * words.length)]) };
  });
  glitchWords.replaceChildren(...lines.map(({ codec, value }) => {
    const line = document.createElement("span");
    line.dataset.codec = codec;
    line.textContent = value;
    return line;
  }));
  glitch.style.setProperty("--glitch-x", `${8 + Math.random() * 76}vw`);
  glitch.style.setProperty("--glitch-y", `${16 + Math.random() * 68}vh`);
  glitch.style.setProperty("--glitch-ratio", `${1.2 + Math.random() * 1.4}`);
  restartAnimation(glitch, "is-flashing");
};
const schedule = (callback, minimum, maximum) => {
  const next = () => window.setTimeout(() => { if (!document.hidden) callback(); next(); }, minimum + Math.random() * (maximum - minimum));
  next();
};

const touchLayout = window.matchMedia("(pointer: coarse), (hover: none), (max-width: 1023px)").matches;
if (!reduceMotion && !touchLayout) {
  logo?.addEventListener("pointerenter", () => { logoHovered = true; window.clearTimeout(restoreLogo); corruptLogo(); window.dispatchEvent(new Event("c4cker:logo-enter")); });
  logo?.addEventListener("pointerleave", () => { logoHovered = false; restore(); window.dispatchEvent(new Event("c4cker:logo-leave")); });
  schedule(() => { if (!logoHovered) { corruptLogo(); restoreLogo = window.setTimeout(restore, 260); } }, 5000, 8000);
  schedule(flashBlock, 3500, 6500);
}
