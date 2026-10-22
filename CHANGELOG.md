# Änderungsprotokoll

## Version 2.1 – 22.10.2026

**Fußzeile „SE Aktien © Stefan Eilers“, neue Werte UBTech und Hyundai** (Service-Worker-Cache `aktien-v33`)

- **Fußzeile:** „SE Aktien © Stefan Eilers · Yahoo, Bundesbank · Keine Anlageberatung · v2.1“ statt „ExplorationSE Aktien · …“. Nur „SE Aktien“ steht in der Schrift Marcellus, „© Stefan Eilers“ in der normalen Schrift. Unter 372 px Breite steht „Keine Anl.-Beratung“, damit die Zeile bei 360 px einzeilig bleibt (geprüft 360, 384, 412 px; bei 320 px Umbruch nur zwischen den Abschnitten). Tooltips: „ExplorationSE Aktien – © Stefan Eilers, MIT-Lizenz“, „Daten: Yahoo Finance, Deutsche Bundesbank“, „Keine Anlageberatung“, „Version 2.1“. Die Schrift-Teilmenge enthält bereits alle Zeichen und bleibt unverändert.
- **Unverändert:** Manifest-Name, Seitentitel und `application-name` „ExplorationSE Aktien“, Kurzname „SE Aktien“.
- **Neu: „UBTech“** (`9880.HK`, UBTech Robotics, Hongkong, HKD, ab 29.12.2023) und **„Hyundai“** (`005380.KS`, Hyundai Motor, Korea, KRW, ab 04.01.2000) direkt nach Siemens – jetzt 25 Werte.
- Währungssymbole „HK$“ und „₩“; Won-Kurse ohne Nachkommastellen (Achse, Kursanzeige, Tagesveränderung, Fadenkreuz).
- **Gold** für HKD- und KRW-Werte: Goldpreis über `HKD=X` bzw. `KRW=X` (Yahoo, Landeswährung je USD) in die Handelswährung umgerechnet.
- **Real** für HKD- und KRW-Werte: Da kein frei abrufbarer, aktueller Preisindex für Hongkong und Südkorea verfügbar ist, wird jeder Tageskurs mit dem Wechselkurs desselben Tages in US-Dollar umgerechnet und mit dem US-Verbraucherpreisindex bereinigt (Achse in „$“, Hinweis „Inflationsbereinigt (US-VPI, in USD umgerechnet über …)“).
- **KRW=X ab 1999:** Die Yahoo-Reihe (ab 12/2003) wird mit den EZB-Referenzkursen der Bundesbank (KRW je EUR ÷ USD je EUR) verlängert; Hyundai ist damit auch in „Real“ und „Gold“ ab 2000 darstellbar. `scripts/fetch-bbk.mjs` ruft neu hinzugekommene Reihen sofort ab.
- Gold-Modus bei 1T/5T: Beginnen die Golddaten erst nach dem ersten Kurs (Börsen in Asien), nennt die Hinweiszeile auch die Uhrzeit.
- Datenabruf: 27 Symbole (24 Werte und 3 Wechselkurse), 135 Abrufe je Lauf.
- README und Hinweise zu Fremdbestandteilen ergänzt (Urheber, Fußzeile, Werte in HKD/KRW, Datenquellen).

## Version 2.0 – 19.10.2026

**Neuer Name „ExplorationSE Aktien“, Symbol „S.E.“** (Service-Worker-Cache `aktien-v32`)

