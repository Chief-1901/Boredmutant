/* Mobile nav. Shared by every page; build.py inlines this ahead of the page script.
   The panel is CSS-driven (.open), so nothing here runs on desktop layouts. */
(function () {
  var toggle = document.querySelector(".navtoggle");
  var panel = document.getElementById("sitenav");
  if (!toggle || !panel) return;

  function setOpen(open) {
    panel.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Same-page anchors (/#pricing) do not reload, so close the panel by hand.
  panel.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (e) {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Rotating to landscape can cross the 900px breakpoint, where the panel's absolute
  // positioning is dropped. Reset state so the desktop bar is never left in .open.
  var desktop = window.matchMedia("(min-width: 900px)");
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onChange);
  else if (desktop.addListener) desktop.addListener(onChange);
})();
