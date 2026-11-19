/* =========================================================================
   UTILS.JS — Lightweight DOM & Timing Helpers
   ========================================================================= */

window.Tribute = window.Tribute || {};

(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function el(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (textContent !== undefined && textContent !== null && textContent !== "") {
      node.textContent = textContent;
    }
    return node;
  }

  function button(text, className, ariaLabel) {
    const b = el("button", className || "action-tap", text);
    b.type = "button";
    if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
    return b;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  window.Tribute.Utils = { $, $$, el, button, sleep, random };
})();