- Umbenennung: Die App heißt jetzt **„ExplorationSE Aktien“** statt „ExSE Aktien“ (Verwechslungsgefahr mit einer gleichnamigen Softwarefirma). Die Bezeichnung „ExSE“ wurde aus App, Dokumentation, Code-Kommentaren und Hilfsskripten entfernt; ältere Einträge in diesem Änderungsprotokoll behalten den damaligen Namen.
- Manifest: Name „ExplorationSE Aktien“, Kurzname unter dem Symbol auf dem Startbildschirm „SE Aktien“ (Android zeigt dort nur etwa 12 Zeichen). Seitentitel, `application-name` und `apple-mobile-web-app-title` „ExplorationSE Aktien“, dynamischer Titel z. B. „TSLA 250,00 – ExplorationSE Aktien“.
- **Unverändert:** Adresse https://explorationse.github.io/aktien-app/, Manifest-Kennung `id`, `start_url` und `scope` (`/aktien-app/`) sowie der Repository-Name – die installierte App bleibt dieselbe, gespeicherte Einstellungen bleiben erhalten.
- App-Symbol: Schriftzug „S.E.“ statt „ExSE“ (Marcellus, weiß, etwas größer), darunter wie bisher der preußischblaue Kursverlauf auf Schwarz. Alle Größen neu erzeugt (48–512 px, maskable, Apple-Touch-Icon, Favicons) unter neuen Dateinamen (`icons/*-v9-*`, Favicons jetzt `icons/favicon-v9-16.png`/`-32.png`), damit Browser und Android sie frisch laden. Neues Hilfsskript `tools/render-icons.js` rendert die PNG-Dateien und eine Vorschau. Die alten, nicht mehr verwendeten Dateien `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` und `favicon-*.png` im Hauptordner wurden entfernt.
- Fußzeile: „ExplorationSE Aktien · Yahoo, Bundesbank · Keine Anlageberatung · v2.0“. „Daten:“ entfällt, damit die Zeile mit dem längeren Namen ab 360 px weiterhin einzeilig bleibt; die vollen Namen „Daten: Yahoo Finance, Deutsche Bundesbank“ stehen als Tooltip im Quellenabschnitt (sichtbar am Computer beim Überfahren mit der Maus, auf dem Handy in der Regel nicht).
- Schrift-Teilmenge neu erzeugt (nur die Zeichen „ExplorationSE Aktien“, ca. 2,5 KB woff2) als `site/fonts/explorationse-aktien.woff2`, eigener Schriftname „ExplorationSE Aktien Subset“ (SIL OFL 1.1, reservierter Name „Marcellus“ nicht verwendet); die alte Datei `marcellus-exse-name.woff2` entfällt.
- **Hinweis:** Damit Name und Symbol auf dem Startbildschirm wechseln, muss die App unter Umständen einmal entfernt und neu installiert werden (Chrome: ⋮ → „App installieren“).
- Außerdem seit 1.9.1 (nur Dokumentation): MIT-Lizenz (`LICENSE`), Hinweise zu Fremdbestandteilen (`THIRD-PARTY-NOTICES.md`, Lizenztext Lightweight Charts unter `licenses/`) und Abschnitt „Lizenz“ im README.

## Version 1.9.1 – 11.10.2026

**Bundesbank in der Fußzeile** (Service-Worker-Cache `aktien-v31`)

- Fußzeile nennt beide Datenquellen: „ExSE Aktien · Daten: Yahoo, Bundesbank · Keine Anlageberatung · v1.9.1“.
- Damit die Zeile ab 360 px Breite einzeilig bleibt, steht „Yahoo“ statt „Yahoo Finance“ und die Version als „v1.9.1“ statt „Version 1.9.1“; auf 320 px Umbruch nur zwischen den Abschnitten.

## Version 1.9 – 11.10.2026

**Längere Historien, neue Indizes, Bund-Rendite, Gold ab 1968** (Service-Worker-Cache `aktien-v30`)

