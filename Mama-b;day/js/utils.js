export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

export function el(tag, className = "", textContent = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textContent) node.textContent = textContent;
  return node;
}

export function button(text, className = "control", ariaLabel = "") {
  const b = el("button", className, text);
  b.type = "button";
  if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
  return b;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
