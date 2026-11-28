// Nic nie przywiera — dźwięki. Tło w pętli i efekty grane na wierzchu. Pliki w dzwieki/.
// Ten sam plik działa w wersji na Androida i w przeglądarce (także na iPhonie).
// iPhone wpuszcza dźwięk tylko z odtwarzaczy „odblokowanych” dotknięciem, dlatego gra ma
// stałą pulę odtwarzaczy, odblokowaną przy pierwszym dotknięciu ekranu, i podmienia w nich pliki.
var Dzwiek = (function () {
  var PLIKI = {
    T1: "T1_tlo_hala", T2: "T2_tlo_sterownia", T3: "T3_tlo_magazyn", T4: "T4_tlo_autostrada", T5: "T5_tlo_blokada",
    E01: "E01_drzwi_sie_zatrzaskuja", E02: "E02_patelnia_z_tasmy", E03: "E03_zexter_z_mroku", E04: "E04_uderzenie_patelnia",
    E05: "E05_wok_na_glowe", E06: "E06_mop_w_wiadrze", E07: "E07_poscig_do_sterowni", E08a: "E08a_przyciski_rekami",
    E08c: "E08c_nalesnikowa_po_przyciskach", E09: "E09_garnki_z_tasmy", E10: "E10_megafon", E11: "E11_walenie_w_drzwi",
    E12: "E12_piesc_w_szafke", E13: "E13_lawina_z_regalu", E14: "E14_poscig_na_parking", E15: "E15_odpalanie_furgonetki",
    E16: "E16_radio", E17: "E17_klakson", E18: "E18_paleta_na_suva", E19: "E19_grill_pod_maske", E20: "E20_peka_opona",
    E21: "E21_suv_sie_obraca", E22: "E22_klikniecie", E23: "E23_kasa_katalog",
    P0: "P0_przegrana", P1: "P1_zupa", P2: "P2_kurs_tanca", P3: "P3_kregle", P4: "P4_mielno", P5: "P5_pluszaki", P6: "P6_zexter_pro",
    W1: "W1_skwierczenie", W2: "W2_retro_reklama"
  };
  // tło według obrazka sceny (parking: cisza nocy, bez pętli)
  var TLA = { hala: "T1", sterownia: "T2", magazyn: "T3", autostrada: "T4", palety: "T4", blokada: "T5" };
  // efekt na wejściu do sceny: "runda.scena" (liczone od 1)
  var WEJSCIE = { "1.2": "E03", "2.2": "E09", "2.5": "E11", "3.3": "E12", "3.5": "E13", "3.6": "E14", "4.1": "E16", "5.4": "E21" };
  // efekt po wybraniu odpowiedzi: "runda.scena.odpowiedź" (liczone od 1)
  var WYNIK = {
    "1.1.1": "E02", "1.1.2": "E02", "1.1.3": "E01", "1.5.3": "E06", "1.6.1": "E04", "1.6.3": "E05",
    "2.1.1": "E08a", "2.1.4": "E08c", "2.3.1": "E10", "2.3.2": "E10", "2.3.3": "E10", "2.3.4": "E10",
    "3.6.1": "E15", "3.6.2": "E15", "3.6.3": "E15", "3.6.4": "E15",
    "4.4.4": "E17", "4.5.1": "E18", "4.6.1": "E18", "4.6.2": "E19", "5.2.1": "E20", "5.2.5": "E20", "5.4.4": "E17"
  };
  var PRZEGRANE = { zupa: "P1", taniec: "P2", kregle: "P3", mielno: "P4", pluszaki: "P5", zexterpro: "P6" };
  var GLOS = { tlo: 0.7, efekt: 1, klik: 0.6 };
  var KLUCZ = "patelnia_dzwiek";

  var wl = true;
  try { wl = localStorage.getItem(KLUCZ) !== "0"; } catch (e) {}
  var JEST = typeof Audio !== "undefined";

  function src(kod) { return "dzwieki/" + PLIKI[kod] + ".mp3"; }
  function graj(a) { try { var p = a.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {} }

  /* ── pula odtwarzaczy, odblokowana pierwszym dotknięciem ── */
  var CISZA = "dzwieki/cisza.mp3";   // 0,1 s ciszy do odblokowania
  var tloA = [], efA = [], nastEf = 0, odblok = false;
  if (JEST) {
    for (var i = 0; i < 2; i++) { var t = new Audio(); t.preload = "auto"; tloA.push(t); }
    for (var j = 0; j < 6; j++) { var e = new Audio(); e.preload = "auto"; efA.push(e); }
  }
  function odblokuj() {
    if (odblok || !JEST) return;
    odblok = true;
    tloA.concat(efA).forEach(function (a) {
      if (a.src) return;                       // już gra coś prawdziwego
      a.src = CISZA; a.muted = true;
      var p = a.play();
      var po = function () { a.pause(); a.muted = false; };
      if (p && p.then) p.then(po, function () { a.muted = false; }); else po();
    });
  }
  if (typeof document !== "undefined") ["touchend", "click", "keydown"].forEach(function (z) {
    document.addEventListener(z, odblokuj, { capture: true, once: true });
  });

  // Czy da się zmieniać głośność? (iPhone nie pozwala — wtedy pętla bez przenikania)
  var GLOSNOSC = (function () { if (!JEST) return false; var a = new Audio(); try { a.volume = 0.5; } catch (e) {} return a.volume === 0.5; })();

  /* ── tło: przenikanie 1 s przed końcem (gdzie się da), inaczej zwykła pętla ── */
  var tloKod = null, akt = 0, zegar = null, PRZEN = 1.0;
  function stopTlo() {
    if (zegar) { clearInterval(zegar); zegar = null; }
    tloA.forEach(function (a) { try { a.pause(); } catch (e) {} });
  }
  function startTlo(kod) {
    stopTlo();
    akt = 0;
    tloA.forEach(function (a) { a.loop = !GLOSNOSC; a.muted = false; a.src = src(kod); a.currentTime = 0; });
    if (GLOSNOSC) { tloA[0].volume = GLOS.tlo; tloA[1].volume = 0; }
    graj(tloA[0]);
    if (!GLOSNOSC) return;
    zegar = setInterval(function () {
      var a = tloA[akt], b = tloA[1 - akt];
      if (!a.duration || a.paused) return;
      var zostalo = a.duration - a.currentTime;
      if (zostalo <= PRZEN && b.paused) { b.currentTime = 0; b.volume = 0; graj(b); }
      if (!b.paused) {
        var t = Math.max(0, Math.min(1, 1 - zostalo / PRZEN));
        b.volume = GLOS.tlo * t; a.volume = GLOS.tlo * (1 - t);
        if (zostalo <= 0.05 || a.ended) { a.pause(); a.currentTime = 0; akt = 1 - akt; }
      }
    }, 50);
  }
  function tlo(nazwa) {
    var kod = nazwa ? (TLA[nazwa] || null) : null;
    if (kod === tloKod) return;
    tloKod = kod;
    if (!wl || !kod || !JEST) { stopTlo(); return; }
    startTlo(kod);
  }

  /* ── efekty: kolejny wolny odtwarzacz z puli ── */
  function efekt(kod, potem) {
    if (!wl || !JEST || !PLIKI[kod]) { if (potem) potem(); return; }
    var a = efA[nastEf]; nastEf = (nastEf + 1) % efA.length;
    try { a.pause(); } catch (e) {}
    a.onended = potem ? function () { a.onended = null; potem(); } : null;
    a.muted = false; a.loop = false;
    a.src = src(kod);
    if (GLOSNOSC) a.volume = kod === "E22" ? GLOS.klik : GLOS.efekt;
    graj(a);
  }
  function wejscie(r, s) { var k = WEJSCIE[(r + 1) + "." + (s + 1)]; if (k) efekt(k); }
  function wynik(r, s, i) { var k = WYNIK[(r + 1) + "." + (s + 1) + "." + (i + 1)]; if (k) efekt(k); }
  function przegrana(id) { tlo(null); efekt("P0", function () { if (PRZEGRANE[id]) efekt(PRZEGRANE[id]); }); }
  function wygrana() { tlo(null); efekt("W2", function () { efekt("W1"); }); }

  /* ── wyłącznik ── */
  function wlaczony() { return wl; }
  function przelacz() {
    wl = !wl;
    try { localStorage.setItem(KLUCZ, wl ? "1" : "0"); } catch (e) {}
    if (!wl) { stopTlo(); efA.forEach(function (a) { try { a.pause(); } catch (e) {} }); }
    else if (tloKod) startTlo(tloKod);
    return wl;
  }

  // telefon zablokowany albo gra w tle — dźwięk milknie, po powrocie tło gra dalej
  if (typeof document !== "undefined") document.addEventListener("visibilitychange", function () {
    if (document.hidden) { tloA.forEach(function (x) { try { x.pause(); } catch (e) {} }); }
    else if (wl && tloKod) graj(tloA[akt]);
  });

  return { tlo: tlo, efekt: efekt, wejscie: wejscie, wynik: wynik, przegrana: przegrana, wygrana: wygrana,
           wlaczony: wlaczony, przelacz: przelacz, PLIKI: PLIKI, WEJSCIE: WEJSCIE, WYNIK: WYNIK, PRZEGRANE: PRZEGRANE };
})();
if (typeof module !== "undefined") module.exports = Dzwiek;