- **DAX:** `^GDAXIP` (Kursindex, Yahoo erst ab 03/2013) ersetzt durch `^GDAXI` „DAX (Performance)“ ab 30.12.1987. Dividenden sind bereits enthalten; der Schalter „Mit Div.“ ist deaktiviert mit dem Hinweis „Performanceindex: Dividenden bereits enthalten“.
- **Neu: „Deutschland (ETF EWG)“** direkt nach dem DAX – iShares MSCI Germany ETF in USD ab 03/1996, als Stellvertreter (MSCI Germany und FTSE Germany liefern bei Yahoo keine Tageshistorie).
- **Euro-Raum:** `^STOXX50E` (Yahoo ab 2007) ersetzt durch „Euro-Raum (ETF EZU)“, iShares MSCI Eurozone ETF in USD ab 07/2000.
- **Neu: „MSCI World“** (`^990100-USD-STRD`, Kursindex ab 1972) vor dem MSCI ACWI, **neu: „Welt ex USA (ETF EFA)“** (iShares MSCI EAFE, ab 2001) nach dem MSCI ACWI.
- **Neu: „Bund 10J Rendite“** nach der US-Rendite: Umlaufsrendite börsennotierter Bundeswertpapiere, Restlaufzeit 9–10 Jahre (Bundesbank, Tageswerte ab 29.12.1989). Nur Tageswerte: 1T/5T deaktiviert (mit Hinweis), 1J aus Tageswerten; Real, Gold und Dividenden deaktiviert.
- **Renditen (US und Bund):** lineare Preisachse (Bund 2019–2021 an über 800 Tagen ≤ 0 %, Tiefstwert −0,85 %), alle anderen Werte weiterhin logarithmisch; „Kurs/Prozent“ deaktiviert; Zeitraum-Veränderung in Prozentpunkten („Max: −3,89 Pp.“).
- **Gold ab 1968:** `GC=F` (Yahoo ab 30.08.2000) wird für „Max“ und den Gold-Modus nach hinten verlängert: Frankfurter Goldfixing der Bundesbank (DM/kg → USD/oz über den DM-Kurs, 18.06.1968–30.12.1998), dazwischen eine aus Monatsdurchschnitten der Weltbank **linear interpolierte Brücke** (31.12.1998–29.08.2000). Die Hinweiszeile nennt die Quellen, sobald der Zeitraum vor den 30.08.2000 reicht.
- **EUR/USD ab 1948:** `EURUSD=X` (Yahoo ab 12/2003) wird mit dem EZB-Referenzkurs (ab 1999) und davor rechnerisch über den DM-Kurs (1,95583 DM/€) verlängert. Gold-Modus damit z. B. DAX ab 1987, Siemens ab 1996, MSCI World ab 1972, MSCI ACWI ab 1988.
- **Längere Yahoo-Historie:** Max wird ab 99 Jahren vor heute abgefragt (vorher ab 1.1.1970); die US-Rendite reicht dadurch bis 1962 zurück.
- **Bundesbank-Abruf** `scripts/fetch-bbk.mjs`: höchstens einmal pro Kalendertag, mit Rückfall auf die zuletzt veröffentlichten Daten; der Kursabruf bleibt alle 5 Minuten.
- **Real:** Kurse vor Beginn der Preisindizes (01/1996) werden nicht mehr mit dem ersten Indexwert bereinigt, sondern ausgeblendet; die Hinweiszeile nennt den Beginn.
- Werte ohne nennenswerte Umsatzdaten (MSCI-Indizes, Renditen): kein Volumen-Histogramm mehr (vorher Nulllinie bzw. ein einzelner hoher Balken am rechten Rand); die Kurse nutzen dann die volle Höhe.
- Renditen: auch die Tagesveränderung in Prozentpunkten („−0,04 Pp. zum Vortag“).
- Zuvor gewählte, ersetzte Werte (`^GDAXIP`, `^STOXX50E`) werden beim Start automatisch auf `^GDAXI` bzw. `EZU` umgestellt.
- Fußzeile „Version 1.9“.

## Version 1.8.2 – 10.10.2026

**Fußzeile einzeilig, Seitentitel** (Service-Worker-Cache `aktien-v29`)

- Fußzeile passt ab 360 px Bildschirmbreite wieder in eine Zeile: seitlicher Abstand 4 px statt 10 px, Name „ExSE Aktien“ in 11 px statt 12 px mit etwas geringerem Zeichenabstand (weiterhin etwas größer und heller als der übrige Text). Auf 320 px Umbruch nur zwischen den Abschnitten.
- Seitentitel (Browser-Tab bzw. App-Übersicht) „ExSE Aktien“ statt „Aktien-Chart“, auch im dynamischen Titel mit Kurs (z. B. „TSLA 250,00 – ExSE Aktien“).
- Fußzeile „Version 1.8.2“. Manifest unverändert.

