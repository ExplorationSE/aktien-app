# Hinweise zu Fremdbestandteilen

Der eigene Code von ExplorationSE Aktien steht unter der MIT-Lizenz (siehe [LICENSE](LICENSE)). Die folgenden Bestandteile stammen von Dritten und unterliegen ihren eigenen Lizenzen bzw. Nutzungsbedingungen. Es werden keine Bibliotheken über ein CDN nachgeladen; alle Programmbestandteile liegen lokal im Repository.

## Mitgelieferte Software und Schriften

| Bestandteil | Datei | Lizenz | Hinweise |
|---|---|---|---|
| TradingView Lightweight Charts™ 4.2.3, © 2025 TradingView, Inc. | `site/lwc.js` (lokale Kopie, unverändert, Standalone-Build) | Apache License 2.0 | Lizenztext: [`licenses/lightweight-charts-LICENSE.txt`](licenses/lightweight-charts-LICENSE.txt); Lizenzkopf in `site/lwc.js` erhalten. Keine NOTICE-Datei im Paket. Namensnennung von TradingView: Das TradingView-Logo mit Link auf tradingview.com wird im Chart angezeigt (Option `attributionLogo`, Standardwert aktiv, in der App nicht abgeschaltet). |
| fancy-canvas 2.1.0, © TradingView, Inc. | in `site/lwc.js` eingebunden | MIT | Abhängigkeit von Lightweight Charts |
| Schrift Marcellus, © 2012 Brian J. Bonislawsky DBA Astigmatic (AOETI) | `site/fonts/explorationse-aktien.woff2` (Teilmenge „ExplorationSE Aktien“) | SIL Open Font License 1.1 | Lizenztext: `site/fonts/OFL.txt`; veränderte Fassung unter eigenem Namen „ExplorationSE Aktien Subset“ (siehe `site/fonts/LIESMICH.txt`) |

„TradingView“ und „Lightweight Charts“ sind Marken der TradingView, Inc.

## Daten (nicht von der MIT-Lizenz erfasst)

| Quelle | Verwendung | Bedingungen |
|---|---|---|
| Yahoo Finance (inoffizielle Chart-Schnittstelle) | Kurse, Volumen, Dividenden | Nutzungsbedingungen von Yahoo; Daten nur zur privaten Information |
| Deutsche Bundesbank, Statistik-API | Bund-Rendite 10J, Goldfixing, DM-/EZB-Wechselkurse | Nutzungsbedingungen der Bundesbank, Quellenangabe „Deutsche Bundesbank“ (in der Fußzeile) |
| U.S. Bureau of Labor Statistics (BLS) | US-Verbraucherpreisindex | gemeinfrei (US-Bundesbehörde), Quellenangabe erbeten |
| Eurostat (HVPI Deutschland) | deutscher Preisindex | Eurostat-Weiterverwendungsregeln (CC BY 4.0), Quellenangabe „Eurostat“ |
| Weltbank „Pink Sheet“ über datahub.io (core/gold-prices) | Gold-Monatswerte 01/1999–08/2000 (`scripts/gold-bridge-1999-2000.json`) | Public Domain laut datahub.io; Ursprungsdaten Weltbank (CC BY 4.0) |
