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
      }).then(function () { gotowe++; if (typeof licz === "function") licz(); });
    }
    // dźwięki wczytują się razem z obrazkami, żeby nie spóźniały się za sceną
    var dzw = 0, dzwW = 0;
    function licz() { zaslona.querySelector(".ios-licz").textContent = (gotowe + dzw) + " / " + (OBRAZKI.length + dzwW); }
    var dzwieki = new Promise(function (ok) {
      if (!window.Dzwiek || !Dzwiek.wczytaj) return ok();
      dzwW = Dzwiek.wczytaj(function (n) { dzw = n; licz(); }, ok);
      licz();
    });
    Promise.all(OBRAZKI.map(jeden).concat([dzwieki])).then(function () { zaslona.remove(); });
  }
  window.addEventListener("DOMContentLoaded", function () {
    wczytajWszystko();
    popraw();
    new MutationObserver(popraw).observe(document.getElementById("app"), { childList: true, attributes: true, attributeFilter: ["class"] });
  });
})();