## Version 1.8.1 – 10.10.2026

**App-Name „ExSE Aktien“** (Service-Worker-Cache `aktien-v28`)

- Name in der Fußzeile von „ExSE Kurs“ in „ExSE Aktien“ geändert, weiterhin in der Schrift Marcellus wie im App-Symbol.
- Schrift-Teilmenge neu erzeugt (nur die Zeichen „ExSE Aktien“, ca. 2 KB woff2) als `site/fonts/marcellus-exse-name.woff2`; eigener Schriftname jetzt „ExSE Name Subset“ (SIL OFL 1.1, Lizenz unverändert beigelegt).
- Manifest: Name und Kurzname einheitlich „ExSE Aktien“ (bisher Name „ExSE Aktien-Chart“). Kennung, Geltungsbereich und Startadresse (`/aktien-app/`) unverändert, die installierte App bleibt also dieselbe.
- Fußzeile „Version 1.8.1“.

## Version 1.8 – 10.10.2026

**Name in der Fußzeile** (Service-Worker-Cache `aktien-v27`)

- Fußzeile beginnt mit dem Namen „ExSE Kurs“ in der Schrift Marcellus (wie im App-Symbol); der übrige Text bleibt in der Systemschrift.
- Schrift selbst gehostet als Teilmenge (nur „ExSE Kurs“, ca. 2 KB woff2) unter `site/fonts/`, vorab geladen und vom Service Worker zwischengespeichert (offline nutzbar); Lizenz SIL OFL 1.1 beigelegt.
- Fußzeile gekürzt auf „ExSE Kurs · Daten: Yahoo Finance · Keine Anlageberatung · Version 1.8“ (die Verzögerung steht weiterhin in der Zeile „Daten abgerufen …“), damit sie ab 360 px in eine Zeile passt; Umbruch nur zwischen den Abschnitten.
- App-Name im Manifest unverändert.

## Version 1.7.3 – 10.10.2026

**Feinere Linie** (Service-Worker-Cache `aktien-v26`)

- Im Modus „Linie“ wird der Kursverlauf mit 1 px statt 2 px Linienstärke gezeichnet; Kerzen und die 0-%-Linie bleiben unverändert.
- Fußzeile „Version 1.7.3“.

## Version 1.7.2 – 10.10.2026

**Chart rechts bündig mit den Schaltflächen** (Service-Worker-Cache `aktien-v25`)

- Ursache des Leerraums rechts: Der Chart hatte seit 1.4.1 rechts 14 px Rand, die Schaltflächenleiste nur 6 px – rechts blieben 8 px ungenutzt.
- Der Chart (einschließlich Preisachse) endet jetzt exakt an der rechten Kante der Schaltflächen (gemeinsamer Wert `--barpad`); links bleibt er bündig mit dem Text. Rechts kein Leerraum nach dem letzten Balken (`rightOffset` 0).
- Fußzeile „Version 1.7.2“.

## Version 1.7.1 – 10.10.2026

**Kleine optische Korrektur** (Service-Worker-Cache `aktien-v24`)

- Die Hinweiszeile (z. B. „Inflationsbereinigt …“, „In Gold …“, „inkl. Dividenden“) erscheint jetzt im selben Grau wie die übrigen Infozeilen statt in Lila.
- Fußzeile „Version 1.7.1“.

## Version 1.7 – 10.10.2026

**Neue Auswahl mit 19 Werten** (Service-Worker-Cache `aktien-v23`)

