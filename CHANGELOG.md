# Änderungsprotokoll

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
