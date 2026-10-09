# ExSE Aktien-Chart

Mobile Web-App (PWA) zur Anzeige interaktiver Aktiencharts auf dem Android-Smartphone – mit langer Kurshistorie, hoher Zeitauflösung und regelmäßig aktualisierten Kursdaten.

**Aktuelle Version:** 1.4.1 (09.10.2026) – siehe [CHANGELOG.md](CHANGELOG.md)  
**Live-Version:** https://explorationse.github.io/aktien-app/

> Hinweis: Die Anwendung dient ausschließlich der Information und stellt keine Anlageberatung dar.

---

## Inhalt

1. [Zweck](#zweck)
2. [Funktionen](#funktionen)
3. [Installation auf Android](#installation-auf-android)
4. [Aufbau und Architektur](#aufbau-und-architektur)
5. [Datenquelle und Einschränkungen](#datenquelle-und-einschränkungen)
6. [Neuen Wert hinzufügen](#neuen-wert-hinzufügen)
7. [Ordnerstruktur](#ordnerstruktur)

---

## Zweck

Die App zeigt für eine feste Auswahl von Werten einen übersichtlichen, interaktiven Kurschart – optimiert für die Bedienung auf dem Smartphone. Sie lässt sich wie eine normale App auf dem Startbildschirm ablegen und benötigt weder ein Benutzerkonto noch einen API-Schlüssel.

## Funktionen

### Feste Auswahl (Presets)

| Schaltfläche   | Symbol   | Wert                                   | Börse / Markt | Währung |
|----------------|----------|----------------------------------------|---------------|---------|
| SpaceX         | `SPCX`   | Space Exploration Technologies Corp.  | Nasdaq        | USD     |
| Tesla          | `TSLA`   | Tesla, Inc.                            | Nasdaq        | USD     |
| Siemens        | `SIE.DE` | Siemens AG                             | Xetra         | EUR     |
| Petrobras      | `PBR`    | Petróleo Brasileiro S.A. (ADR)         | NYSE          | USD     |
| Gold (Future)  | `GC=F`   | Gold-Future (vorderster Kontrakt)      | COMEX         | USD     |
| Oklo           | `OKLO`   | Oklo Inc.                              | NYSE          | USD     |

Eine freie Suche nach beliebigen Symbolen ist in dieser Version nicht möglich (siehe [Einschränkungen](#datenquelle-und-einschränkungen)).

### Zeiträume und Auflösung

| Schaltfläche | Zeitraum            | Kerzen-Intervall |
|--------------|---------------------|------------------|
| 1T           | 1 Tag               | 1 Minute         |
| 5T           | 5 Tage              | 1 Minute         |
| 1J           | 1 Jahr              | 1 Stunde         |
| 5J           | 5 Jahre             | 1 Tag            |
| 10J          | 10 Jahre            | 1 Tag            |
| 20J          | 20 Jahre            | 1 Tag            |
| Max          | gesamte Historie    | 1 Tag            |

Bei Werten mit kürzerer Börsenhistorie (z. B. SpaceX seit 12.06.2026, Oklo seit 2021) wird der vorhandene Zeitraum angezeigt; bei jungen Börsennotierungen erscheint ein entsprechender Hinweis.

### Darstellung

- **Logarithmische Preisachse** – stets aktiv; prozentuale Bewegungen sind dadurch über lange Zeiträume vergleichbar. Das Volumen wird linear dargestellt.
- **Kerzen / Linie** – Umschaltung zwischen Kerzenchart und Linien-/Flächenchart.
- **Kurs / Prozent** – „Kurs“ zeigt die Preisachse in der Handelswährung; „Prozent“ zeigt die Veränderung seit Beginn des gewählten Zeitraums: Die Eröffnung des ersten Balkens entspricht **0,0 %**, darüber bzw. darunter die Veränderung mit Vorzeichen (z. B. „+582,1 %“, „−35,2 %“). Die logarithmische Skalierung bleibt erhalten (intern Index mit Beginn = 100); eine dezente gestrichelte Linie markiert 0 %. Im Fadenkreuz stehen die Prozentwerte, dahinter der Kurs in Klammern. „Prozent“ ist in allen Zeiträumen verfügbar.
- **Nominal / Real** – Umschaltung auf inflationsbereinigte Kurse (siehe [Inflationsbereinigung](#inflationsbereinigung)); bei 1T und 5T deaktiviert.
- Beide Schalter sind unabhängig voneinander kombinierbar: *Nominal + Kurs* (Kurse), *Nominal + Prozent* (nominale Veränderung), *Real + Kurs* (inflationsbereinigte Kurse in heutigem Geld), *Real + Prozent* (inflationsbereinigte Veränderung). Beim Öffnen der App ist stets **Nominal + Kurs** aktiv.
- **Volle Zeitraumanzeige** – nach dem Laden und bei jedem Wechsel von Wert oder Zeitraum wird der gesamte gewählte Zeitraum vom ersten bis zum letzten Datenpunkt eingepasst. Mit zwei Fingern kann hineingezoomt werden; ein gewählter Zoom bleibt bei der automatischen Aktualisierung erhalten.
- **Fadenkreuz** mit Anzeige von Eröffnung (E), Hoch (H), Tief (T), Schluss (S) und Volumen.
- **Kursanzeige** mit Tagesveränderung, Veränderung im gewählten Zeitraum, Börsenstatus (geöffnet, vor-/nachbörslich, geschlossen) sowie vor-/nachbörslichem Kurs, sofern vorhanden.
- Deutsche Zahlen- und Datumsformate; Uhrzeiten in der Ortszeit des Geräts.
- Dunkles, für Smartphones optimiertes Design.

### Inflationsbereinigung

Mit „Real“ werden die Kurse inflationsbereinigt – mit „Kurs“ als Preise in heutigem Geld, mit „Prozent“ als inflationsbereinigte Veränderung seit Beginn des Zeitraums.

- **Formel:** realer Kurs = nominaler Kurs × Preisindex (letzter verfügbarer Monat) ÷ Preisindex (Monat des Kurses). Es gilt die Stufenmethode: ein Indexwert je Kalendermonat.
- **Preisindex je Währung:** USD-Werte (SpaceX, Tesla, Petrobras-ADR, Gold-Future, Oklo) mit dem **US-Verbraucherpreisindex** (BLS CPI-U, alle Städte, nicht saisonbereinigt, Reihe `CUUR0000SA0`); EUR-Werte (Siemens) mit dem **Harmonisierten Verbraucherpreisindex Deutschland** (Eurostat, `prc_hicp_minr`, 2025 = 100).
- Für Monate, für die noch kein Indexwert veröffentlicht ist (US-Index erscheint etwa Mitte des Folgemonats), wird der letzte verfügbare Wert fortgeschrieben. Fehlende Einzelmonate in der Indexreihe (z. B. US-Index Oktober 2025) werden linear interpoliert. Der jüngste HVPI-Wert kann eine vorläufige Schätzung von Eurostat sein.
- Chart, Fadenkreuzwerte (E/H/T/S) und Zeitraum-Veränderung verwenden die bereinigten Werte; im Modus „Prozent“ steht hinter den Prozentwerten der reale Schlusskurs in Preisen des Basismonats. Die Zeitraum-Veränderung („… real“) bezieht sich auf die bereinigten Werte; der aktuelle Kurs oben bleibt nominal (er entspricht im laufenden Monat dem realen Wert). Eine Hinweiszeile nennt Index und Basismonat, z. B. „Inflationsbereinigt (US-VPI), in Preisen von 08/2026“ bzw. „Inflationsbereinigt (US-VPI), Veränderung seit Beginn, Preise von 08/2026“.
- Im Modus „Nominal“ werden wie bisher Kurse in der Handelswährung angezeigt.
- Bei **1T und 5T** ist die Umschaltung deaktiviert, da die Inflation über wenige Tage vernachlässigbar ist.
- Es handelt sich um Kursveränderungen **ohne Dividenden** (Yahoo-Schlusskurse sind split-, aber nicht dividendenbereinigt).

### Aktualisierung

- Die Kursdaten werden serverseitig per GitHub Actions etwa **alle 5 Minuten** abgerufen und veröffentlicht (tatsächlich häufig 5–15 Minuten, siehe Einschränkungen).
- Die geöffnete App lädt die Daten bei geöffneter Börse (auch vor-/nachbörslich) **jede Minute**, bei geschlossener Börse **alle 5 Minuten** sowie beim erneuten Öffnen der App neu.
- Unter dem Kurs wird angezeigt, **wann die Daten abgerufen wurden**. Sind sie älter als 30 Minuten, erscheint der Hinweis „Aktualisierung verzögert“ in Orange.

## Installation auf Android

**Empfohlen: Google Chrome.** Chrome installiert die Seite als vollwertige App mit eigenem Symbol.

1. https://explorationse.github.io/aktien-app/ in Chrome öffnen und warten, bis der Chart geladen ist.
2. Menü **⋮** → **„App installieren“** (bzw. „Zum Startbildschirm hinzufügen“) → bestätigen.
3. Die App „ExSE Aktien“ erscheint auf dem Startbildschirm.

**Hinweis zu Firefox:** Firefox für Android legt lediglich eine Verknüpfung an (⋮ → „Zum Startbildschirm hinzufügen“). Wird dabei ein allgemeines Android-Symbol statt des ExSE-Symbols angezeigt, die Verknüpfung entfernen, in Firefox die Website-Daten für `explorationse.github.io` löschen und erneut hinzufügen – oder die Installation über Chrome vornehmen.

**Updates:** Neue Versionen werden automatisch geladen. Gegebenenfalls die App ein- bis zweimal schließen und neu öffnen. Ein geändertes App-Symbol übernimmt Android unter Umständen erst nach Entfernen und erneutem Hinzufügen.

## Aufbau und Architektur

```
GitHub Actions (alle 5 Min., bei Push, manuell)
   └─ scripts/fetch-data.mjs ── Yahoo Finance ──► site/data/*.json
   └─ scripts/fetch-cpi.mjs ── BLS / Eurostat (1× täglich) ──► site/data/cpi_*.json
   └─ Upload von site/ als Pages-Artefakt ──► GitHub Pages
                                                  │
Smartphone (Browser/PWA) ◄── statische Dateien + data/*.json
```

- **Statische Website auf GitHub Pages** (`site/`): `index.html`, `app.js` und die Chart-Bibliothek *TradingView Lightweight Charts* (`lwc.js`, lokal eingebunden). Kein eigener Server erforderlich.
- **Workflow** `.github/workflows/pages.yml` („Kursdaten holen & Seite veröffentlichen“): läuft bei jedem Push auf `main`, per Zeitplan (`*/5 * * * *`) und manuell (`workflow_dispatch`). Er führt `scripts/fetch-data.mjs` aus und veröffentlicht den Ordner `site/` über `actions/upload-pages-artifact` und `actions/deploy-pages`. Die Kursdaten werden **nicht** in das Repository eingecheckt, die Versionshistorie bleibt dadurch schlank.
- **Preisindizes** `scripts/fetch-cpi.mjs`: lädt den US-VPI über die BLS-API v1 (ohne Schlüssel, je Anfrage max. 10 Jahre) und den HVPI Deutschland über die Eurostat-API (ohne Schlüssel) und schreibt `site/data/cpi_us.json` und `site/data/cpi_de.json` (Monatswerte ab 1996, Quelle, letzter Monat, interpolierte Monate). Der Abruf erfolgt **höchstens einmal pro Tag** (nach einem Fehlschlag frühestens nach 3 Stunden erneut); ansonsten wird die zuletzt veröffentlichte Datei übernommen. Der Schritt ist im Workflow fehlertolerant (`continue-on-error`): Ohne Indexdaten ist lediglich „Real“ nicht verfügbar.
- **Datenabruf** `scripts/fetch-data.mjs`: lädt für jedes Symbol und jeden Zeitraum die Chartdaten von Yahoo Finance (per `curl`, mit Wiederholungsversuchen über `query1`/`query2`) und schreibt je eine Datei `site/data/<SYMBOL>_<ZEITRAUM>.json` (Sonderzeichen im Symbol werden durch `_` ersetzt, z. B. `GC_F_Max.json`) sowie `site/data/status.json`. „Max“ wird mit `period1=0` abgefragt, damit Tageskerzen statt monatlicher Kerzen geliefert werden. Schlägt ein Abruf fehl, wird die zuletzt veröffentlichte Datei übernommen, damit die Seite nie leer ist.
- **Service Worker** `site/sw.js`: speichert die App-Dateien für schnellen Start und Offline-Nutzung. Kursdaten werden stets zuerst aus dem Netz geladen (nur offline aus dem Zwischenspeicher); Manifest und Symbole werden nicht abgefangen. Bei Änderungen an App-Dateien wird die Cache-Version (`aktien-vN`) erhöht.
- **Manifest** `site/manifest.webmanifest`: Name „ExSE Aktien-Chart“, Kurzname „ExSE Aktien“, Anzeige *standalone*, Geltungsbereich `/aktien-app/`, ausschließlich PNG-Symbole (48–512 px) sowie separate *maskable*-Symbole.
- **Symbole** `site/icons/`: App-Symbole in allen Größen. Sie werden mit `tools/make-icon.py` als SVG (`site/icon.svg`, Schrift in Pfade umgewandelt) erzeugt und anschließend als PNG gerendert.

## Datenquelle und Einschränkungen

- **Yahoo Finance (inoffiziell):** Die Daten stammen von einer öffentlich erreichbaren, aber nicht offiziell dokumentierten Schnittstelle. Sie kann sich ohne Ankündigung ändern oder Anfragen begrenzen. In diesem Fall bleiben die zuletzt veröffentlichten Daten sichtbar und die App zeigt „Aktualisierung verzögert“.
- **Verzögerung:** Kurse können von Yahoo verzögert geliefert werden; hinzu kommt der Abrufrhythmus.
- **Zeitplan von GitHub:** Geplante Workflows werden von GitHub nicht garantiert pünktlich ausgeführt; insbesondere zu Spitzenzeiten verzögern sich Läufe oder entfallen. Realistisch ist eine Aktualisierung alle 5–15 Minuten.
- **Pause nach 60 Tagen:** In öffentlichen Repositories deaktiviert GitHub zeitgesteuerte Workflows, wenn im Repository 60 Tage lang keine Aktivität stattfand. Ein automatischer „Keepalive“ ist **nicht** eingerichtet. Prüfung und Abhilfe: Im Reiter *Actions* den Workflow „Kursdaten holen & Seite veröffentlichen“ öffnen und bei Bedarf **„Enable workflow“** wählen, oder einen Commit pushen. Ein Anzeichen ist der dauerhafte Hinweis „Aktualisierung verzögert“ in der App.
- **Gold** wird über den Future-Kontrakt `GC=F` (vorderster Monat, COMEX) dargestellt, nicht über den Kassakurs.
- **Petrobras** wird über das an der NYSE gehandelte ADR `PBR` in USD dargestellt (alternativ wäre `PETR4.SA` in BRL möglich).
- **Preisindizes:** Die BLS-API v1 erlaubt ohne Schlüssel nur eine begrenzte Zahl von Abfragen pro Tag und IP-Adresse; GitHub-Runner teilen sich IP-Adressen. Bei Fehlschlägen bleibt der zuletzt veröffentlichte Index in Gebrauch. Indexwerte können nachträglich revidiert werden.
- **Keine freie Suche:** Da Yahoo direkte Abfragen aus dem Browser (CORS) nicht zulässt und kein eigener Server betrieben wird, stehen nur die vorab abgerufenen Werte zur Verfügung.

## Neuen Wert hinzufügen

1. **Symbol ermitteln:** das Yahoo-Finance-Symbol des Werts heraussuchen (z. B. `SAP.DE` für SAP an Xetra) und auf finance.yahoo.com prüfen, dass Kursdaten vorhanden sind.
2. **Datenabruf erweitern:** in `scripts/fetch-data.mjs` das Symbol in die Liste aufnehmen:
   ```js
   const SYMBOLS = ['SPCX', 'TSLA', 'SIE.DE', 'PBR', 'GC=F', 'OKLO', 'SAP.DE'];
   ```
3. **Schaltfläche ergänzen:** in `site/app.js` einen Eintrag `[Symbol, Beschriftung]` hinzufügen:
   ```js
   const CHIPS = [..., ['OKLO', 'Oklo'], ['SAP.DE', 'SAP']];
   ```
4. **Optional lokal testen:** `node scripts/fetch-data.mjs` ausführen und den Ordner `site/` über einen lokalen Webserver aufrufen (z. B. `python3 -m http.server --directory site`).
5. **Cache-Version erhöhen:** in `site/sw.js` die Konstante `C` (z. B. `aktien-v19` → `aktien-v20`) anheben, damit installierte Apps die neue Version laden.
6. **Committen und pushen:** Der Push startet den Workflow, der die Daten abruft und die Seite neu veröffentlicht.

Die Währung wird automatisch aus den Yahoo-Daten übernommen (bekannte Symbole: $, €, £, ¥, CHF, R$). Die Inflationsbereinigung steht für USD- und EUR-Werte zur Verfügung; für andere Währungen ist „Real“ deaktiviert (Zuordnung `CPI_FOR` in `site/app.js`).

## Ordnerstruktur

```
.
├── .github/
│   └── workflows/
│       └── pages.yml          # Datenabruf (alle 5 Min.) und Veröffentlichung auf GitHub Pages
├── scripts/
│   ├── fetch-data.mjs         # Abruf der Kursdaten von Yahoo Finance → site/data/*.json
│   └── fetch-cpi.mjs          # Abruf der Preisindizes (BLS, Eurostat) → site/data/cpi_*.json
├── tools/
│   └── make-icon.py           # Erzeugt das App-Symbol als SVG (site/icon.svg)
├── site/                      # Veröffentlichte statische Website
│   ├── index.html             # Seite, Layout und Styles
│   ├── app.js                 # App-Logik (Chart, Zeiträume, Inflationsbereinigung, Aktualisierung)
│   ├── lwc.js                 # TradingView Lightweight Charts (lokale Kopie)
│   ├── sw.js                  # Service Worker
│   ├── manifest.webmanifest   # PWA-Manifest
│   ├── icons/                 # App-Symbole (PNG, inkl. maskable und Apple-Touch-Icon)
│   ├── icon.svg               # Symbol-Quelle (SVG)
│   ├── favicon-16.png, favicon-32.png
│   ├── icon-192.png, icon-512.png, apple-touch-icon.png   # ältere Symboldateien, nicht mehr im Manifest
│   └── data/                  # wird im Workflow erzeugt (nicht im Repository)
├── CHANGELOG.md               # Änderungsprotokoll (Version 1.0 und Entwicklungsverlauf)
└── README.md                  # Diese Dokumentation
```