- Neue Reihenfolge: SpaceX, Tesla, Siemens, Petrobras, Öl (Brent, `BZ=F`), Gold, Kazatomprom (`KAP.IL`), Cresud (`CRESY`), Oklo, Ondas (`ONDS`), Quantum Computing (`QUBT`), Rigetti (`RGTI`), Dow Jones (`^DJI`), MSCI ACWI (`^892400-USD-STRD`), Schwellenländer (ETF `EEM` als Stellvertreter für den MSCI EM), DAX Kursindex (`^GDAXIP`), Euro Stoxx 50 (`^STOXX50E`), VIX (`^VIX`), US 10J Rendite (`^TNX`, Rendite 10-jähriger US-Staatsanleihen in %).
- VDAX-NEW nicht enthalten (bei Yahoo Finance nicht verfügbar).
- Auswahl als eine waagrecht wischbare Zeile; der gewählte Wert bleibt sichtbar. Indizes und VIX in Punkten, US-Rendite in Prozent.
- Schalterregeln je Art: „Mit Div.“ nur für Aktien/ETFs; „Real“ und „Gold“ nicht beim VIX und bei der US-Rendite; „Gold“ nicht beim Gold selbst. Fehlende Währungsangabe bei Yahoo (MSCI ACWI, Euro Stoxx 50) wird ergänzt.
- Datenabruf: je Symbol 5 statt 7 Abrufe; 10J/20J aus der Tagesreihe (Max + 5J) ausgeschnitten; 100 Abrufe je Lauf (ca. 45–50 s).
- **Fehlerbehebung:** Der jüngste Tagesbalken fehlte bei europäischen Werten nach Handelsschluss häufig (Yahoo liefert ihn leer); dadurch endete der Chart in 5J–Max einen Tag zu früh und wich vom aktuellen Kurs bzw. der Zeitraum-Veränderung ab (z. B. Siemens Max). Er wird jetzt aus den Minutenkerzen des Tages ergänzt.
- Fußzeile „Version 1.7“.

## Version 1.6 – 09.10.2026

**Dividenden und neue Schalterleiste** (Service-Worker-Cache `aktien-v22`)

- Neuer Schalter „Ohne | Mit Div.“ (Start stets „Ohne“): Gesamtrendite inkl. Dividenden über Yahoo „Adj. Close“; Faktor adjclose ÷ close je Balken auf Eröffnung/Hoch/Tief/Schluss (Näherung), jüngster Balken = aktueller Kurs.
- 1J: Faktoren aus den Tagesdaten (5J) tageweise angewendet; 1T/5T und Gold: deaktiviert.
- Kombinierbar mit „Kurs | Prozent“, „Nominal | Real“ (erst Dividenden, dann Inflation) und „Währung | Gold“ (Gesamtrendite ÷ Goldpreis). Hinweiszeile „… inkl. Dividenden“, Zeitraum-Veränderung „… inkl. Div.“.
- Beispiele: Siemens Max +1.134,9 % → +2.759,6 % inkl. Dividenden, Petrobras 5J +130,0 % → +618,8 %, Tesla unverändert.
- Schalter in drei Spalten: oben „Kerzen | Linie“, „Kurs | Prozent“, „Ohne | Mit Div.“, unten zentriert „Nominal | Real“, „Währung | Gold“; etwas schmaler und kleinere Schrift, Tippfläche 32 px; bei sehr schmalen Bildschirmen oder großer Schrift automatisch zwei Spalten. Fußzeile „Version 1.6“.

## Version 1.5.1 – 09.10.2026

**Volle Zeitachse bei kürzerer Historie** (Service-Worker-Cache `aktien-v21`)

- Hat ein Wert weniger Historie als der gewählte Zeitraum (z. B. SpaceX in 1J/5J/10J/20J, Oklo in 10J/20J), zeigt die Zeitachse dennoch den ganzen Zeitraum bis heute; die Kurse erscheinen rechts, davor leere Balken (Mo–Fr, bei 1J stündlich in Handelszeiten).
- „Max“ unverändert ohne Auffüllung; im Gold-Modus reicht „Max“ bis zum ersten Kurs des Werts (z. B. Siemens ab 1996, Kurse in Gold ab 12/2003).
- 1T/5T unverändert; in den Prozent-Modi liegt 0 % weiterhin beim ersten echten Balken. Fußzeile „Version 1.5.1“.

## Version 1.5 – 09.10.2026

