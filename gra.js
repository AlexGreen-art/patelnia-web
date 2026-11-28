// Nic nie przywiera — zasady gry (Silnik) i ekrany.
var MARKA = "Tefal";   // jedna stała: zmiana marki w całej grze
var MARKA_MOPA = "Vileda";   // druga marka (mop, klamerki)
var AUTOR = "Aleksandra Stelmach";        // podpis autorki (wpisz między cudzysłowy)

var Silnik = (function () {
  var S = (typeof SCENY !== "undefined") ? SCENY : require("./sceny.js");
  var EGO_START = 24, ZAPAL_START = 2, BONY_START = 2, ZAPAL_MAX = 10, ZAPAL_OSTRZ = 8;

  function nowy() {
    return { r: 0, s: 0, ego: EGO_START, zapal: ZAPAL_START, bony: BONY_START, pat: {}, etap: "scena", ostrz: false, koniec: null };
  }
  function scena(st) { return S.rundy[st.r].sceny[st.s]; }
  function koniecPoscigu(st) { return st.r === S.rundy.length - 1 && st.s >= 3; }   // od sceny 5.4 SUV stoi
  function ostatnia(st) { return st.r === S.rundy.length - 1 && st.s === S.rundy[st.r].sceny.length - 1; }
  function dostepna(st, o) { return !o.w || !!st.pat[o.w]; }

  // Najlepsza dostępna opcja: największy spadek Ego bez wzrostu Zapału (remis: więcej bonów).
  function najlepsza(st) {
    var o = scena(st).o, naj = -1;
    for (var i = 0; i < o.length; i++) {
      if (!dostepna(st, o[i]) || o[i].z > 0) continue;
      if (naj < 0 || o[i].e < o[naj].e || (o[i].e === o[naj].e && o[i].b > o[naj].b)) naj = i;
    }
    return naj;
  }

  function wybierz(st, i) {
    var o = scena(st).o[i];
    if (!o || !dostepna(st, o) || st.koniec || st.etap !== "scena") return null;
    var przed = { ego: st.ego, zapal: st.zapal, bony: st.bony };
    var fin = ostatnia(st);
    st.bony = Math.max(0, st.bony + o.b);
    if (!koniecPoscigu(st)) st.zapal = Math.max(0, Math.min(ZAPAL_MAX, st.zapal + o.z));
    st.ego = Math.max(fin ? 0 : 1, Math.min(EGO_START, st.ego + o.e));
    var wynik = { d: { ego: st.ego - przed.ego, zapal: st.zapal - przed.zapal, bony: st.bony - przed.bony }, r: o.r };
    if (st.zapal >= ZAPAL_MAX) {
      st.koniec = { typ: "przegrana", id: S.rundy[st.r].przegrana.id, powod: "zapal" };
    } else if (fin) {
      st.koniec = st.ego === 0 ? { typ: "wygrana", id: "wygrana" } : { typ: "przegrana", id: S.przegranaFinal.id, powod: "ego" };
    } else {
      st.s++;
      if (st.s >= S.rundy[st.r].sceny.length) {
        st.r++; st.s = 0;
        st.zapal = Math.max(0, st.zapal - (st.pat.thermo ? 2 : 1));   // uciekasz dalej
        st.etap = "katalog";
      }
    }
    return wynik;
  }

  function kup(st, id) {
    var p = null;
    S.katalog.forEach(function (k) { if (k.id === id) p = k; });
    if (!p || st.pat[id] || st.bony < p.cena) return false;
    st.bony -= p.cena; st.pat[id] = true;
    return true;
  }
  function zKatalogu(st) { st.etap = "scena"; }
  function ostrzezenie(st) {
    if (st.zapal < ZAPAL_OSTRZ || koniecPoscigu(st)) return null;
    var t = S.ostrzezenie[st.ostrz ? 1 : 0];
    st.ostrz = true;
    return t;
  }
  function tekst(t) { return String(t).split("{MARKA}").join(MARKA).split("{MOP}").join(MARKA_MOPA); }
  function wszystkieZakonczenia() {
    var l = [{ id: S.wygrana.id, tytul: S.wygrana.tytul }];
    S.rundy.forEach(function (r) { l.push({ id: r.przegrana.id, tytul: r.przegrana.tytul }); });
    l.push({ id: S.przegranaFinal.id, tytul: S.przegranaFinal.tytul });
    return l;
  }

  return { S: S, koniecPoscigu: koniecPoscigu, nowy: nowy, scena: scena, ostatnia: ostatnia, dostepna: dostepna, najlepsza: najlepsza, wybierz: wybierz,
           kup: kup, zKatalogu: zKatalogu, ostrzezenie: ostrzezenie, tekst: tekst, wszystkieZakonczenia: wszystkieZakonczenia,
           ZAPAL_OSTRZ: ZAPAL_OSTRZ, ZAPAL_MAX: ZAPAL_MAX, EGO_START: EGO_START };
})();

