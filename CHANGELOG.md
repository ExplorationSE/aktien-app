# Änderungsprotokoll

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