**Gold-Modus und kompaktes Layout** (Service-Worker-Cache `aktien-v20`)

- Neuer Schalter „Währung | Gold“: Kurs als Verhältnis Aktienkurs ÷ Goldpreis (`GC=F`) zum selben Zeitpunkt, also Unzen Gold je Aktie (Achse z. B. „0,0907 oz“, logarithmisch, volle Zeitraumanzeige).
- Zuordnung: Tageskerzen über das Datum (fehlende Goldtage mit dem letzten Wert aufgefüllt), Intraday über den letzten Goldkurs zu oder vor dem Balken.
- Siemens (EUR): Goldpreis mit `EURUSD=X` zum selben Zeitpunkt in Euro umgerechnet; der Workflow lädt dafür zusätzlich `EURUSD=X` für alle Zeiträume.
- Kombinierbar mit „Kurs | Prozent“; „Real“ im Gold-Modus deaktiviert (Inflation kürzt sich heraus); beim Gold selbst ist der Gold-Modus deaktiviert. Fadenkreuz und Zeitraum-Veränderung („… in Gold“) passend zum Modus.
- Kompakteres Layout: niedrigere Schaltflächen (mind. 32 px), Schalter in zwei Reihen, Hinweis zur festen Auswahl in die einzeilige Fußzeile verlegt, Chart füllt die restliche Höhe (`100dvh`) – kein Scrollen mehr nötig.
- Start stets mit Nominal + Kurs + Währung. Fußzeile „Version 1.5“.

## Rücknahme von Version 1.4.2 – 09.10.2026

**Version 1.4.2 zurückgezogen – App auf Stand 1.4.1 zurückgesetzt** (Service-Worker-Cache `aktien-v19`)

- Die festen Mindesthöhen der Kopfzeilen aus 1.4.2 führten zu Unstimmigkeiten in der Darstellung; die App-Dateien entsprechen wieder exakt Version 1.4.1.
- Nur der Service-Worker-Cache wurde auf `aktien-v19` erhöht, damit Telefone die Dateien von 1.4.2 verwerfen. Fußzeile „Version 1.4.1“.
- Der Eintrag zu Version 1.4.2 bleibt unten als Historie erhalten.

## Version 1.4.2 – 09.10.2026 (zurückgezogen)

**Ruhiges Layout beim Umschalten** (Service-Worker-Cache `aktien-v18`)

- Der Chart springt beim Umschalten von Zeitraum, Kerzen/Linie, Kurs/Prozent und Nominal/Real nicht mehr nach oben oder unten.
- Hinweiszeile (z. B. „Inflationsbereinigt …“), Kurs-/Veränderungszeile, Börsenstatus, Abrufzeit („Aktualisierung verzögert“) und Fadenkreuz-Zeile erhalten eine feste Mindesthöhe – berechnet aus dem längsten möglichen Text bei aktueller Bildschirmbreite und Schriftgröße; bei Drehen des Telefons wird neu berechnet.
- Nachbörsliche Veränderung ebenfalls mit typografischem Minuszeichen. Fußzeile „Version 1.4.2“.

## Version 1.4.1 – 09.10.2026

**Kleine Korrekturen** (Service-Worker-Cache `aktien-v17`)

- Chart mit demselben seitlichen Rand (14 px) wie der Text darüber, links und rechts.
- Gesamtansicht bleibt bei Größenänderung (z. B. Drehen des Telefons) erhalten, solange nicht selbst gezoomt oder verschoben wurde.
- Tagesveränderung („heute“) ebenfalls mit typografischem Minuszeichen („−“).
- Fußzeile „Version 1.4.1“.

## Version 1.4 – 09.10.2026

**Neuer Schalter „Kurs | Prozent“** (Service-Worker-Cache `aktien-v16`)