if (typeof module !== "undefined") module.exports = { Silnik: Silnik, MARKA: MARKA };

/* ───────────────────────── EKRANY ───────────────────────── */
if (typeof document !== "undefined") (function () {
  var S = Silnik.S, T = Silnik.tekst;
  var app, ekran = "tytul", st = null, migawka = null;
  var KLUCZ = "patelnia_zapis", KLUCZ_ZAK = "patelnia_zakonczenia";
  var NAZWY = { n: "", z: "Zexter", t: "Ty", p: "Policjant", d: "Dyspozytor" };
  var PORTRET = { z: "zexter", p: "policjant" };
  var PATELNIE = {};
  S.katalog.forEach(function (k) { PATELNIE[k.id] = k; });
  var KROTKO = { nal: "naleśnikowa", gril: "grillowa", wok: "wok", ing: "Ingenio" };
  var D = (typeof Dzwiek !== "undefined") ? Dzwiek : { tlo: function () {}, efekt: function () {}, wejscie: function () {}, wynik: function () {},
           przegrana: function () {}, wygrana: function () {}, wlaczony: function () { return false; }, przelacz: function () { return false; } };

  function esc(t) { return T(t).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function kopia(o) { return JSON.parse(JSON.stringify(o)); }
  function czytaj(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function pisz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function zapisz() { pisz(KLUCZ, { st: st, migawka: migawka }); }
  function kasujZapis() { try { localStorage.removeItem(KLUCZ); } catch (e) {} }
  function odkryte() { return czytaj(KLUCZ_ZAK) || []; }
  function odkryj(id) { var l = odkryte(); if (l.indexOf(id) < 0) { l.push(id); pisz(KLUCZ_ZAK, l); } }

  // Obrazek z pliku, a gdy go nie ma — zostaje rysunek zastępczy z CSS pod spodem.
  function obraz(nazwa, klasa, zapas) {
    var z = zapas && zapas !== nazwa ? zapas : "";
    return '<div class="zast zast-' + (z || nazwa) + ' ' + (klasa || "") + '"><img src="obrazki/' + nazwa + '.webp" data-z="' + z + '" alt="" onload="this.parentNode.classList.add(\'jest\')" ' +
      'onerror="if(this.dataset.z){var z=this.dataset.z;this.dataset.z=\'\';this.src=\'obrazki/\'+z+\'.webp\'}else this.remove()"></div>';
  }
  function pokaz(nazwa, html) { ekran = nazwa; app.className = "e-" + nazwa; app.innerHTML = html; app.scrollTop = 0; }
  function klik(sel, f) { var el = app.querySelector(sel); if (el) el.addEventListener("click", f); }

  function pytanie(tresc, tak, nie, f) {
    var m = document.createElement("div");
    m.className = "modal";
    m.innerHTML = '<div class="okno"><p>' + esc(tresc) + '</p><button class="p glowny" data-a="tak">' + esc(tak) + '</button><button class="p" data-a="nie">' + esc(nie) + '</button></div>';
    m.addEventListener("click", function (e) {
      var a = e.target.getAttribute("data-a");
      if (a === "tak") { m.remove(); f(); } else if (a === "nie" || e.target === m) m.remove();
    });
    document.body.appendChild(m);
  }

  /* ── tytuł ── */
  function tytul() {
    var z = czytaj(KLUCZ);
    D.tlo(null);
    pokaz("tytul",
      '<div class="t-gora"><div class="t-patelnia"><i></i></div><h1>Nic nie<br>przywiera</h1><p class="t-pod">dziennikarka · patelnia · morderca</p></div>' +
      '<div class="t-menu">' +
      '<button class="p glowny" id="b-nowa">Nowa gra</button>' +
      (z && z.st && !z.st.koniec ? '<button class="p" id="b-kont">Kontynuuj</button>' : "") +
      '<button class="p" id="b-jak">Jak grać</button>' +
      '<button class="p" id="b-o">O grze</button>' +
      '<button class="p" id="b-dzw">' + (D.wlaczony() ? "Dźwięk: włączony" : "Dźwięk: wyłączony") + '</button>' +
      '<button class="p cichy" id="b-wyjdz">Wyjdź z gry</button></div>');
    klik("#b-nowa", function () {
      if (z && z.st && !z.st.koniec) pytanie("Zacząć od nowa? Zapisana gra zniknie.", "Nowa gra", "Anuluj", nowaGra); else nowaGra();
    });
    klik("#b-kont", function () {
      st = z.st; migawka = z.migawka || kopia(z.st);
      if (st.etap === "katalog") katalog(); else plansza();
    });
    klik("#b-jak", function () { jakGrac(false); });
    klik("#b-o", oGrze);
    klik("#b-dzw", function () { var w = D.przelacz(); this.textContent = w ? "Dźwięk: włączony" : "Dźwięk: wyłączony"; });
    klik("#b-wyjdz", function () { if (window.Android && Android.zamknij) Android.zamknij(); });
  }

  function nowaGra() { st = Silnik.nowy(); migawka = kopia(st); zapisz(); prolog(0); }

  /* ── prolog, jak grać, o grze ── */
  function prolog(i) {
    D.tlo("hala");
    pokaz("prolog", '<button class="pomin" id="b-pomin">Pomiń</button><div class="pr-tekst"><p>' + esc(S.prolog[i]) + '</p></div>' +
      '<div class="pr-dol"><span>' + (i + 1) + " / " + S.prolog.length + '</span><button class="p glowny" id="b-dalej">Dalej →</button></div>');
    klik("#b-pomin", function () { jakGrac(true); });
    klik("#b-dalej", function () { if (i + 1 < S.prolog.length) prolog(i + 1); else jakGrac(true); });
  }

  function jakGrac(wGrze) {
    var ik = ["👆", "🎭", "🔥", "🎟️", "🔴"];
    pokaz(wGrze ? "jakgrac-start" : "jakgrac", '<h2>Jak grać</h2><ul class="jak">' +
      S.jakGrac.map(function (t, i) { return '<li><b>' + ik[i] + '</b><span>' + esc(t) + '</span></li>'; }).join("") +
      '</ul><button class="p glowny" id="b-ok">' + (wGrze ? "Zaczynamy →" : "Wróć") + '</button>');
    klik("#b-ok", wGrze ? plansza : tytul);
  }

  function oGrze() {
    var w = "";
    try { if (window.Android && Android.wersja) w = Android.wersja(); } catch (e) {}
    var odk = odkryte();
    pokaz("ogrze", '<h2>O grze</h2><p>Nic nie przywiera. Wykonanie przy użyciu Claude Fable 5.2 i GPT-6.</p>' +
      (AUTOR ? '<p>' + esc(AUTOR) + '</p>' : "") +
      '<p class="mniej">Wersja ' + esc(w || "podgląd") + '</p>' + listaZakonczen(odk) +
      '<button class="p glowny" id="b-ok">Wróć</button>');
    klik("#b-ok", tytul);
  }

  function listaZakonczen(odk) {
    var wsz = Silnik.wszystkieZakonczenia();
    return '<div class="zak"><h3>Zakończenia: ' + odk.length + " / " + wsz.length + '</h3><ul>' + wsz.map(function (z) {
      var jest = odk.indexOf(z.id) >= 0;
      return '<li class="' + (jest ? "jest" : "") + '">' + (jest ? "✓ " + esc(z.tytul) : "? ? ?") + '</li>';
    }).join("") + '</ul></div>';
  }

  /* ── plansza rundy ── */
  function plansza() {
    var r = S.rundy[st.r];
    D.tlo(r.tlo);
    if (st.r === 1) D.efekt("E07");
    pokaz("plansza", obraz(r.tlo, "pl-tlo") + '<div class="pl-tresc"><p class="pl-nr">Runda ' + (st.r + 1) + '</p><h2>' + esc(r.nazwa) + '</h2><p>' + esc(r.plansza) + '</p>' +
      '<button class="p glowny" id="b-dalej">Dalej →</button></div>');
    klik("#b-dalej", function () { scenaEkran(); });
  }

  /* ── scena ── */
  function pasek() {
    var po = Silnik.koniecPoscigu(st) && !st.koniec;
    var goraco = !po && st.zapal >= Silnik.ZAPAL_OSTRZ ? " goraco" : "";
    return '<div class="pasek">' +
      '<div class="licz" id="l-ego"><small>Ego</small><b>' + st.ego + '</b></div>' +
      (po ? '<div class="licz koniec" id="l-zapal"><small>Pościg</small><b class="mniej-b">skończony</b></div>'
          : '<div class="licz' + goraco + '" id="l-zapal"><small>Pościg</small><b>' + st.zapal + '<i>/10</i></b></div>') +
      '<div class="licz" id="l-bony"><small>Bony</small><b>' + st.bony + '</b></div></div>';
  }

  function scenaEkran() {
    var r = S.rundy[st.r], sc = Silnik.scena(st);
    var kolejka = sc.k.slice();
    var o = Silnik.ostrzezenie(st);
    if (o) { kolejka.push(["n", o]); zapisz(); }
    D.tlo(sc.tlo || r.tlo);
    D.wejscie(st.r, st.s);
    pokaz("scena", pasek() + '<div class="sc-wrap"><div class="sc-tlo">' + obraz(sc.tlo || r.tlo, "", r.tlo) + '<div id="portret"></div><div class="sc-nr">Runda ' + (st.r + 1) + " · " + (st.s + 1) + "/" + r.sceny.length + '</div></div>' +
      '<div class="panel" id="panel"></div></div>');
    czytajKwestie(kolejka, pokazOpcje);
  }

  function ustawPortret(kto) {
    var p = document.getElementById("portret");
    if (!p) return;
    p.innerHTML = PORTRET[kto] ? obraz(PORTRET[kto], "portret") : "";
  }

  function czytajKwestie(kolejka, potem) {
    var i = 0, panel = document.getElementById("panel");
    function krok() {
      if (i >= kolejka.length) { panel.onclick = null; potem(); return; }
      var k = kolejka[i++];
      ustawPortret(k[0]);
      panel.className = "panel k-" + k[0];
      panel.innerHTML = (NAZWY[k[0]] ? '<div class="kto">' + NAZWY[k[0]] + '</div>' : "") + '<p class="kw">' + esc(k[1]) + '</p><div class="stuk">dotknij ▸</div>';
      panel.scrollTop = 0;
    }
    panel.onclick = krok;
    krok();
  }

  function pokazOpcje() {
    var sc = Silnik.scena(st), panel = document.getElementById("panel");
    var naj = -1;   // żadnych podpowiedzi
    ustawPortret("n");
    panel.className = "panel opcje";
    panel.innerHTML = sc.o.map(function (o, i) {
      var ok = Silnik.dostepna(st, o);
      return '<button class="op' + (ok ? "" : " zamk") + (i === naj ? " naj" : "") + '" data-i="' + i + '"' + (ok ? "" : " disabled") + '>' +
        "" +
        (o.w ? '<em class="wym">' + (ok ? "" : "🔒 wymaga: ") + KROTKO[o.w] + '</em>' : "") +
        '<span>' + esc(o.t) + '</span></button>';
    }).join("");
    panel.scrollTop = 0;
    panel.onclick = function (e) {
      var b = e.target.closest ? e.target.closest(".op") : null;
      if (!b || b.disabled) return;
      panel.onclick = null;
      var ri = st.r, si = st.s, oi = +b.getAttribute("data-i");
      D.efekt("E22");
      var w = Silnik.wybierz(st, oi);
      if (w) D.wynik(ri, si, oi);
      if (!w) return;
      if (st.etap === "katalog") migawka = kopia(st);
      if (st.koniec) { odkryj(st.koniec.id); kasujZapis(); } else zapisz();
      odswiezPasek(w.d);
      czytajKwestie(w.r, poWyborze);
    };
  }

  function odswiezPasek(d) {
    var stary = app.querySelector(".pasek");
    if (!stary) return;
    var tmp = document.createElement("div");
    tmp.innerHTML = pasek();
    stary.parentNode.replaceChild(tmp.firstChild, stary);
    [["ego", "l-ego", -1], ["zapal", "l-zapal", -1], ["bony", "l-bony", 1]].forEach(function (x) {
      var v = d[x[0]];
      if (!v) return;
      var el = document.getElementById(x[1]), f = document.createElement("span");
      f.className = "fru " + (v * x[2] > 0 ? "dobrze" : "zle");
      f.textContent = (v > 0 ? "+" : "−") + Math.abs(v);
      el.appendChild(f);
      el.classList.add("blysk");
    });
  }

  function poWyborze() {
    if (st.koniec) { if (st.koniec.typ === "wygrana") wygrana(); else przegrana(); return; }
    if (st.etap === "katalog") katalog(); else scenaEkran();
  }

  /* ── katalog ── */
  function katalog() {
    D.tlo(null);
    pokaz("katalog", obraz("katalog", "kat-tlo") + '<div class="kat-gl"><p class="kat-nad">GAZETKA · tylko dziś w nocy</p><h2>Katalog ' + esc("{MARKA}") + '</h2>' +
      '<p class="kat-bony">Masz bonów: <b>' + st.bony + '</b></p></div><div class="kat-lista">' +
      S.katalog.map(function (k) {
        var mam = st.pat[k.id], stac = st.bony >= k.cena;
        return '<div class="karta' + (mam ? " mam" : "") + '"><div class="k-rys k-' + k.id + '"><i></i></div><div class="k-op"><h3>' + esc(k.nazwa) + '</h3><p>' + esc(k.opis) + '</p></div>' +
          '<div class="k-kup"><span class="cena">' + k.cena + '<small> bon.</small></span>' +
          (mam ? '<span class="masz">✓ masz</span>' : '<button class="p kup" data-id="' + k.id + '"' + (stac ? "" : " disabled") + '>Kup</button>') + '</div></div>';
      }).join("") + '</div><div class="kat-dol"><p>Następna runda: ' + (st.r + 1) + ". " + esc(S.rundy[st.r].nazwa) + '</p><button class="p glowny" id="b-dalej">Dalej →</button></div>');
    app.querySelectorAll(".kup").forEach(function (b) {
      b.addEventListener("click", function () { if (Silnik.kup(st, b.getAttribute("data-id"))) { D.efekt("E23"); zapisz(); katalog(); } });
    });
    klik("#b-dalej", function () { Silnik.zKatalogu(st); zapisz(); plansza(); });
  }

  /* ── koniec ── */
  function przegrana() {
    var k = st.koniec, p = k.powod === "ego" ? S.przegranaFinal : S.rundy[st.r].przegrana;
    D.przegrana(p.id);
    var powod = k.powod === "ego" ? "Ego Zextera nie spadło do zera, więc nie dał się złapać." : "Pościg doszedł do 10: Zexter cię dogonił.";
    pokaz("przegrana", '<p class="pg-nad">Przegrana</p><h2>' + esc(p.tytul) + '</h2>' + (p.jak ? '<p class="pg-jak">' + esc(p.jak) + '</p>' : "") + '<p class="pg-tekst">' + esc(p.tekst) + '</p><p class="pg-powod">' + powod + '</p>' +
      '<button class="p glowny" id="b-runda">Zacznij rundę od nowa</button><button class="p" id="b-menu">Menu</button>' + listaZakonczen(odkryte()));
    klik("#b-runda", function () {
      st = kopia(migawka); st.koniec = null; zapisz();
      if (st.etap === "katalog") katalog(); else plansza();
    });
    klik("#b-menu", tytul);
  }

  function wygrana() {
    var w = S.wygrana;
    D.wygrana();
    pokaz("wygrana", '<div class="plakat"><div class="pk-gw">★ ★ ★</div><h2>' + esc(w.naglowek) + '</h2>' +
      obraz("plakat", "pk-rys") + '<p class="pk-tekst">' + esc(w.tekst) + '</p><p class="pk-dop">' + esc(w.dopisek) + '</p>' +
      '<div class="pk-rekl"><p>' + esc(w.reklama) + '</p></div><p class="pk-haslo">' + esc(w.haslo) + '</p></div>' +
      listaZakonczen(odkryte()) + '<button class="p glowny" id="b-menu">Menu</button>');
    klik("#b-menu", tytul);
  }

  /* ── przycisk „wstecz” telefonu ── */
  window.wstecz = function () {
    var m = document.querySelector(".modal");
    if (m) { m.remove(); return; }
    if (ekran === "tytul") { if (window.Android && Android.zamknij) Android.zamknij(); return; }
    if (ekran === "ogrze" || ekran === "jakgrac" || ekran === "przegrana" || ekran === "wygrana" || ekran === "prolog") { tytul(); return; }
    pytanie("Wyjść do menu? Postęp jest zapisany.", "Wyjdź do menu", "Graj dalej", tytul);
  };

  // do podglądu i testów w przeglądarce
  window.__gra = { stan: function () { return st; }, ustaw: function (s) { st = s; migawka = kopia(s); },
                   ekrany: { tytul: tytul, plansza: plansza, scena: scenaEkran, katalog: katalog, przegrana: przegrana, wygrana: wygrana, prolog: prolog, jakGrac: jakGrac, oGrze: oGrze } };

  window.addEventListener("DOMContentLoaded", function () { app = document.getElementById("app"); tytul(); });
})();
