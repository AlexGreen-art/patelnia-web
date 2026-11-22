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
  // Wczytanie wszystkich grafik na starcie, żeby sceny nie doczytywały się kawałkami.
  var OBRAZKI = ["hala","sterownia","magazyn","palety","parking","autostrada","blokada","zexter","policjant","plakat"];
  window.__obrazki = [];
  function wczytajWszystko() {
    var zaslona = document.createElement("div");
    zaslona.className = "ios-wczyt";
    zaslona.innerHTML = '<p>Wczytywanie…</p><p class="ios-licz">0 / ' + OBRAZKI.length + '</p>';
    document.body.appendChild(zaslona);
    var gotowe = 0;
    function jeden(n) {
      return new Promise(function (ok) {
        var im = new Image();
        window.__obrazki.push(im);
        im.onload = function () { (im.decode ? im.decode() : Promise.resolve()).catch(function () {}).then(ok); };
        im.onerror = ok;
        im.src = "obrazki/" + n + ".webp";
      }).then(function () { gotowe++; zaslona.querySelector(".ios-licz").textContent = gotowe + " / " + OBRAZKI.length; });
    }
    Promise.all(OBRAZKI.map(jeden)).then(function () { zaslona.remove(); });
  }
  window.addEventListener("DOMContentLoaded", function () {
    wczytajWszystko();
    popraw();
    new MutationObserver(popraw).observe(document.getElementById("app"), { childList: true, attributes: true, attributeFilter: ["class"] });
  });
})();