- Unabhängig von „Nominal | Real“ wählbar: „Kurs“ zeigt die Preisachse in der Handelswährung, „Prozent“ die Veränderung seit Beginn des Zeitraums (0,0 % beim ersten Balken, Vorzeichen, logarithmische Achse, gestrichelte 0-%-Linie).
- Vier Kombinationen: Nominal + Kurs, Nominal + Prozent, Real + Kurs (inflationsbereinigte Kurse in heutigem Geld), Real + Prozent. Start stets mit Nominal + Kurs.
- „Prozent“ in allen Zeiträumen verfügbar (auch 1T/5T); „Real“ bleibt bei 1T/5T deaktiviert.
- Fadenkreuz im Prozent-Modus mit Prozentwerten und Kurs in Klammern; Hinweiszeile je nach Kombination.
- Zeitraum-Veränderung neben der Tagesveränderung mit typografischem Minuszeichen („−“).
- Alle Umschalter gleich breit und symmetrisch; bei wenig Platz zentriert untereinander. Fußzeile „Version 1.4“.

## Version 1.3 – 09.10.2026

**Real-Modus: Veränderung seit Beginn (0 %)** (Service-Worker-Cache `aktien-v15`)

- Bei „Real“ beginnt die Achse bei 0,0 % statt 100 %: Achsenbeschriftung, Wert am rechten Rand und Fadenkreuzwerte zeigen die Veränderung seit Beginn des Zeitraums mit Vorzeichen (z. B. „+582,1 %“, „−35,2 %“), im Fadenkreuz weiterhin mit realem Kurs in Klammern.
- Die logarithmische Skalierung bleibt erhalten (intern Index mit Beginn = 100).
- Dezente gestrichelte 0-%-Linie im Real-Modus.
- Hinweiszeile: „Inflationsbereinigt (…), Veränderung seit Beginn, Preise von MM/JJJJ“.
- Modus „Nominal“ unverändert; Fußzeile „Version 1.3“.

## Version 1.2 – 09.10.2026

**Real-Modus als Prozent-Index** (Service-Worker-Cache `aktien-v14`)

- Bei „Real“ zeigt die Preisachse Prozent: Die Eröffnung des ersten Balkens im gewählten Zeitraum entspricht 100 %. Die Achse bleibt logarithmisch; Beschriftung im deutschen Format (z. B. „250,0 %“).
- Fadenkreuzwerte (E/H/T/S) im Real-Modus in Prozent, dahinter der reale Schlusskurs in Klammern.
- Hinweiszeile: „Inflationsbereinigt (…), Index: Beginn = 100 %, Preise von MM/JJJJ“.
- Fadenkreuzanzeige wird beim Wechsel von Wert, Zeitraum oder Modus zurückgesetzt.
- Modus „Nominal“ unverändert; Fußzeile „Version 1.2“.

## Version 1.1 – 09.10.2026

**Neu: Inflationsbereinigung** (Service-Worker-Cache `aktien-v13`)

- Neuer Schalter „Nominal | Real“ neben „Kerzen | Linie“; beim Öffnen der App ist stets „Nominal“ aktiv. Bei 1T und 5T deaktiviert.
- „Real“ zeigt Kurse in Preisen des letzten verfügbaren Monats: Chart, Fadenkreuzwerte und Zeitraum-Veränderung werden bereinigt; Hinweiszeile mit Index und Basismonat (z. B. „Inflationsbereinigt (US-VPI), in Preisen von 08/2026“).
- USD-Werte mit dem US-Verbraucherpreisindex (BLS CPI-U, `CUUR0000SA0`), EUR-Werte mit dem HVPI Deutschland (Eurostat `prc_hicp_minr`); Stufenmethode je Monat, fehlende Monate interpoliert, jüngster Monat fortgeschrieben.
- Neues Skript `scripts/fetch-cpi.mjs` im Workflow: Abruf der Preisindizes höchstens einmal täglich mit Rückfall auf die zuletzt veröffentlichten Daten.
- Fußzeile „Version 1.1“; README um Inflationsbereinigung ergänzt.

## Version 1.0 – 09.10.2026

Erste offizielle Version der ExSE Aktien-Chart-App (Service-Worker-Cache `aktien-v12`).

**Umfang:**

