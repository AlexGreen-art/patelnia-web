/* Dodatki dla iPhone'a/iPada: nie ma przycisku „wstecz” ani zamykania aplikacji przez stronę. */
(function () {
  if (window.Android) return;
  function popraw() {
    var app = document.getElementById("app");
    if (!app) return;
    var w = document.getElementById("b-wyjdz");
    if (w) w.remove();
    var trzeba = /e-(scena|plansza|katalog)/.test(app.className);
    if (trzeba && !app.querySelector(".ios-menu")) {
      var b = document.createElement("button");
      b.className = "ios-menu"; b.textContent = "☰"; b.setAttribute("aria-label", "Menu");
      b.addEventListener("click", function (e) { e.stopPropagation(); window.wstecz(); });
      app.appendChild(b);
    }
  }
  window.addEventListener("DOMContentLoaded", function () {
    popraw();
    new MutationObserver(popraw).observe(document.getElementById("app"), { childList: true, attributes: true, attributeFilter: ["class"] });
  });
})();
