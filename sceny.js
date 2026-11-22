// Nic nie przywiera — teksty gry jako dane.
// Kwestia: [kto, tekst]; kto: n = narracja, z = Zexter, t = Ty, p = Policjant, d = Dyspozytor.
// Opcja: t = tekst, e/z/b = zmiana Ego/Pościgu/Bonów, w = wymagana patelnia, r = reakcja (kwestie).
// Marka wyłącznie jako {MARKA} — silnik podmienia.
var SCENY = {
  prolog: [
    "W tym mieście co trzy noce znika jedna osoba, zawsze o trzeciej nad ranem, a policja wie o mordercy tylko tyle, że nosi czarną maskę.",
    "Nazywasz się Alex i jesteś dziennikarką. Chcesz opisać mordercę, zanim zniknie kolejna osoba, a jedyny trop prowadzi do opuszczonej fabryki sprzętu kuchennego na obrzeżach miasta.",
    "Jest 2:45, kiedy stajesz przed halą, z której dobiega zgrzyt metalu o metal. Uzbrojona w dyktafon wchodzisz do fabryki."
  ],

  jakGrac: [
    "Dotykaj ekranu, żeby czytać dalej. Potem wybierz jedną odpowiedź.",
    "EGO Zextera (na starcie wysokie, bo to Zexter) spada, kiedy go trafiasz albo ośmieszasz. Pościg kończy się przy policyjnej blokadzie. Jeśli Ego spadnie tam do zera, Zexter jest tak upokorzony, że sam się poddaje. Jeśli nie, ucieka policji.",
    "POŚCIG mówi, jak blisko jest Zexter. Rośnie, kiedy panikujesz, prosisz albo stoisz w miejscu, a każdy dobry ruch daje ci trochę dystansu. Pościg 10 znaczy, że cię dogonił, i to jest przegrana. Między rundami Pościg spada, bo uciekasz dalej. Kiedy słychać jego oddech tuż za plecami, jest blisko.",
    "BONY {MARKA} dostajesz za dobre ruchy. Między rundami wymieniasz je w katalogu na patelnie. Każda patelnia odblokowuje nowe, mocniejsze ruchy.",
    "Patelnia Thermo-Signal ostrzega, kiedy robi się gorąco: z nią między rundami Pościg spada o 2, a nie o 1."
  ],

  ostrzezenie: ["Słyszysz jego oddech tuż za plecami. Jeszcze chwila i cię dogoni.", "Znowu słyszysz jego oddech tuż za plecami."],

  katalog: [
    { id: "nal", nazwa: "Naleśnikowa", cena: 2, opis: "Płaska, lekka, szybka. Do naleśników i do ciosów z nadgarstka." },
    { id: "gril", nazwa: "Grillowa", cena: 3, opis: "Dno w rowki. Zostawia na przeciwniku paski jak na steku z reklamy." },
    { id: "wok", nazwa: "Wok", cena: 4, opis: "Głęboki i dźwięczny. Do mieszania składników i sytuacji." },
    { id: "ing", nazwa: "Ingenio z odpinaną rączką", cena: 5, opis: "Klik i rączka zostaje w dłoni. Najmocniejsze ruchy na autostradzie i przy blokadzie." },
    { id: "thermo", nazwa: "Thermo-Signal", cena: 6, opis: "Wskaźnik czerwienieje, kiedy robi się gorąco. Ostrzega w porę: między rundami Pościg spada o 2, a nie o 1." }
  ],

  rundy: [
    /* ───────────── RUNDA 1 ───────────── */
    {
      nazwa: "Hala", tlo: "hala",
      plansza: "Opuszczona hala fabryki sprzętu kuchennego. Ktoś stoi w cieniu za maszynami. Na taśmie leży patelnia.",
      przegrana: {
        id: "zupa", jak: "Zexter odcina ci drogę do drzwi i łapie cię za kaptur.", tytul: "Zupa",
        tekst: "Zostajesz dożywotnią testerką jego zupy pomidorowej. W każdy czwartek. On pyta: „za słona?”. Odpowiedź jest zawsze zła. Przepis ma od babci i nie przyjmuje uwag."
      },
      sceny: [
        { k: [["n", "Hala jest wielka i ciemna. Taśmy produkcyjne stoją od lat. Za maszynami ktoś oddycha. Powoli, jakby miał na to cały etat."],
              ["n", "Na najbliższej taśmie leży patelnia. Jedna. Nowa. Jakby na ciebie czekała."]],
          o: [
            { t: "Podejść i wziąć patelnię. Dziennikarka bez sprzętu to tylko świadek.", e: -1, z: -1, b: 1,
              r: [["n", "Bierzesz patelnię {MARKA} z taśmy. Ważysz ją w dłoni."], ["t", "„Do 180 stopni. Solidny uchwyt.”"], ["n", "Z cienia dobiega ciche, urażone chrząknięcie."]] },
            { t: "Najpierw nagrać dźwięk. Dyktafon to też broń. Słaba, ale ma baterie.", e: 0, z: 1, b: 0,
              r: [["n", "Nagrywasz czterdzieści sekund oddychania. Materiał dowodowy klasy „sapanie”. Oddychanie się przybliża."], ["n", "Na wszelki wypadek bierzesz z taśmy patelnię {MARKA}."]] },
            { t: "Zawrócić. Artykuł można napisać z domu.", e: 0, z: 2, b: -1,
              r: [["n", "Drzwi zatrzaskują się metr przed twoim nosem."], ["z", "„Redakcja zamknięta, Alex.”"], ["n", "Wracasz do taśmy i bierzesz patelnię {MARKA}. Skoro już tu jesteś."]] }
          ] },
        { k: [["n", "Z mroku wychodzi mężczyzna w czarnej masce. Zatrzymuje się dwa metry od ciebie. Stoi tak, jak stoją ludzie, którzy ćwiczyli to przed lustrem."],
              ["z", "„Szukasz prawdy, Alex? Czy może szukasz czegoś, czego nie będziesz w stanie unieść?”"]],
          o: [
            { t: "„Unieść? Kilo dwieście. Unoszę jedną ręką.”", e: 0, z: 0, b: 1,
              r: [["z", "„…Nie mówiłem o patelni.”"], ["t", "„A szkoda. To jedyne w tej hali, co ma atest.”"]] },
            { t: "Rzucić się do ucieczki między maszyny.", e: 0, z: 2, b: -1,
              r: [["n", "Biegniesz czternaście metrów i trafiasz na ścianę. Zexter nawet się nie ruszył."], ["z", "„Lubię, kiedy rozgrzewka robi się sama.”"]] },
            { t: "„Imię, nazwisko, wiek. Do artykułu. I czy maska jest służbowa, czy prywatna.”", e: -1, z: -1, b: 0,
              r: [["z", "„Zexter.”"], ["t", "„Przez iks czy przez ka-es?”"], ["n", "Maska nie ma mimiki, ale coś pod nią drgnęło."]] },
            { t: "„Proszę mi nic nie robić.”", e: 1, z: 1, b: 0,
              r: [["z", "„Błaganie. Klasyka. Zaczynamy od klasyki.”"], ["n", "Robi krok w twoją stronę. Bez pośpiechu."]] }
          ] },
        { k: [["n", "Oglądasz patelnię pod światło. Jedyna żarówka w hali wisi akurat za jego plecami."],
              ["z", "„Większość ludzi błagałaby o litość. A ty oceniasz jakość naczyń kuchennych.”"]],
          o: [
            { t: "Odwrócić patelnię i poszukać czerwonej kropki.", e: 0, z: 0, b: 1,
              r: [["t", "„Jest wskaźnik. Czyli oryginał. Podróbki mają naklejkę.”"], ["z", "„Stoję tu z zamiarem pozbawienia cię życia.”"], ["t", "„Słyszałam. Chwilę.”"]] },
            { t: "„A pan wie, czemu patelnie są zawsze czarne albo czerwone?”", e: -1, z: -1, b: 1,
              r: [["z", "„…Nie.”"], ["t", "„Ja też nie. Liczyłam, że pan wie, skoro pan tu mieszka.”"], ["n", "Zexter przez chwilę naprawdę się nad tym zastanawia. To go kosztuje."]] },
            { t: "„Litości!” Skoro większość ludzi tak robi, to chyba działa.", e: 1, z: 2, b: -1,
              r: [["z", "„Nie działa.”"], ["n", "Mówi to łagodnie, jak urzędnik, który zamyka okienko."]] },
            { t: "Zapytać go o sens życia. Niech się wygada, zyskasz czas.", e: 0, z: 1, b: 0,
              r: [["n", "Zexter mówi siedem minut o ogniu, metalu i hartowaniu duszy. Czasu nie zyskałaś. On zyskał formę."]] }
          ] },
        { k: [["n", "Próbujesz odczytać napis na spodzie patelni. Cień Zextera pada dokładnie na nią."]],
          o: [
            { t: "„Odsuń się, blokujesz światło.”", e: -1, z: -1, b: 1,
              r: [["n", "Zexter robi krok w bok. Dopiero potem dociera do niego, że to zrobił."], ["z", "„Jesteś pierwszym człowiekiem w tym mieście, który prosi mnie o więcej światła.”"]] },
            { t: "Wygłosić wykład o warstwach powłoki.", e: 0, z: 0, b: 1,
              r: [["t", "„Warstwa bazowa, warstwa wzmacniająca, warstwa nieprzywierająca. Trzy. Pan ma jedną: maskę. I też się pan do niej przykleił.”"], ["z", "„Skończyłaś?”"], ["t", "„Jeszcze gwarancja.”"]] },
            { t: "Stać bez ruchu. Może cię nie zauważy.", e: 0, z: 2, b: 0,
              r: [["n", "Stoisz dwa metry przed nim, pod żarówką, z patelnią."], ["z", "„Widzę cię, Alex.”"]] },
            { t: "Schować się za patelnią.", e: 0, z: 1, b: -1,
              r: [["n", "Patelnia ma 28 centymetrów średnicy. Ty masz więcej."]] }
          ] },
        { k: [["z", "„Wszystko ma swoją temperaturę topnienia, Alex. Metal. Odwaga. Ty.”"]],
          o: [
            { t: "„Zalecana: 180 stopni. Margines bezpieczeństwa jest spory. Może 300 by ją uszkodziło.”", e: 0, z: 0, b: 1,
              r: [["z", "„Mówię o TOBIE.”"], ["t", "„Ja nie mam instrukcji. Proszę mówić o patelni, tu przynajmniej są dane.”"]] },
            { t: "„Przerwa na reklamę. Patelnie {MARKA}: grzeją równo, nie krzyczą, nie noszą masek.”", e: -1, z: -1, b: 2,
              r: [["n", "Zexter otwiera usta pod maską. Zamyka. W tej hali nikt mu jeszcze nie puścił bloku reklamowego."]] },
            { t: "Kopnąć mu pod nogi wiadro z mopem {MOP}. Wody nikt nie zmieniał od zamknięcia fabryki.", e: -1, z: -1, b: 2,
              r: [["n", "W wiadrze od lat trwa nowy etap ewolucji: mętna woda, detergent i zielone grudki nieznanego życia biologicznego."], ["n", "Zexter ślizga się na zupełnie nowym gatunku. Płaszcz chłonie zapach stęchlizny."], ["z", "„Co to… co to JEST?”"], ["t", "„Nie wiem. Nauka też jeszcze nie.”"]] },
            { t: "Rozpłakać się. Taktycznie.", e: 1, z: 2, b: -1,
              r: [["z", "„Łzy. Parują w stu stopniach.”"], ["n", "Nie pomogło. A makijaż trzeba będzie poprawić."]] }
          ] },
        { k: [["n", "Zexter rusza na ciebie. Wolno i szeroko, jak szafa trzydrzwiowa z zamiarami. Obok na półce stoi rząd woków."]],
          o: [
            { t: "Patelnią w głowę. Płasko, żeby nie porysować.", e: -1, z: -1, b: 1,
              r: [["n", "Dźwięk jest czysty jak kamerton. Zexter robi dwa kroki w tył i ogląda gwiazdki. Ty oglądasz dno. Ani rysy."]] },
            { t: "Krawędzią pod kolana.", e: 0, z: 0, b: 1,
              r: [["n", "Zexter składa się jak leżak plażowy."], ["z", "„To nie tak… to nie miało tak wyglądać!”"]] },
            { t: "Wok z półki na jego głowę. I patelnią w wok.", e: -2, z: -1, b: 2,
              r: [["n", "Wok siada na masce jak ulał. Uderzasz w niego patelnią. Hala odpowiada echem przez dziewięć sekund."], ["z", "„Co ty…”"], ["t", "„Nie powstrzymuj mnie od opisania monumentalnego kroku ludzkości w dziedzinie przyborów kuchennych!”"], ["z", "„To nie tak… to nie miało tak wyglądać!”"]] },
            { t: "Negocjować. „Może kawy?”", e: 0, z: 2, b: 0,
              r: [["z", "„Kawy nie pijam po trzeciej.”"], ["n", "Łapie cię za kaptur. Wyrywasz się w ostatniej chwili i zostawiasz mu kaptur."]] }
          ] }
      ]
    },

    /* ───────────── RUNDA 2 ───────────── */
    {
      nazwa: "Sterownia", tlo: "sterownia",
      plansza: "Uciekasz po schodach do przeszklonej sterowni. Zexter idzie za tobą bez pośpiechu. Wie, że sterownia ma tylko jedne drzwi.",
      przegrana: {
        id: "taniec", jak: "Drzwi sterowni puszczają. Zexter staje w progu i otrzepuje rękawy.", tytul: "Kurs tańca",
        tekst: "Zexter zapisuje cię jako swoją partnerkę na kurs tańca towarzyskiego. Poziom zaawansowany. Zgłoszenie już poszło. Pierwsze zajęcia we wtorek: tango. On prowadzi. Maski nie zdejmuje nawet na pokazie końcowym."
      },
      sceny: [
        { k: [["n", "Sterownia. Szyba na całą ścianę, a pod nią pulpit z setkami przycisków. Żaden nie jest podpisany. Ktoś kiedyś bardzo ufał załodze."],
              ["n", "Na schodach słychać kroki. Spokojne i równe, jak metronom."]],
          o: [
            { t: "Włączyć wszystko. Obiema rękami, jak na pianinie.", e: -1, z: -1, b: 1,
              r: [["n", "Hala budzi się do życia. Taśmy ruszają, lampy mrugają, gdzieś startuje wentylator, którego nikt nie prosił."]] },
            { t: "Szukać przycisku „STOP”.", e: 0, z: 1, b: 0,
              r: [["n", "Znajdujesz „STOP”. Wszystko i tak stoi. Naciskasz dla porządku. Dalej stoi. Kroki są bliżej."]] },
            { t: "Schować się pod pulpitem.", e: 0, z: 1, b: -1,
              r: [["n", "Pod pulpitem jest kurz, kabel i kanapka z 1998 roku."], ["z", "„Widzę buty, Alex.”"]] },
            { t: "Naleśnikową po wszystkich przyciskach naraz. Płaska, obejmie więcej.", w: "nal", e: -2, z: -1, b: 1,
              r: [["n", "Jeden ruch, czterdzieści przycisków. Hala rusza z kopyta. Naleśnikowa nawet się nie zagrzała."]] }
          ] },
        { k: [["n", "Obudzony po latach pulpit łapie kontakt i taśmy same ruszają. Garnki, których nikt nie odebrał, zjeżdżają na beton jeden po drugim. Kakofonia blachy."],
              ["z", "„Przestań… Wyłącz to, ty mały szczurze!”"],
              ["n", "Trzyma się za głowę. Hala zostawiła mu po sobie pamiątkę."]],
          o: [
            { t: "Przyspieszyć taśmy. Jest pokrętło z napisem „NIE RUSZAĆ”.", e: -1, z: -1, b: 1,
              r: [["n", "Ruszasz. Garnki zaczynają spadać w rytmie, który przypomina disco polo. Zexter klęka."]] },
            { t: "Wyłączyć. Poprosił przecież.", e: 1, z: 2, b: -1,
              r: [["n", "W ciszy Zexter prostuje się i strzepuje kurz z rękawa."], ["z", "„Grzeczna. To ci nie pomoże.”"]] },
            { t: "„To nie szczur, to prasa. Proszę o sprostowanie.”", e: 0, z: 0, b: 1,
              r: [["z", "„SPROSTOWANIE?!”"], ["n", "Kolejny rondel ląduje mu pod nogami. Sprostowania nie będzie."]] },
            { t: "Dorzucić na taśmę grillową. Niech leci z resztą.", w: "gril", e: -2, z: -1, b: 1,
              r: [["n", "Grillowa zjeżdża z taśmy i trafia go w maskę. Zostają paski. Równe, jak z reklamy steków."], ["n", "Patelnia wraca do ciebie taśmą powrotną. Fabryka dba o obieg."]] }
          ] },
        { k: [["n", "Na pulpicie leży megafon. Bateria, o dziwo, działa."]],
          o: [
            { t: "„Przepraszam, mam kuchenne PTSD!”", e: -1, z: -1, b: 1,
              r: [["n", "Twój głos niesie się po całej hali."], ["z", "„PTSD…? Zrobię ci takie PTSD…”"], ["n", "Nie kończy. Kończy mu się powietrze na schodach."]] },
            { t: "„Uwaga, uwaga. Właściciel czarnej maski proszony jest do kasy numer trzy.”", e: -1, z: -1, b: 2,
              r: [["n", "Zexter odruchowo rozgląda się za kasą numer trzy. Nienawidzi się za to."]] },
            { t: "Zaśpiewać przez megafon. Cokolwiek.", e: 0, z: 0, b: 0,
              r: [["n", "Śpiewasz. Zexter cierpi, ale złość dodaje mu sił. Sztuka zawsze kosztuje."]] },
            { t: "Krzyknąć „RATUNKU”.", e: 1, z: 1, b: 0,
              r: [["n", "Echo odpowiada „…unku”. Poza echem w fabryce jesteście tylko wy dwoje."], ["z", "„Nikt nie przyjdzie, Alex.”"]] }
          ] },
        { k: [["n", "Zexter jest w połowie schodów. W sterowni masz: instrukcję BHP z 1987 roku, gaśnicę i kubek z napisem „Najlepszy brygadzista”."],
              ["z", "„Już prawie jestem, Alex.”"]],
          o: [
            { t: "Gaśnica. Zawleczka, dźwignia, piana.", e: -1, z: -1, b: 1,
              r: [["n", "Zexter znika w białej chmurze. Wyłania się z niej jak bałwan z ambicjami."], ["z", "„To… to się nie spiera!”"], ["t", "„Spiera. Czterdzieści stopni, program delikatny.”"]] },
            { t: "Przeczytać mu instrukcję BHP. Od paragrafu pierwszego.", e: 0, z: 0, b: 1,
              r: [["t", "„Paragraf pierwszy. Na schodach trzymamy się poręczy.”"], ["n", "Zexter łapie poręcz. Puszcza ją z obrzydzeniem. Znowu łapie, bo schody są strome."]] },
            { t: "Rzucić kubkiem.", e: 0, z: 1, b: -1,
              r: [["n", "Kubek odbija się od maski i zostaje cały. „Najlepszy brygadzista” ląduje u jego stóp."], ["z", "„Dziękuję. Zawsze chciałem taki mieć.”"]] },
            { t: "Postawić na szczycie schodów suszarkę z praniem, która stoi w kącie sterowni. Ktoś rozwiesił fartuchy w 1998 roku i nie wrócił.", e: -1, z: -1, b: 1,
              r: [["z", "„Suszarka… z praniem? Serio? To ma być bariera?”"], ["n", "Stoi przed nią i nie przechodzi. Nikt nie przechodzi przez cudze pranie."]] },
            { t: "Puścić wok po schodach. Jak sanki.", w: "wok", e: -2, z: -1, b: 1,
              r: [["n", "Wok zjeżdża po stopniach, podcina Zextera i wiezie go na dół. Robi przy tym dźwięk dzwonu Zygmunta."], ["n", "Po minucie Zexter wraca na górę z wokiem w rękach i odruchowo ci go oddaje. Potem długo nad tym myśli."]] }
          ] },
        { k: [["n", "Drzwi sterowni drżą. Zamek trzyma, ale nie ma do tego przekonania."],
              ["z", "„Otwórz. Chcę ci tylko pokazać, jak wygląda prawdziwy ogień.”"]],
          o: [
            { t: "Przez megafon: regulamin hali. Punkt po punkcie.", e: 0, z: 0, b: 1,
              r: [["t", "„Punkt czwarty. Osobom postronnym wstęp wzbroniony. Punkt piąty. Zakaz pracy w nakryciu twarzy utrudniającym identyfikację.”"], ["z", "„Ja tu nie pracuję!”"], ["t", "„Tym gorzej. Punkt czwarty.”"]] },
            { t: "„Przerwa na reklamę. Czy twoja patelnia też cię zawodzi w kluczowym momencie?”", e: -1, z: -1, b: 2,
              r: [["n", "Za drzwiami zapada cisza."], ["z", "„…Czasem.”"], ["n", "Powiedział to bardzo cicho. Zanotowałaś."]] },
            { t: "Otworzyć. Może naprawdę chce tylko pokazać.", e: 1, z: 2, b: -1,
              r: [["n", "Nie chciał tylko pokazać. Zatrzaskujesz drzwi w ostatniej chwili. Zamek obraża się na dobre."]] },
            { t: "Zapytać, jaki ogień. Gaz czy indukcja?", e: 0, z: 1, b: 0,
              r: [["z", "„OGIEŃ. Żywy. Pierwotny.”"], ["t", "„Czyli gaz. Na indukcji {MARKA} też działa, mówię na przyszłość.”"], ["n", "Drzwi dostają kopniaka."]] }
          ] },
        { k: [["n", "Za szafą z dokumentami są zapasowe schody do magazynu. Zexter o nich nie wiedział. Ty też nie. Za drzwiami zrobiło się podejrzanie cicho."]],
          o: [
            { t: "„Czy jeszcze żyjesz? Bo zaczynam się martwić.”", e: -1, z: -1, b: 1,
              r: [["z", "„Ciągle żyję, Alex…”"], ["n", "Głos ma zmęczony. Tak brzmi człowiek, który planował inny wieczór."]] },
            { t: "Podpiąć do klamki wystrzępiony kabel od czajnika. I uprzejmie ostrzec.", e: -1, z: -1, b: 1,
              r: [["t", "„Klamka jest pod prądem. Proszę pamiętać, bo zepsułby pan sobie zabawę.”"], ["n", "Światła mrugają złowieszczo. Zexter cofa rękę i odsuwa się od drzwi o dwa kroki."], ["z", "„Sprytne, szczurze.”"]] },
            { t: "Wrócić po dyktafon, który został na pulpicie.", e: 0, z: 1, b: 0,
              r: [["n", "Dyktafon nagrał dwadzieścia minut spadających garnków. Wracając po niego, mijasz drzwi. Drzwi właśnie puszczają."]] },
            { t: "Poczekać, aż sam sobie pójdzie.", e: 0, z: 1, b: -1,
              r: [["n", "Nie poszedł sobie. Tacy nie mają dokąd."]] },
            { t: "Wsunąć mu naleśnikową pod drzwi. Rozpędzoną.", w: "nal", e: -2, z: -1, b: 1,
              r: [["n", "Naleśnikowa sunie po podłodze jak krążek hokejowy. Zza drzwi słychać „au” i podskakiwanie na jednej nodze."], ["n", "Odbija się od jego buta i wraca pod twoje nogi. Sprzęt z charakterem."]] }
          ] }
      ]
    },

    /* ───────────── RUNDA 3 ───────────── */
    {
      nazwa: "Magazyn", tlo: "magazyn",
      plansza: "Labirynt regałów pełnych kartonów. Kilka żarówek. Zexter wchodzi za tobą i nasłuchuje.",
      przegrana: {
        id: "kregle", jak: "Zexter wyrasta zza regału i zastawia ci przejście wózkiem paletowym.", tytul: "Kręgle",
        tekst: "Przyjmuje cię do swojej drużyny kręglarskiej „Czarne Maski”. Bez prawa wypowiedzenia. Treningi w środy. Wszyscy grają w maskach. Przegrywacie każdy mecz."
      },
      sceny: [
        { k: [["n", "Regały po sufit, kartony po horyzont. Świecą się trzy żarówki, z czego jedna tylko z grzeczności."],
              ["z", "„Czuję twój zapach… zapach strachu zmieszany z nowością twojej patelni.”"]],
          o: [
            { t: "„To nie strach. To fabryczna powłoka ochronna. Schodzi po pierwszym myciu.”", e: -1, z: -1, b: 1,
              r: [["z", "„…Z patelni czy z ciebie?”"], ["t", "„Z patelni. Mnie się nie da domyć.”"]] },
            { t: "Wstrzymać oddech i nie ruszać się.", e: 0, z: 1, b: 0,
              r: [["n", "Wytrzymujesz czterdzieści sekund. Potem nabierasz powietrza z dźwiękiem odkurzacza."]] },
            { t: "Rzucić pokrywką w drugi koniec magazynu, dla zmyłki.", e: 0, z: 0, b: 1,
              r: [["n", "Zexter idzie za dźwiękiem i zwiedza dział sitek. Długo."]] },
            { t: "Nagrać na dyktafon nagłówek do artykułu. Szeptem.", e: 0, z: 1, b: -1,
              r: [["n", "„MORDERCA W FABRYCE”, nagrywasz szeptem. Sprawdzasz, czy się nagrało. Dyktafon odtwarza to na cały regał."]] }
          ] },
        { k: [["n", "Przed tobą otwarte kartony: rondle, tarki, sitka i żelazka. W ścianie jest gniazdko. Kroki są dwa regały stąd."]],
          o: [
            { t: "Rondle. Ustawić z nich wieżę na jego drodze.", e: 0, z: 0, b: 1,
              r: [["n", "Wieża z rondli stoi cztery sekundy. Potem Zexter w nią wchodzi. Łoskot niesie się po magazynie, a jego godność po podłodze."]] },
            { t: "Tarki. Rozsypać na podłodze, ostrym do góry.", e: -1, z: -1, b: 1,
              r: [["z", "„Au. Au. Co to… AU.”"], ["n", "Idzie dalej, ale na palcach. Morderca na palcach traci połowę grozy."]] },
            { t: "Sitko. Założyć na głowę jako hełm.", e: 0, z: 1, b: -1,
              r: [["n", "W sitku widać cię przez wszystkie dziurki. Do tego wyglądasz głupio."], ["z", "„Twarzowe.”"]] },
            { t: "Żelazko. Do gniazdka i strzał pary prosto w maskę.", e: -1, z: -1, b: 2,
              r: [["n", "Maska zaparowuje od środka. Zexter cofa się na oślep. Zza regału wyjeżdża robot sprzątający, który akurat zaczął zmianę. Zexter siada na nim i odjeżdża dwa metry."], ["t", "„Nie masz pojęcia, jak niebezpieczne jest życie gospodyni domowej.”"]] },
            { t: "Wokiem zamieszać sitka z tarkami i podać mu pod nogi.", w: "wok", e: -2, z: -1, b: 1,
              r: [["n", "Mieszasz energicznie, jak w przepisie. Zexter wjeżdża w to danie obiema nogami. Ląduje w dziale ścierek."]] }
          ] },
        { k: [["n", "Zexter wali pięścią w metalową szafkę. Raz. Dwa. Trzy. Chce cię spłoszyć."],
              ["z", "„Wyjdź, wyjdź, gdziekolwiek jesteś…”"]],
          o: [
            { t: "Odpowiedzieć tym samym rytmem. Patelnią w regał.", e: -1, z: -1, b: 2,
              r: [["n", "Stuk, stuk, stuk. Zexter zamiera. Stuka dwa razy. Odpowiadasz dwa razy. Przez chwilę gracie razem i jest to, niestety, całkiem niezłe."], ["z", "„…Nie. Nie będziemy mieli zespołu.”"]] },
            { t: "Siedzieć cicho.", e: 0, z: 0, b: 0,
              r: [["n", "Siedzisz cicho. On wali dalej. Szafka cierpi za was oboje."]] },
            { t: "Wybiec z krzykiem.", e: 1, z: 1, b: -1,
              r: [["n", "Wybiegasz z krzykiem prosto w dział garnków. Garnki też krzyczą."], ["z", "„Działa za każdym razem.”"]] },
            { t: "„Proszę nie niszczyć mienia. Ta szafka ma numer inwentarzowy.”", e: 0, z: 0, b: 1,
              r: [["n", "Zexter patrzy na szafkę. Rzeczywiście ma numer. Opuszcza pięść, zanim zdąży pomyśleć dlaczego."]] },
            { t: "Naleśnikową jak frisbee, między regałami.", w: "nal", e: -2, z: -1, b: 1,
              r: [["n", "Leci płasko i cicho. Trafia go w ucho, odbija się od szafki i ląduje ci pod nogami."]] }
          ] },
        { k: [["n", "Opierasz się o regał. Regał się kiwa. Sprawdzasz: żadnych mocowań do ściany, żadnych kotew."],
              ["t", "„Najwyraźniej zapomnieli tu o wszystkich zasadach BHP.”"],
              ["n", "Zexter staje dokładnie pod nim."]],
          o: [
            { t: "Pchnąć. Teraz.", e: -1, z: -1, b: 1,
              r: [["n", "Regał myśli o tym przez sekundę. Potem się zgadza."]] },
            { t: "Najpierw poszukać protokołu BHP. Porządek musi być.", e: 0, z: 1, b: 1,
              r: [["n", "Protokół wisi na regale. Ostatni przegląd: 1994, wynik: „ujdzie”. Zanim doczytasz podpis, Zexter robi dwa kroki w twoją stronę. Pchasz w ostatniej chwili."]] },
            { t: "Ostrzec go. Jesteś dziennikarką, nie potworem.", e: 1, z: 2, b: -1,
              r: [["t", "„Proszę uważać, regał!”"], ["z", "„Dziękuję.”"], ["n", "Odsuwa się o krok. Regał i tak leci, ale trafia go tylko w połowie. Zmarnowałaś pół regału."]] },
            { t: "Podważyć nogę regału grillową. Dźwignia, fizyka, paski.", w: "gril", e: -2, z: -1, b: 1,
              r: [["n", "Archimedes miał rację. Regał idzie jak po maśle, a grillowa nawet się nie wygięła."]] }
          ] },
        { k: [["n", "Lawina. Garnki, rondle, brytfanny i jeden zagubiony szybkowar schodzą na Zextera jak rachunek sumienia."],
              ["n", "Cisza. Spod sterty kartonów wysuwa się ręka w czarnej rękawiczce."]],
          o: [
            { t: "Uścisnąć ją. „Gratuluję, wygrał pan komplet klamerek {MOP}.”", e: -1, z: -1, b: 1,
              r: [["n", "Ręka przez chwilę oddaje uścisk. Odruch. Potem zaciska się w pięść, ale już po wszystkim."]] },
            { t: "Położyć na ręce pokrywkę. Żeby nie wystygł.", e: 0, z: 0, b: 1,
              r: [["z", "„Zdejmij. To.”"], ["t", "„Trzymam ciepło. O gości się dba.”"]] },
            { t: "Pomóc mu wstać.", e: 1, z: 2, b: -1,
              r: [["n", "Ciągniesz. Wstaje. Otrzepuje się. Jest wyższy, niż zapamiętałaś, i znacznie mniej wdzięczny, niż zakładałaś."]] },
            { t: "Zrobić zdjęcie do artykułu. Z fleszem.", e: 0, z: 0, b: 0,
              r: [["n", "Flesz. Ręka pokazuje gest, którego redakcja nie puści."]] },
            { t: "Przykryć stertę wokiem i zapukać.", w: "wok", e: -2, z: -1, b: 1,
              r: [["t", "„Halo, jest tam kto?”"], ["z", "„…Nie ma.”"]] }
          ] },
        { tlo: "parking", k: [["n", "Parking za magazynem. Stara, zardzewiała furgonetka dostawcza, na pace palety patelni do wysyłki, której nikt nie odebrał. Kluczyków brak. Z magazynu dobiega głos Zextera."],
              ["z", "„Jeszcze nie skończyliśmy śniadania, Alex…”"]],
          o: [
            { t: "Odpalić na krótko. Widziałaś to w filmie dokumentalnym.", e: 0, z: 0, b: 1,
              r: [["n", "Dwa kabelki, iskra, silnik. Film dokumentalny był o złodziejach samochodów. Edukacja zawsze się zwraca."]] },
            { t: "„Śniadanie podaje się od siódmej. Jest trzecia czterdzieści.”", e: -1, z: -1, b: 1,
              r: [["z", "„To BRUNCH!”"], ["n", "Krzyczy to z głębi magazynu, zza regałów. Brunch brzmi stamtąd wyjątkowo słabo. Odpalasz furgonetkę na krótko."]] },
            { t: "Poszukać kluczyków w magazynie.", e: 0, z: 1, b: -1,
              r: [["n", "Kluczyki wiszą na haczyku przy drzwiach magazynu. Z tych drzwi właśnie wychodzi Zexter. Wracasz biegiem i odpalasz na krótko."]] },
            { t: "Uciekać pieszo. Autostrada jest niedaleko.", e: 0, z: 1, b: 0,
              r: [["n", "Biegniesz dwieście metrów. Autostrada jest niedaleko samochodem. Wracasz do furgonetki zdyszana, a on już otrzepuje rękawy."]] }
          ] }
      ]
    },

    /* ───────────── RUNDA 4 ───────────── */
    {
      nazwa: "Autostrada", tlo: "autostrada",
      plansza: "Pusta autostrada, stara furgonetka, za tobą czarny SUV. Z tyłu, na pace, palety nowiutkich patelni.",
      przegrana: {
        id: "mielno", jak: "Na wyboju pęka opona. Furgonetka staje na poboczu, a SUV parkuje tuż za nią. Zexter otwiera ci drzwi jak szofer.", tytul: "Mielno",
        tekst: "Zexter zmusza cię do obejrzenia filmów z wakacji w Mielnie. Cztery godziny. Z komentarzem. Najdłuższy fragment to dwadzieścia minut parawanu. „Tu nic się nie dzieje, ale poczekaj.”"
      },
      sceny: [
        { k: [["n", "W lusterku dwa światła. Czarny SUV, coraz bliżej. Radio trzeszczy, choć go nie włączałaś."],
              ["z", "„Myślisz, że teflon chroni przed wszystkim, Alex?”"]],
          o: [
            { t: "„Przed przywieraniem. Od pana chroni mnie dystans i pedał gazu.”", e: 0, z: 0, b: 1,
              r: [["n", "Wciskasz gaz. Furgonetka przyspiesza z godnością wersalki."]] },
            { t: "Zmienić stację.", e: -1, z: -1, b: 1,
              r: [["n", "Lecą notowania skupu żywca. Zexter próbuje się przebić przez tuczniki klasy E. Nie daje rady."]] },
            { t: "Wdać się w dyskusję o granicach ochrony.", e: 0, z: 1, b: 0,
              r: [["n", "Dyskutujecie przez trzy kilometry. On ma przygotowane cytaty. SUV jest już na zderzaku."]] },
            { t: "Wyłączyć radio i udawać, że nikogo nie ma.", e: 0, z: 1, b: -1,
              r: [["n", "Radio włącza się samo."], ["z", "„To niegrzeczne.”"]] },
            { t: "Odpiąć rączkę Ingenio i przestawić nią gałkę radia. Z fasonem.", w: "ing", e: -2, z: -1, b: 1,
              r: [["n", "Klik. Rączka w dłoni, patelnia na siedzeniu. Przełączasz na audycję dla działkowców. Zexter słucha o przycinaniu porzeczek i gaśnie."]] }
          ] },
        { k: [["n", "Znak: „Ostatni zjazd przed tunelem — 500 m”. SUV mruga długimi."]],
          o: [
            { t: "Zjazd. W tunelu nie ma zasięgu ani świadków.", e: 0, z: 0, b: 1,
              r: [["n", "Skręcasz w ostatniej chwili, objeżdżasz rondo i wracasz na autostradę. SUV wpada prosto do tunelu i musi szukać, gdzie zawrócić. Masz kilometr przewagi."]] },
            { t: "Tunel. Będzie klimatycznie.", e: 0, z: 2, b: -1,
              r: [["n", "W tunelu gaśnie radio, zasięg i nadzieja. Zexter mruga światłami do rytmu. Zna ten tunel."]] },
            { t: "Zwolnić. Może wyprzedzi i pojedzie dalej.", e: 1, z: 1, b: 0,
              r: [["n", "Nie wyprzedza. Jedzie za tobą trzydzieści na godzinę i jest mu z tym dobrze."]] },
            { t: "Włączyć kierunkowskaz w lewo, zjechać w prawo.", e: -1, z: -1, b: 1,
              r: [["n", "Zexter, człowiek zasad, ustępuje ci lewy pas. Zjeżdżasz prawym. Słychać, jak wali pięścią w kierownicę."]] }
          ] },
        { k: [["n", "W schowku leży telefon służbowy fabryki. Jedna kreska zasięgu. Wybierasz numer alarmowy."],
              ["d", "„Numer alarmowy, słucham. Proszę podać lokalizację.”"],
              ["n", "Zexter zrównuje się z tobą i opuszcza szybę."]],
          o: [
            { t: "Przez okno: „Nie oddam ci mojej patelni!”", e: -1, z: -1, b: 1,
              r: [["d", "„…Proszę pani, czy to jest zgłoszenie?”"], ["t", "„Tak. Autostrada, czarny SUV, maska, zamiary.”"], ["d", "„A patelnia?”"], ["t", "„Patelnia jest po mojej stronie.”"]] },
            { t: "Podać spokojnie: kilometr, kierunek, opis pojazdu.", e: 0, z: 0, b: 2,
              r: [["d", "„Wysyłam patrole. Czy sprawca jest uzbrojony?”"], ["t", "„W przekonania.”"], ["n", "Zexter słyszy każde słowo. Podnosi szybę. Obrażony."]] },
            { t: "Rozłączyć się. Nie chcesz robić kłopotu.", e: 0, z: 2, b: -1,
              r: [["n", "Dyspozytor oddzwania. Odbiera… radio."], ["z", "„Pomyłka.”"], ["n", "Dzwonisz jeszcze raz. Tym razem mówisz wszystko, szybko."]] },
            { t: "Poprosić dyspozytora o przepis na coś szybkiego.", e: 0, z: 1, b: 0,
              r: [["d", "„Jajecznica. Trzy minuty. A teraz lokalizacja.”"], ["n", "Podajesz. Patrole wyjadą, ale trzy minuty później."]] },
            { t: "Wystawić grillową przez okno. Jako lusterko z funkcją odstraszania.", w: "gril", e: -2, z: -1, b: 1,
              r: [["n", "Zexter widzi w niej swoją maskę. W paski. Odbija kierownicą."], ["d", "„Halo? Słyszę pisk opon.”"], ["t", "„To nie moje.”"]] }
          ] },
        { k: [["n", "SUV uderza cię w bok. Raz, potem drugi. Furgonetka tańczy po pasach."],
              ["z", "„Zjeżdżaj, Alex. Koniec trasy.”"]],
          o: [
            { t: "Slalom. Między pasami, jak między regałami.", e: 0, z: 0, b: 1,
              r: [["n", "Furgonetka kładzie się w zakrętach, patelnie na pace grają jak dzwonki. SUV próbuje powtórzyć i zalicza pachołek."]] },
            { t: "Zahamować ostro. Niech sobie jedzie.", e: -1, z: -1, b: 1,
              r: [["n", "SUV wylatuje do przodu. Przez chwilę to ty go gonisz. Zexter patrzy w lusterko i nie wie, jak się w tej roli zachować."]] },
            { t: "Zjechać na pobocze i porozmawiać jak dorośli.", e: 1, z: 2, b: -1,
              r: [["n", "Zjeżdżasz. On też. Wysiada. Nie wygląda na kogoś, kto przyszedł rozmawiać. Ruszasz z piskiem, ale było blisko."]] },
            { t: "Zatrąbić na niego.", e: 0, z: 1, b: 0,
              r: [["n", "Klakson furgonetki gra pierwsze takty „Sto lat”. Fabryka miała poczucie humoru. Zexter nie ma."]] },
            { t: "Ingenio bez rączki pod pedał gazu. Tempomat domowej roboty.", w: "ing", e: -2, z: -1, b: 1,
              r: [["n", "Patelnia trzyma gaz, ty trzymasz kierownicę obiema rękami. Furgonetka pierwszy raz w życiu przekracza sto dziesięć."]] }
          ] },
        { tlo: "palety", k: [["n", "Na wyboju puszczają tylne drzwi. Pierwsza paleta patelni zsuwa się z paki i wisi nad jezdnią na ostatnim pasie transportowym. Druga stoi dalej w środku, przypięta na słowo honoru."]],
          o: [
            { t: "Szarpnąć kierownicą. Niech ostatni pas sam zdecyduje.", e: -1, z: -1, b: 1,
              r: [["n", "Furgonetka przechyla się i pas pęka. Dwieście patelni wysypuje się na maskę SUV-a. Brzmi to jak grad na blaszanym dachu."], ["z", "„To jest… marnotrawstwo dobrego sprzętu! Teraz mam dwa powody, żeby cię dorwać!”"]] },
            { t: "Zatrzymać się i zamknąć drzwi. Towar jest na stanie.", e: 0, z: 1, b: -1,
              r: [["n", "Stajesz na awaryjnych, biegniesz do tyłu i zatrzaskujesz drzwi na wiszącej palecie. Trzyma. Podpisujesz w myślach protokół. SUV parkuje za tobą, równiutko. Ruszasz, zanim wysiądzie."]] },
            { t: "Rzucać przez okno tym, co leży na siedzeniu pasażera.", e: 0, z: 0, b: 0,
              r: [["n", "Leci termos, mapa samochodowa i ulotka z pizzerii. Trafiasz co trzecią rzeczą. Zexter włącza wycieraczki."]] },
            { t: "Krzyknąć: „Promocja! Bierz, ile chcesz!”", e: 0, z: 1, b: 1,
              r: [["n", "Zexter nie zwalnia. Ale widzisz, że zerknął na cenę."]] },
            { t: "Wyrzucić wok przez okno. Wysoko, nad SUV-a.", w: "wok", e: -2, z: -1, b: 1,
              r: [["n", "Wok ląduje na dachu, dnem do góry, i tam zostaje. SUV wygląda jak radiowóz z krainy garów. Zexter jeszcze o tym nie wie."]] }
          ] },
        { tlo: "palety", k: [["n", "SUV dymi, ale siedzi ci na zderzaku. Na wyboju tylne drzwi znowu się otwierają. W środku stoi jeszcze paleta i karton z napisem „AKCESORIA DO GRILLA”."],
              ["z", "„Twoja kuchnia zaczyna mnie nudzić!”"]],
          o: [
            { t: "Hamowanie pulsacyjne. Niech paleta sama zjedzie.", e: -1, z: -1, b: 1,
              r: [["n", "Hamulec, gaz, hamulec. Paleta zsuwa się idealnie pod jego koła. SUV podskakuje jak na progach zwalniających, tylko dwieście razy."]] },
            { t: "Dodać gazu na wyboju. Karton z akcesoriami do grilla sam wyskoczy z paki.", e: -1, z: -1, b: 2,
              r: [["n", "Karton wylatuje jak z procy. Szczypce, ruszt i szpikulce znikają pod maską SUV-a. Silnik zaczyna pachnieć karkówką."]] },
            { t: "„Nudzi? To proszę zmienić kanał.” I nic nie robić.", e: 0, z: 1, b: 0,
              r: [["n", "Riposta dobra. Ale SUV właśnie wjeżdża ci w zderzak i riposta zostaje w lusterku."]] },
            { t: "Przeprosić za bałagan na drodze.", e: 1, z: 1, b: -1,
              r: [["z", "„Przeprosiny przyjęte. Wyrok bez zmian.”"]] },
            { t: "Odpiąć rączkę i wyrzucić Ingenio przez okno, płasko, na asfalt.", w: "ing", e: -2, z: -1, b: 1,
              r: [["n", "Patelnia bez rączki sunie jak kamień curlingowy i wchodzi mu pod przednie koło. Opona mówi „pssst”."], ["t", "„Gwarancja tego nie obejmuje.”"], ["n", "W schowku leży druga, z gwarancji. Fabryka myślała o wszystkim."]] }
          ] }
      ]
    },

    /* ───────────── RUNDA 5 ───────────── */
    {
      nazwa: "Blokada", tlo: "blokada",
      plansza: "Na horyzoncie radiowozy. Zostało 600 metrów. SUV za tobą dymi, ale jedzie.",
      przegrana: {
        id: "pluszaki", jak: "Trzysta metrów przed blokadą furgonetce kończy się paliwo. Zexter wyciąga cię z kabiny, zanim policja zdąży mrugnąć.", tytul: "Pluszaki",
        tekst: "Zexter zabiera cię do domu, żeby pokazać kolekcję. 340 pluszaków. Każdy ma imię, datę adopcji i historię. Opowiada o wszystkich. Kończy o szóstej rano na misiu Ryszardzie. Następnej nocy zaczyna od nowa, bo „Ryszard ma jeszcze rodzeństwo”."
      },
      sceny: [
        { k: [["n", "Na horyzoncie niebieskie światła. Radiowozy stoją w jodełkę, jak na pokazie."],
              ["z", "„Oni tylko oświetlają mi drogę do ciebie!”"]],
          o: [
            { t: "„To proszę jechać za światłem. Do samego końca.”", e: 0, z: 0, b: 1,
              r: [["n", "Zexter przyspiesza. Prosto na blokadę. Sam, z własnej woli, z uśmiechem pod maską."]] },
            { t: "Mrugnąć policji długimi. Trzy krótkie, trzy długie, trzy krótkie.", e: 0, z: 0, b: 1,
              r: [["n", "Policjanci odmrugują. Nie znacie tego samego alfabetu, ale intencja doszła."]] },
            { t: "Zwolnić przed blokadą, żeby nie przeszkadzać.", e: 0, z: 2, b: -1,
              r: [["n", "Zwalniasz. SUV nie. Zderzak furgonetki dostaje nowy kształt."]] },
            { t: "Pomachać mu w lusterku.", e: -1, z: -1, b: 0,
              r: [["n", "Machasz. Zexter odmachuje. Potem patrzy na własną rękę, jakby go zdradziła."]] },
            { t: "Naleśnikową puścić zajączka od reflektorów. Prosto w jego oczy.", w: "nal", e: -2, z: -1, b: 1,
              r: [["n", "Płaskie dno, czysta powłoka, odbicie jak z lustra. Zexter jedzie przez chwilę na pamięć."]] }
          ] },
        { k: [["n", "Na pace zostało już tylko to, co wypadło z kartonów: sztućce i małe patelnie, takie na jedno jajko, luzem na podłodze. Do blokady coraz bliżej."]],
          o: [
            { t: "Zahamować raz, mocno. Wszystko zjedzie mu pod koła.", e: -1, z: -1, b: 1,
              r: [["n", "Widelce robią swoje. Opona SUV-a pęka z hukiem. Małe patelnie turlają się poboczem jak stado spłoszonych jeży."]] },
            { t: "Przyhamować delikatnie. Może wysypie się tylko trochę.", e: 0, z: 1, b: 0,
              r: [["n", "Wysypują się same łyżeczki. Dzwonią pod kołami jak na weselu. Zexter traci cierpliwość, ale nie oponę."]] },
            { t: "Jechać równo. Policja będzie potrzebować dowodów.", e: 0, z: 2, b: -1,
              r: [["n", "Dowody jadą bezpiecznie. Ty mniej. SUV wali cię w tył i wszystko i tak wypada, tylko bez sensu."]] },
            { t: "Zahamować mocno, ale najpierw przytrzymać ręką termos na siedzeniu pasażera. Kawa się jeszcze przyda.", e: 0, z: 0, b: 2,
              r: [["n", "Wszystko z paki idzie pod koła. Termos przeżył. Kawa też."]] },
            { t: "Zahamować i w tej samej chwili wyrzucić grillową przez okno. Niech widelce mają towarzystwo.", w: "gril", e: -2, z: -1, b: 1,
              r: [["n", "Widelce z paki i grillowa z okna lądują przed nim w tej samej sekundzie. Wszystkie cztery opony mówią „pssst” prawie jednocześnie."]] }
          ] },
        { k: [["n", "Trzysta metrów. SUV jedzie na feldze, sypie iskrami i nie odpuszcza."],
              ["z", "„Nie uciekniesz przed tym, co zaczęliśmy! Kuchnia jest zawsze otwarta, Alex! Zawsze!”"]],
          o: [
            { t: "„Kuchnia zamknięta. Sanepid.”", e: -1, z: -1, b: 1,
              r: [["n", "Słowo „sanepid” robi z Zexterem to, czego nie zrobił regał. Na sekundę zdejmuje nogę z gazu."]] },
            { t: "„Otwarta, ale pan ma zakaz wstępu. Wisi kartka.”", e: 0, z: 0, b: 1,
              r: [["z", "„Jaka kartka?!”"], ["t", "„Napiszę po wszystkim.”"]] },
            { t: "Zapytać, co właściwie zaczęliście.", e: 1, z: 2, b: 0,
              r: [["n", "Zexter ma na to przemowę. Długą. Z podziałem na akty. Dodaje gazu, żebyś lepiej słyszała."]] },
            { t: "Zamknąć okno. Niech krzyczy do szyby.", e: 0, z: 1, b: 0,
              r: [["n", "Zexter krzyczy do szyby. Szyba jest hartowana i nie robi to na niej wrażenia. Na tobie trochę robi."]] },
            { t: "Wystawić wok przez okno jako megafon. „ZA-MKNIĘ-TE.”", w: "wok", e: -2, z: -1, b: 1,
              r: [["n", "Wok wzmacnia głos jak antena satelitarna. Słyszą cię radiowozy, Zexter i prawdopodobnie Mielno."]] }
          ] },
        { k: [["n", "SUV łapie poślizg, obraca się o 180 stopni i staje. Maską w stronę, z której przyjechał."],
              ["p", "„Stój! Ręce na widoku!”"]],
          o: [
            { t: "Zatrzymać furgonetkę, wysiąść powoli, patelnia w górze.", e: 0, z: 0, b: 1,
              r: [["n", "Wysiadasz. Reflektory radiowozów odbijają się w dnie. Wyglądasz jak ktoś, kto wygrał teleturniej."]] },
            { t: "Krzyknąć do policji: „Ten w masce! Ja jestem ta z patelnią!”", e: 0, z: 0, b: 1,
              r: [["n", "Policjanci dzielą się sprawnie na dwie grupy. Większa idzie po człowieka w masce. Mniejsza podchodzi obejrzeć patelnię, z zainteresowaniem."]] },
            { t: "Przebić się przez blokadę. Rozpędziłaś się.", e: 2, z: 0, b: -1,
              r: [["n", "Hamujesz metr przed radiowozem. Policja przez chwilę nie wie, kogo zatrzymywać. Zexter korzysta z tej chwili i gramoli się z wraku."]] },
            { t: "Zatrąbić zwycięsko.", e: -1, z: -1, b: 0,
              r: [["n", "„Sto lat” niesie się nad autostradą. Policjanci stają na baczność. Zexter zakrywa uszy przez maskę."]] }
          ] },
        { k: [["n", "Zexter wygrzebuje się z wraku. W dłoni trzyma patelnię. Jedną z twoich palet. Ogląda ją pod światło radiowozów."],
              ["z", "„Dobry rocznik… Rzeczywiście… nic nie przywiera. Nawet sprawiedliwość.”"]],
          o: [
            { t: "„Sprawiedliwość myje się ręcznie. Proszę nie wkładać do zmywarki.”", e: -1, z: -1, b: 1,
              r: [["n", "Zexter kiwa głową. Zapamiętuje. Będzie miał na to dużo czasu."]] },
            { t: "„Paragon pan ma?”", e: -1, z: -1, b: 1,
              r: [["z", "„…Nie.”"], ["t", "„To się nazywa kradzież. Panowie, dopiszcie.”"]] },
            { t: "Przyznać mu rację. Ładnie powiedział.", e: 3, z: 0, b: 0,
              r: [["n", "Zexter prostuje się. Ktoś go wreszcie docenił. To mu daje siły na jeszcze jedną próbę."]] },
            { t: "Poprosić o autograf na patelni. Do artykułu.", e: 1, z: 0, b: 1,
              r: [["n", "Podpisuje. Z zawijasem. Nieprzywierająca powłoka nie przyjmuje długopisu. Zextera to złości, ciebie utwierdza w zakupie."]] },
            { t: "Pokazać mu Ingenio. Klik: rączka. Klik: bez rączki.", w: "ing", e: -2, z: -1, b: 1,
              r: [["n", "Zexter patrzy na swoją patelnię. Rączka przynitowana na stałe. Pierwszy raz tej nocy wygląda na kogoś, kto czegoś w życiu nie dopilnował."]] }
          ] },
        { k: [["n", "Zexter stoi przy wraku otoczony kordonem. Jeszcze nie zdecydował, czy się poddać, czy uciekać. Do furgonetki podchodzi policjant z latarką. Świeci na ciebie, potem na to, co trzymasz."],
              ["p", "„Co pani ma w rękach? To broń?”"]],
          o: [
            { t: "„Nie, panie władzo. To tylko technologia, która zmieniła oblicze współczesnej kuchni.”", e: -3, z: -1, b: 2,
              r: [["n", "Policjant notuje słowo w słowo. Zza kordonu dobiega jęk człowieka, który przegrał z technologią."]] },
            { t: "„To narzędzie pracy. Jestem dziennikarką.”", e: -2, z: -1, b: 1,
              r: [["p", "„Dziennikarze mają długopisy.”"], ["t", "„Długopisem bym go nie zatrzymała.”"]] },
            { t: "„Tak. To broń.”", e: 1, z: 0, b: 0,
              r: [["n", "Policjant odkłada latarkę i sięga po formularz. Zza kordonu słychać pierwszy od godziny śmiech Zextera."]] },
            { t: "Podać mu patelnię bez słowa.", e: -1, z: -1, b: 0,
              r: [["n", "Policjant waży ją w dłoni."], ["p", "„Solidny uchwyt.”"], ["n", "Zza kordonu: ciche, urażone chrząknięcie."]] }
          ] }
      ]
    }
  ],

  przegranaFinal: {
    id: "zexterpro", tytul: "Zexter Pro",
    jak: "Policja zbiera patelnie z asfaltu, a Zexter, wciąż pewny siebie, odjeżdża na feldze w noc.",
    tekst: "Miesiąc później w telezakupach pojawia się patelnia „Zexter Pro”: czarna, z maską zamiast pokrywki. Przywiera do wszystkiego, nawet do prowadzącego. Co tydzień listonosz przynosi ci jedną sztukę, bez nadawcy. Masz ich już czterdzieści siedem. Zwrotu nikt nie chce przyjąć."
  },

  wygrana: {
    id: "wygrana", tytul: "Limitowana patelnia",
    naglowek: "GRATULACJE!",
    tekst: "Wygrałaś limitowaną patelnię {MARKA} z edycji „Noc w Fabryce”!",
    dopisek: "Zexter sam wsiadł do radiowozu i poprosił, żeby go zabrać jak najdalej od kobiety z patelnią. Patelnia bez rysy.",
    reklama: "Thermo-Signal, czyli inteligentne smażenie. Flagowa technologia patelni {MARKA} opiera się na prostym wskaźniku w kształcie klepsydry na środku patelni. Gdy patelnia jest zimna, wzór jest dobrze widoczny. Wraz ze wzrostem temperatury znak coraz bardziej czerwienieje, a gdy osiągnie optymalną temperaturę (około 180°C), staje się jednolicie czerwony. Dzięki temu wiesz dokładnie, kiedy włożyć składniki na patelnię. To gwarancja idealnie przyrządzonych potraw i zdrowszego gotowania z mniejszą ilością tłuszczu. A dla porządku: patelnia jest też odporna na odkształcenia.",
    haslo: "Nigdy więcej nie kupisz patelni innej marki."
  }
};

if (typeof module !== "undefined") module.exports = SCENY;