- Mobile Web-App (PWA) auf GitHub Pages: https://explorationse.github.io/aktien-app/
- Feste Auswahl: SpaceX (`SPCX`), Tesla (`TSLA`), Siemens (`SIE.DE`), Petrobras (`PBR`), Gold-Future (`GC=F`), Oklo (`OKLO`)
- Zeiträume 1T und 5T (1-Minuten-Kerzen), 1J (Stundenkerzen), 5J, 10J, 20J und Max (Tageskerzen)
- Preisachse immer logarithmisch, Volumen linear
- Umschaltung Kerzen / Linie; stets volle Anzeige des gewählten Zeitraums; Zoom per Fingergeste
- Kursdaten von Yahoo Finance, automatisch per GitHub Actions etwa alle 5 Minuten abgerufen; Anzeige des Abrufzeitpunkts und Hinweis bei verzögerter Aktualisierung
- Installierbar auf Android (Chrome empfohlen) mit eigenem ExSE-Symbol
- Versionsanzeige „Version 1.0“ in der Fußzeile der App
- Deutsche Dokumentation (README) und dieses Änderungsprotokoll

---

## Entwicklungsverlauf bis Version 1.0

Abgeleitet aus der Git-Historie (alle Commits vom 09.10.2026, Zeitangaben in MESZ). In Klammern die jeweilige Cache-Version des Service Workers.

| Commit    | Uhrzeit | Cache       | Änderung |
|-----------|---------|-------------|----------|
| `1c41c97` | 16:08   | `aktien-v2` | Erste Fassung: Aktien-Chart-PWA auf GitHub Pages mit automatischem Kursdatenabruf per GitHub Actions (SpaceX, Tesla, Siemens, Petrobras, Gold) |
| `b19fe7f` | 16:10   | `aktien-v2` | Zeitraum „Max“ mit Tageskerzen statt monatlicher Kerzen |
| `7ddebe3` | 16:45   | `aktien-v2` | Oklo (`OKLO`, NYSE) als feste Auswahl hinzugefügt |
| `e412b87` | 16:46   | `aktien-v3` | Neues App-Symbol „ExSE“ (Preußischblau auf Schwarz), Favicons, Apple-Touch-Icon |
| `71de132` | 16:51   | `aktien-v3` | App-Symbol: natürlicherer, feinerer Kursverlauf |
| `ef7a96d` | 17:09   | `aktien-v4` | Chart zeigt stets den gesamten gewählten Zeitraum, auch bei Tausenden von Kerzen auf schmalen Bildschirmen |
| `cc73562` | 17:18   | `aktien-v5` | Logarithmische Preisachse mit Log-Schalter (standardmäßig aktiv) |
| `6ede9f2` | 17:25   | `aktien-v6` | Vorheriges ExSE-Symbol (Zickzack-Linie) wiederhergestellt |
| `722d8b9` | 17:31   | `aktien-v7` | Symbol mit realistischem Kursverlauf wiederhergestellt |
| `6c5dab4` | 17:38   | `aktien-v8` | App-Symbole für Android/Firefox überarbeitet: nur PNG (48–512 px), große Icon-Links, separate *maskable*-Dateien, neue Dateinamen; Service Worker fängt Manifest und Symbole nicht mehr ab |
| `7faaf99` | 18:00   | `aktien-v9` | Log-Schalter entfernt; Preisachse immer logarithmisch |
| `7ab75c7` | 18:11   | `aktien-v10` | Zeiträume 1T, 5T, 1J, 5J, 10J, 20J, Max (1M/6M entfernt, 10J/20J mit Tageskerzen) |
| `921c2e6` | 18:38   | `aktien-v11` | Schalter „Kerzen \| Linie“ vollständig lesbar und symmetrisch (eigene zentrierte Zeile) |
| `d7cba7c` | 18:51   | `aktien-v11` | Dokumentation: README und CHANGELOG (deutsch) |

Der Abschluss-Commit zu Version 1.0 (Versionsbezeichnung in Dokumentation und App-Fußzeile, Cache `aktien-v12`) ist mit dem Git-Tag `v1.0` markiert.
