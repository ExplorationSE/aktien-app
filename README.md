# ExSE Aktien

Mobile Web-App (PWA) zur Anzeige interaktiver Aktiencharts auf dem Android-Smartphone – mit langer Kurshistorie, hoher Zeitauflösung und regelmäßig aktualisierten Kursdaten.

**Aktuelle Version:** 1.9.1 (11.10.2026) – siehe [CHANGELOG.md](CHANGELOG.md)  
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

| Schaltfläche | Symbol | Wert | Börse / Markt | Währung | Historie ab | Hinweis | Deaktiviert (zusätzlich zu Real/Div. bei 1T/5T) |
|---|---|---|---|---|---|---|---|
| SpaceX | `SPCX` | Space Exploration Technologies Corp. | Nasdaq | USD | 12.06.2026 | | – |
| Tesla | `TSLA` | Tesla, Inc. | Nasdaq | USD | 2010 | | – |
| Siemens | `SIE.DE` | Siemens AG | Xetra | EUR | 1996 | | – |
| Petrobras | `PBR` | Petróleo Brasileiro S.A. (ADR) | NYSE | USD | 2000 | | – |
| Öl (Brent) | `BZ=F` | Brent-Future (vorderster Kontrakt) | NYMEX | USD | 2007 | Brent statt WTI (`CL=F`): WTI notierte am 20.04.2020 negativ, was auf der log. Achse nicht darstellbar ist | Mit Div. |
| Gold | `GC=F` | Gold-Future (vorderster Kontrakt) | COMEX | USD | 1968 | Yahoo ab 30.08.2000; davor Frankfurter Goldfixing (Bundesbank) und interpolierte Brücke 1999–08/2000, siehe [Gold-Modus](#gold-modus) | Gold, Mit Div. |
| Kazatomprom | `KAP.IL` | NAC Kazatomprom (GDR) | London (IOB) | USD | 11/2018 | | – |
| Cresud | `CRESY` | Cresud S.A.C.I.F. y A. (ADR) | Nasdaq | USD | 1997 | intraday wenig Umsatz (1T mit wenigen Balken) | – |
| Oklo | `OKLO` | Oklo Inc. | NYSE | USD | 2021 | | – |
| Ondas | `ONDS` | Ondas Holdings Inc. | Nasdaq | USD | 12/2020 | | – |
| Quantum Computing | `QUBT` | Quantum Computing Inc. | Nasdaq | USD | 2007 | frühe Kurse stammen von der Vorgängergesellschaft (Mantel) | – |
| Rigetti | `RGTI` | Rigetti Computing, Inc. | Nasdaq | USD | 04/2021 | | – |
| Dow Jones | `^DJI` | Dow Jones Industrial Average | DJI | USD (Punkte) | 1992 | Kursindex | Mit Div. |
| MSCI World | `^990100-USD-STRD` | MSCI World (Kursindex, USD; 23 Industrieländer) | MSCI | USD (Punkte) | 1972 | Yahoo liefert keine Währung – als USD festgelegt | Mit Div. |
| MSCI ACWI | `^892400-USD-STRD` | MSCI ACWI (Kursindex, USD) | MSCI | USD (Punkte) | 1988 | Yahoo liefert keine Währung – als USD festgelegt | Mit Div. |
| Welt ex USA (ETF EFA) | `EFA` | iShares MSCI EAFE ETF | NYSE Arca | USD | 2001 | **Stellvertreter** für „Welt ohne USA“: Industrieländer Europa, Australasien, Fernost (ohne USA **und ohne Kanada**). Die MSCI-Indizes World ex USA / ACWI ex USA liefern bei Yahoo keine Tageshistorie; VEU (2007) und ACWX (2008) sind kürzer | – |
| Schwellenländer (ETF EEM) | `EEM` | iShares MSCI Emerging Markets ETF | NYSE Arca | USD | 2003 | **Stellvertreter** für den MSCI EM: Der Index selbst (`^891800-USD-STRD`) liefert bei Yahoo keine Tageshistorie | – |
| DAX (Performance) | `^GDAXI` | DAX **Performanceindex** (Dividenden reinvestiert) | Xetra | EUR (Punkte) | 30.12.1987 | Ersetzt den DAX-Kursindex `^GDAXIP` (bei Yahoo erst ab 03/2013). Enthält die Dividenden bereits – im Vergleich mit Kursindizes (Dow Jones, MSCI) erscheint er um die Dividendenrendite (grob 2–3 % p. a.) stärker | Mit Div. (Dividenden bereits enthalten) |
| Deutschland (ETF EWG) | `EWG` | iShares MSCI Germany ETF | NYSE Arca | USD | 03/1996 | **Stellvertreter** für den MSCI Germany, **in USD** (enthält also den Euro-/DM-Wechselkurs). MSCI Germany (`^928000-EUR-STRD` u. a.) und FTSE Germany (`WIDEU.FGI`) liefern bei Yahoo keine Tageshistorie | – |
| Euro-Raum (ETF EZU) | `EZU` | iShares MSCI Eurozone ETF | NYSE Arca | USD | 07/2000 | Ersetzt den Euro Stoxx 50 (`^STOXX50E`, bei Yahoo erst ab 2007). Längste Tagesreihe für den ganzen Euro-Raum, **in USD** (enthält den Wechselkurs EUR/USD) | – |
| VIX | `^VIX` | CBOE Volatility Index | Cboe | Punkte | 1990 | Volatilitätsindex | Real, Gold, Mit Div. |
| US 10J Rendite | `^TNX` | Rendite 10-jähriger US-Staatsanleihen (CBOE) | Cboe | Prozent | 1962 | Anzeige als Rendite in %, **lineare Achse**; Zeitraum-Veränderung in Prozentpunkten („Pp.“) | Kurs/Prozent, Real, Gold, Mit Div. |
| Bund 10J Rendite | `BUND10J` | Umlaufsrendite börsennotierter Bundeswertpapiere, Restlaufzeit über 9 bis 10 Jahre, ungewogen (Bundesbank-Reihe `BBSIS.D.I.UMU.RD.EUR.S1311.B.A604.R0910.R.A.A._Z._Z.A`) | Deutsche Bundesbank | Prozent | 29.12.1989 | **Nur Tageswerte** (Abruf höchstens 1× täglich, Stand meist Vortag); **lineare Achse**, da die Rendite 2019–2021 an über 800 Tagen ≤ 0 % lag (Tiefstwert −0,85 %, 09.03.2020) | 1T, 5T, Kurs/Prozent, Real, Gold, Mit Div. |

Die Leiste ist eine einzelne, waagrecht wischbare Zeile; der gewählte Wert wird automatisch sichtbar gehalten. Indizes und VIX werden in Punkten („Pkt.“) angezeigt, die Renditen in Prozent. Die Preisachse ist logarithmisch, nur bei den beiden Renditen **linear** (Werte nahe null bzw. negativ). Bis Version 1.8.2 gewählte, inzwischen ersetzte Werte (`^GDAXIP`, `^STOXX50E`) werden beim Start automatisch auf `^GDAXI` bzw. `EZU` umgestellt.

**Volumen:** Bei Werten ohne nennenswerte Umsatzdaten (MSCI-Indizes, Renditen, Bundesbank) wird kein Volumen-Histogramm gezeichnet.

**ETFs in USD:** EFA, EWG, EZU und EEM werden in den USA in US-Dollar gehandelt. Ihr Kursverlauf enthält deshalb neben der Aktienentwicklung auch die Wechselkursentwicklung (z. B. EUR/USD); sie sind als Stellvertreter gekennzeichnet. Als ETFs haben sie Dividenden („Mit Div.“ verfügbar, über Yahoo „Adj. Close“).

**Regeln für die Schalter:** „Mit Div.“ nur bei Aktien und ETFs (Indizes sind Kursindizes – außer dem DAX, der als Performanceindex die Dividenden bereits enthält; Rohstoffe und Volatilität ohne Dividenden). „Real“ für USD- und EUR-Werte, nicht beim VIX und bei den Renditen. „Gold“ für USD- und EUR-Werte, nicht beim Gold selbst, beim VIX und bei den Renditen. „Kurs/Prozent“ bei den Renditen deaktiviert (eine prozentuale Veränderung einer Rendite ist ohne Bedeutung, bei Werten um null bzw. negativ nicht berechenbar), sonst immer verfügbar. „Kerzen/Linie“ immer verfügbar. Beim Bund sind die Zeiträume 1T und 5T deaktiviert (nur Tageswerte); der gewählte Zeitraum bleibt gespeichert und gilt wieder, sobald ein anderer Wert gewählt wird.

**VDAX-NEW** ist nicht enthalten: Yahoo Finance bietet den Index nicht an (geprüft u. a. `^VDAX`, `V1X.DE`, `^V1X`, `^VDAXI`, auch VSTOXX `^V2TX`), und eine andere freie, automatisiert abrufbare Quelle ohne Zugangsschutz steht nicht zur Verfügung.

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

Bei Werten mit kürzerer Börsenhistorie (z. B. SpaceX seit 12.06.2026, Oklo seit 2021) zeigt die Zeitachse in 1J, 5J, 10J und 20J trotzdem den **ganzen gewählten Zeitraum** (z. B. 10 Jahre bis heute); die Kurse erscheinen nur im rechten Teil, davor bleibt der Chart leer (leere Balken in gleicher Dichte wie die Daten: Mo–Fr, bei 1J stündlich). „Max“ zeigt die gesamte verfügbare Historie ohne Auffüllung – im Gold-Modus ab dem ersten Kurs des Werts, auch wenn die Golddaten erst später beginnen. Im Modus „Prozent“ liegt 0 % weiterhin beim ersten echten Balken. Bei jungen Börsennotierungen erscheint zusätzlich ein Hinweis.

### Darstellung

- **Logarithmische Preisachse** – stets aktiv; prozentuale Bewegungen sind dadurch über lange Zeiträume vergleichbar. Das Volumen wird linear dargestellt.
- **Kerzen / Linie** – Umschaltung zwischen Kerzenchart und Linien-/Flächenchart (feine Linie, 1 px).
- **Kurs / Prozent** – „Kurs“ zeigt die Preisachse in der Handelswährung; „Prozent“ zeigt die Veränderung seit Beginn des gewählten Zeitraums: Die Eröffnung des ersten Balkens entspricht **0,0 %**, darüber bzw. darunter die Veränderung mit Vorzeichen (z. B. „+582,1 %“, „−35,2 %“). Die logarithmische Skalierung bleibt erhalten (intern Index mit Beginn = 100); eine dezente gestrichelte Linie markiert 0 %. Im Fadenkreuz stehen die Prozentwerte, dahinter der Kurs in Klammern. „Prozent“ ist in allen Zeiträumen verfügbar.
- **Nominal / Real** – Umschaltung auf inflationsbereinigte Kurse (siehe [Inflationsbereinigung](#inflationsbereinigung)); bei 1T und 5T deaktiviert.
- Beide Schalter sind unabhängig voneinander kombinierbar: *Nominal + Kurs* (Kurse), *Nominal + Prozent* (nominale Veränderung), *Real + Kurs* (inflationsbereinigte Kurse in heutigem Geld), *Real + Prozent* (inflationsbereinigte Veränderung).
- **Währung / Gold** – „Gold“ zeigt den Kurs als Verhältnis **Aktienkurs ÷ Goldpreis**, also in **Unzen Gold je Aktie** (Achse z. B. „0,0907 oz“, siehe [Gold-Modus](#gold-modus)). Kombinierbar mit „Kurs / Prozent“ (Prozent = Veränderung des Verhältnisses seit Beginn). „Real“ ist im Gold-Modus deaktiviert, da sich die Inflation in einem Verhältnis zweier Werte gleicher Währung herauskürzt. Beim Gold selbst ist der Schalter deaktiviert.
- **Ohne / Mit Div.** – „Mit Div.“ zeigt die **Gesamtrendite inkl. Dividenden** (siehe [Dividenden](#dividenden)); kombinierbar mit allen anderen Schaltern. Bei 1T und 5T sowie beim Gold deaktiviert.
- Beim Öffnen der App ist stets **Nominal + Kurs + Währung + Ohne** (Dividenden) aktiv.
- **Schalterleiste** – oben „Kerzen | Linie“, „Kurs | Prozent“, „Ohne | Mit Div.“, darunter zentriert „Nominal | Real“ und „Währung | Gold“; alle Schalter gleich breit mit gleich großen Hälften. Passt ein Text nicht vollständig (sehr schmale Bildschirme oder große Systemschrift), weicht die Leiste automatisch auf zwei Spalten aus.
- **Chart-Ränder** – links bündig mit dem Text (14 px), rechts (einschließlich Preisachse) bündig mit den Schaltflächen darunter (6 px); die Kurse reichen bis an die Preisachse (kein Leerraum rechts).
- **Kompaktes Layout** – die App passt ohne Scrollen auf den Bildschirm (getestet u. a. 412×915, 384×854, 360×800, 360×740 sowie abzüglich Browserleisten); der Chart füllt die verbleibende Höhe (`100dvh`).
- **Volle Zeitraumanzeige** – nach dem Laden und bei jedem Wechsel von Wert oder Zeitraum wird der gesamte gewählte Zeitraum vom ersten bis zum letzten Datenpunkt eingepasst. Mit zwei Fingern kann hineingezoomt werden; ein gewählter Zoom bleibt bei der automatischen Aktualisierung erhalten.
- **Fadenkreuz** mit Anzeige von Eröffnung (E), Hoch (H), Tief (T), Schluss (S) und Volumen.
- **Kursanzeige** mit Tagesveränderung, Veränderung im gewählten Zeitraum, Börsenstatus (geöffnet, vor-/nachbörslich, geschlossen) sowie vor-/nachbörslichem Kurs, sofern vorhanden.
- Deutsche Zahlen- und Datumsformate; Uhrzeiten in der Ortszeit des Geräts.
- Dunkles, für Smartphones optimiertes Design.
- **Fußzeile** „ExSE Aktien · Daten: Yahoo, Bundesbank · Keine Anlageberatung · v…“ (Versionsnummer seit 1.9.1 als „v1.9.1“, damit die Zeile mit beiden Datenquellen ab 360 px einzeilig bleibt); der Name „ExSE Aktien“ in der Schrift Marcellus wie im App-Symbol. Ab 360 px Bildschirmbreite einzeilig, darunter Umbruch nur zwischen den Abschnitten. Der Seitentitel lautet ebenfalls „ExSE Aktien“. Die Schrift liegt als winzige Teilmenge (nur diese Zeichen, ca. 2 KB) unter `site/fonts/` und wird vom Service Worker zwischengespeichert, funktioniert also auch offline. Lizenz: SIL Open Font License 1.1 (`site/fonts/OFL.txt`); die Teilmenge trägt als veränderte Fassung den eigenen Namen „ExSE Name Subset“.

### Gold-Modus

- Jeder Balken wird durch den Goldpreis (`GC=F`, USD je Feinunze, vorderster COMEX-Future) **zum selben Zeitpunkt** geteilt: Eröffnung, Hoch, Tief und Schluss jeweils durch den Gold-Schlusskurs desselben Tages (Tageskerzen) bzw. durch den letzten Goldkurs zu oder vor dem Zeitpunkt des Balkens (1T, 5T, 1J). Tageskerzen werden über das Kalenderdatum in der Zeitzone der jeweiligen Börse zugeordnet; fehlt an einem Tag ein Goldkurs, wird der letzte vorherige verwendet.
- **Euro-Werte (Siemens, DAX):** Der Goldpreis wird mit dem Wechselkurs `EURUSD=X` (USD je EUR) zum selben Zeitpunkt in Euro umgerechnet: Verhältnis = Kurs in € ÷ (Gold in USD ÷ EURUSD). Die Wechselkursdaten werden dazu im Workflow mit abgerufen.
- **Verlängerte Goldhistorie (ab Version 1.9)** – die Gold-Reihe für „Max“ ist aus drei Teilen verkettet (gilt für das Gold selbst und für den Gold-Modus):
  1. **18.06.1968 – 30.12.1998: Frankfurter Goldfixing** (Bundesbank, `BBEX3.D.XAU.DEM.EA.AC.C01`, DM je kg Feingold), umgerechnet mit dem Devisenkurs der Frankfurter Börse (`BBEX3.D.USD.DEM.AA.AC.000`, DM je USD) und 32,1507 Unzen je kg in **USD je Feinunze**. Kontrolle: 21.01.1980 rund 838 $ (London-Fixing 850 $), 30.12.1998 rund 288 $.
  2. **31.12.1998 – 29.08.2000: Brücke aus Monatswerten, linear interpoliert.** Für diese 20 Monate gibt es keine freie, automatisch abrufbare Tagesreihe (Frankfurter Fixing endete 1998, `GC=F` beginnt bei Yahoo am 30.08.2000, LBMA-Preise sind lizenzpflichtig). Stützpunkte: letzter Fixingwert, die Monatsdurchschnitte der Weltbank („Pink Sheet“, über datahub.io, Datei `scripts/gold-bridge-1999-2000.json`) jeweils zur Monatsmitte und der erste GC=F-Schlusskurs. **Tagesschwankungen fehlen in diesem Abschnitt**; die Kerzen sind dort flache Striche.
  3. **ab 30.08.2000: `GC=F`** (Yahoo Finance, vorderster COMEX-Future).
  Unterschiede zwischen Fixing (Kassapreis) und Future liegen typischerweise bei 0,1–0,5 %. Die Hinweiszeile nennt die Quellen, sobald der sichtbare Zeitraum vor den 30.08.2000 reicht („… GC=F, davor Frankfurter Goldfixing, 1999–08/2000 interpoliert“).
- **Verlängerter Wechselkurs EUR/USD:** `EURUSD=X` (Yahoo ab 01.12.2003) wird davor mit dem **EZB-Referenzkurs** (Bundesbank `BBEX3.D.USD.EUR.BB.AC.000`, ab 04.01.1999) und vor 1999 rechnerisch mit **1,95583 ÷ (DM je USD)** fortgeführt. Für Euro-Werte vor 1999 entspricht das genau dem Goldpreis in DM ÷ 1,95583, also dem Frankfurter Fixing in Euro-Gegenwert. Damit funktioniert der Gold-Modus z. B. beim DAX ab 1987 und bei Siemens ab 1996.
- Liegt der Beginn eines Werts dennoch vor dem Beginn der Gold- bzw. Wechselkursdaten, beginnt die Darstellung mit den ersten verfügbaren Golddaten; die Hinweiszeile nennt das Datum. Bei allen Presets ist das seit Version 1.9 nicht mehr der Fall (MSCI World ab 1972, DAX ab 1987 in Gold).
- Die Hinweiszeile lautet z. B. „In Gold: Unzen Gold je Aktie (GC=F)“; die Zeitraum-Veränderung neben der Tagesveränderung bezieht sich auf das Verhältnis („5J in Gold: …“). Großer Kurs und Tagesveränderung bleiben in der Handelswährung.

### Dividenden

- Grundlage ist der von Yahoo gelieferte **dividendenbereinigte Schlusskurs** („Adj. Close“, `adjclose`) der Tageskerzen. Je Balken wird der Faktor *f = adjclose ÷ close* gebildet und auf Eröffnung, Hoch, Tief und Schluss angewendet – für Hoch/Tief/Eröffnung ist das eine Näherung.
- Konvention wie bei Yahoo: Der **jüngste Balken entspricht dem aktuellen Kurs** (Faktor 1); ältere Kurse werden um die seither gezahlten Dividenden nach unten angepasst. Im Modus „Prozent“ ergibt sich so die Gesamtrendite seit Beginn des Zeitraums.
- **1J (Stundenkerzen):** Die Faktoren stammen aus den Tagesdaten des Zeitraums 5J und werden tageweise (stufenweise) angewendet.
- **1T/5T:** deaktiviert (innerhalb weniger Tage ohne Bedeutung). **Gold:** deaktiviert (keine Dividenden). Werte ohne Dividenden (z. B. Tesla) bleiben unverändert.
- Reihenfolge bei Kombinationen: zuerst Dividenden, dann Inflationsbereinigung („Real“) bzw. Verhältnis zum Goldpreis („Gold“).
- Hinweis: Kapitalmaßnahmen wie Abspaltungen (z. B. Siemens Healthineers, Siemens Energy) sind nur so weit berücksichtigt, wie Yahoo sie in `adjclose` einrechnet.
- Beispiele (09.10.2026): Siemens Max +1.134,9 % ohne bzw. +2.759,6 % mit Dividenden; Petrobras 5J +130,0 % bzw. +618,8 %; Tesla unverändert (+45,8 % in 5J).

### Inflationsbereinigung

Mit „Real“ werden die Kurse inflationsbereinigt – mit „Kurs“ als Preise in heutigem Geld, mit „Prozent“ als inflationsbereinigte Veränderung seit Beginn des Zeitraums.

- **Formel:** realer Kurs = nominaler Kurs × Preisindex (letzter verfügbarer Monat) ÷ Preisindex (Monat des Kurses). Es gilt die Stufenmethode: ein Indexwert je Kalendermonat.
- **Preisindex je Währung:** USD-Werte (SpaceX, Tesla, Petrobras-ADR, Gold-Future, Oklo) mit dem **US-Verbraucherpreisindex** (BLS CPI-U, alle Städte, nicht saisonbereinigt, Reihe `CUUR0000SA0`); EUR-Werte (Siemens) mit dem **Harmonisierten Verbraucherpreisindex Deutschland** (Eurostat, `prc_hicp_minr`, 2025 = 100).
- Für Monate, für die noch kein Indexwert veröffentlicht ist (US-Index erscheint etwa Mitte des Folgemonats), wird der letzte verfügbare Wert fortgeschrieben. Fehlende Einzelmonate in der Indexreihe (z. B. US-Index Oktober 2025) werden linear interpoliert. Der jüngste HVPI-Wert kann eine vorläufige Schätzung von Eurostat sein.
- Chart, Fadenkreuzwerte (E/H/T/S) und Zeitraum-Veränderung verwenden die bereinigten Werte; im Modus „Prozent“ steht hinter den Prozentwerten der reale Schlusskurs in Preisen des Basismonats. Die Zeitraum-Veränderung („… real“) bezieht sich auf die bereinigten Werte; der aktuelle Kurs oben bleibt nominal (er entspricht im laufenden Monat dem realen Wert). Eine Hinweiszeile nennt Index und Basismonat, z. B. „Inflationsbereinigt (US-VPI), in Preisen von 08/2026“ bzw. „Inflationsbereinigt (US-VPI), Veränderung seit Beginn, Preise von 08/2026“.
- Im Modus „Nominal“ werden wie bisher Kurse in der Handelswährung angezeigt.
- Bei **1T und 5T** ist die Umschaltung deaktiviert, da die Inflation über wenige Tage vernachlässigbar ist.
- **Beginn der Preisindizes:** Beide Indexreihen beginnen im Januar 1996. Kurse davor lassen sich nicht bereinigen; „Real“ zeigt deshalb bei längeren Reihen (z. B. MSCI World, DAX, Gold) erst ab 01/1996, die Hinweiszeile nennt das („…, ab 01/1996 (ältere Preisindexdaten fehlen)“). Bis Version 1.8.2 wurden ältere Kurse fälschlich mit dem Indexwert von 01/1996 bereinigt.
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
- **Workflow** `.github/workflows/pages.yml` („Kursdaten holen & Seite veröffentlichen“): läuft bei jedem Push auf `main`, per Zeitplan (`*/5 * * * *`) und manuell (`workflow_dispatch`). Er führt `scripts/fetch-bbk.mjs`, `scripts/fetch-data.mjs` und `scripts/fetch-cpi.mjs` aus und veröffentlicht den Ordner `site/` über `actions/upload-pages-artifact` und `actions/deploy-pages`. Die Kursdaten werden **nicht** in das Repository eingecheckt, die Versionshistorie bleibt dadurch schlank.
- **Preisindizes** `scripts/fetch-cpi.mjs`: lädt den US-VPI über die BLS-API v1 (ohne Schlüssel, je Anfrage max. 10 Jahre) und den HVPI Deutschland über die Eurostat-API (ohne Schlüssel) und schreibt `site/data/cpi_us.json` und `site/data/cpi_de.json` (Monatswerte ab 1996, Quelle, letzter Monat, interpolierte Monate). Der Abruf erfolgt **höchstens einmal pro Tag** (nach einem Fehlschlag frühestens nach 3 Stunden erneut); ansonsten wird die zuletzt veröffentlichte Datei übernommen. Der Schritt ist im Workflow fehlertolerant (`continue-on-error`): Ohne Indexdaten ist lediglich „Real“ nicht verfügbar.
- **Bundesbank** `scripts/fetch-bbk.mjs` (ab Version 1.9): lädt über die Zeitreihen-API der Bundesbank (`api.statistiken.bundesbank.de`, ohne Schlüssel, CSV) die Bund-Rendite 9–10 Jahre (ab 1989), das Frankfurter Goldfixing (1968–1998), den DM-Kurs je USD (bis 1998) und den EZB-Referenzkurs USD je EUR (ab 1999). Ergebnis: `site/data/bbk.json` (Rohdaten für die Verkettung) und `site/data/BUND10J_<1J|5J|10J|20J|Max>.json` im selben Format wie die Yahoo-Dateien. Abruf **höchstens einmal pro Kalendertag** (ab 12 Uhr UTC, wenn die Bundesbank den Vortageswert veröffentlicht hat; nach einem Fehlschlag frühestens nach 3 Stunden erneut), sonst wird die zuletzt veröffentlichte `bbk.json` übernommen. Der Schritt läuft vor dem Yahoo-Abruf und ist fehlertolerant: Ohne Bundesbank-Daten fehlen nur der Bund und die verlängerte Gold-/Wechselkurshistorie.
- **Datenabruf** `scripts/fetch-data.mjs`: lädt für jedes Symbol (22 Yahoo-Werte plus `EURUSD=X` für den Gold-Modus) fünf Zeiträume von Yahoo Finance – 1T, 5T, 1J, 5J und Max (per `curl`, mit Wiederholungsversuchen über `query1`/`query2`) – und schreibt je eine Datei `site/data/<SYMBOL>_<ZEITRAUM>.json` (Sonderzeichen im Symbol werden durch `_` ersetzt, z. B. `GC_F_Max.json`) sowie `site/data/status.json` (mit Laufzeit). „Max“ wird mit einem festen Startzeitpunkt 99 Jahre vor heute abgefragt (`period1`, auch negativ, also vor 1970), damit Tageskerzen statt monatlicher Kerzen geliefert werden; Yahoo erlaubt je Abruf höchstens 100 Jahre Tagesdaten. Bis Version 1.8.2 begann die Abfrage bei `period1=0` (1.1.1970), dadurch fehlte z. B. bei der US-Rendite 1962–1969. Für `GC=F` und `EURUSD=X` wird die Max-Reihe anschließend mit den Bundesbank-Daten nach hinten verlängert (Angaben zu den Abschnitten in `meta.chain`). Die Tagesreihe für Max besteht aus der Max-Historie und – ab Beginn von 5J – den aktuelleren 5J-Balken; **10J und 20J werden daraus ausgeschnitten** (keine eigenen Abrufe). Liefert Yahoo den jüngsten Tagesbalken ohne Werte (häufig bei europäischen Börsen nach Handelsschluss), wird er aus den Minutenkerzen desselben Tages ergänzt. Insgesamt 115 Abrufe je Lauf (ca. 75–80 s). Schlägt ein Abruf fehl, wird die zuletzt veröffentlichte Datei übernommen, damit die Seite nie leer ist.
- **Service Worker** `site/sw.js`: speichert die App-Dateien für schnellen Start und Offline-Nutzung. Kursdaten werden stets zuerst aus dem Netz geladen (nur offline aus dem Zwischenspeicher); Manifest und Symbole werden nicht abgefangen. Bei Änderungen an App-Dateien wird die Cache-Version (`aktien-vN`) erhöht.
- **Manifest** `site/manifest.webmanifest`: Name und Kurzname „ExSE Aktien“, Anzeige *standalone*, Geltungsbereich `/aktien-app/`, ausschließlich PNG-Symbole (48–512 px) sowie separate *maskable*-Symbole.
- **Symbole** `site/icons/`: App-Symbole in allen Größen. Sie werden mit `tools/make-icon.py` als SVG (`site/icon.svg`, Schrift in Pfade umgewandelt) erzeugt und anschließend als PNG gerendert.

## Datenquelle und Einschränkungen

- **Yahoo Finance (inoffiziell):** Die Daten stammen von einer öffentlich erreichbaren, aber nicht offiziell dokumentierten Schnittstelle. Sie kann sich ohne Ankündigung ändern oder Anfragen begrenzen. In diesem Fall bleiben die zuletzt veröffentlichten Daten sichtbar und die App zeigt „Aktualisierung verzögert“.
- **Verzögerung:** Kurse können von Yahoo verzögert geliefert werden; hinzu kommt der Abrufrhythmus.
- **Zeitplan von GitHub:** Geplante Workflows werden von GitHub nicht garantiert pünktlich ausgeführt; insbesondere zu Spitzenzeiten verzögern sich Läufe oder entfallen. Realistisch ist eine Aktualisierung alle 5–15 Minuten.
- **Pause nach 60 Tagen:** In öffentlichen Repositories deaktiviert GitHub zeitgesteuerte Workflows, wenn im Repository 60 Tage lang keine Aktivität stattfand. Ein automatischer „Keepalive“ ist **nicht** eingerichtet. Prüfung und Abhilfe: Im Reiter *Actions* den Workflow „Kursdaten holen & Seite veröffentlichen“ öffnen und bei Bedarf **„Enable workflow“** wählen, oder einen Commit pushen. Ein Anzeichen ist der dauerhafte Hinweis „Aktualisierung verzögert“ in der App.
- **Gold** wird über den Future-Kontrakt `GC=F` (vorderster Monat, COMEX) dargestellt, nicht über den Kassakurs; das gilt auch für den Gold-Modus. Vor dem 30.08.2000 stammt die Reihe aus dem Frankfurter Goldfixing (Kassapreis) bzw. ist für 01/1999–08/2000 **aus Monatswerten interpoliert** (siehe [Gold-Modus](#gold-modus)).
- **DAX als Performanceindex:** `^GDAXI` enthält reinvestierte Dividenden, der Dow Jones und die MSCI-Indizes sind Kursindizes. Ein DAX-Kursindex mit langer Tageshistorie ist frei nicht verfügbar (`^GDAXIP` bei Yahoo erst ab 2013).
- **ETF-Stellvertreter in USD:** EFA (Welt ex USA, ohne Kanada), EWG (Deutschland) und EZU (Euro-Raum) bilden die Indizes nach Kosten ab und enthalten die Wechselkursentwicklung zum US-Dollar.
- **Bund 10J:** Tageswerte der Bundesbank (Umlaufsrendite, Restlaufzeit 9–10 Jahre, ungewogen) – nicht identisch mit der Rendite der jeweils aktuellen 10-jährigen Bundesanleihe, aber eng daran; Stand meist Vortag, kein Intraday.
- **Petrobras** wird über das an der NYSE gehandelte ADR `PBR` in USD dargestellt (alternativ wäre `PETR4.SA` in BRL möglich).
- **Preisindizes:** Die BLS-API v1 erlaubt ohne Schlüssel nur eine begrenzte Zahl von Abfragen pro Tag und IP-Adresse; GitHub-Runner teilen sich IP-Adressen. Bei Fehlschlägen bleibt der zuletzt veröffentlichte Index in Gebrauch. Indexwerte können nachträglich revidiert werden.
- **Keine freie Suche:** Da Yahoo direkte Abfragen aus dem Browser (CORS) nicht zulässt und kein eigener Server betrieben wird, stehen nur die vorab abgerufenen Werte zur Verfügung.

## Neuen Wert hinzufügen

1. **Symbol ermitteln:** das Yahoo-Finance-Symbol des Werts heraussuchen (z. B. `SAP.DE` für SAP an Xetra) und auf finance.yahoo.com prüfen, dass Kursdaten vorhanden sind.
2. **Datenabruf erweitern:** in `scripts/fetch-data.mjs` das Symbol in die Liste aufnehmen:
   ```js
   const SYMBOLS = [..., '^TNX', 'SAP.DE', 'EURUSD=X'];   // GC=F und EURUSD=X werden für den Gold-Modus benötigt
   ```
3. **Schaltfläche ergänzen:** in `site/app.js` einen Eintrag `[Symbol, Beschriftung, Art, Einheit im Gold-Modus, Währung, Zusatz]` hinzufügen (Zusatz optional: `{ perf: 1 }` Performanceindex, `{ daily: 1 }` nur Tageswerte) (Art: `a` Aktie, `e` ETF, `i` Index, `f` Future/Rohstoff, `v` Volatilität, `y` Rendite in %; Einheit und Währung optional):
   ```js
   const CHIPS = [..., ['^TNX', 'US 10J Rendite', 'y'], ['SAP.DE', 'SAP', 'a']];
   ```
4. **Optional lokal testen:** `node scripts/fetch-data.mjs` ausführen und den Ordner `site/` über einen lokalen Webserver aufrufen (z. B. `python3 -m http.server --directory site`).
5. **Cache-Version erhöhen:** in `site/sw.js` die Konstante `C` (z. B. `aktien-v31` → `aktien-v32`) anheben, damit installierte Apps die neue Version laden.
6. **Committen und pushen:** Der Push startet den Workflow, der die Daten abruft und die Seite neu veröffentlicht.

Die Währung wird automatisch aus den Yahoo-Daten übernommen (bekannte Symbole: $, €, £, ¥, CHF, R$). Die Inflationsbereinigung steht für USD- und EUR-Werte zur Verfügung; für andere Währungen ist „Real“ deaktiviert (Zuordnung `CPI_FOR` in `site/app.js`).

## Ordnerstruktur

```
.
├── .github/
│   └── workflows/
│       └── pages.yml          # Datenabruf (alle 5 Min.) und Veröffentlichung auf GitHub Pages
├── scripts/
│   ├── fetch-bbk.mjs          # Abruf Bundesbank (Bund 10J, Goldfixing, DM-/EZB-Kurse; 1× täglich) → site/data/bbk.json, BUND10J_*.json
│   ├── fetch-data.mjs         # Abruf der Kursdaten von Yahoo Finance → site/data/*.json (verlängert GC=F/EURUSD=X mit bbk.json)
│   ├── gold-bridge-1999-2000.json  # Monatsdurchschnitte Gold 01/1999–08/2000 (Weltbank) für die interpolierte Brücke
│   └── fetch-cpi.mjs          # Abruf der Preisindizes (BLS, Eurostat) → site/data/cpi_*.json
├── tools/
│   └── make-icon.py           # Erzeugt das App-Symbol als SVG (site/icon.svg)
├── site/                      # Veröffentlichte statische Website
│   ├── index.html             # Seite, Layout und Styles
│   ├── app.js                 # App-Logik (Chart, Zeiträume, Inflationsbereinigung, Gold-Modus, Dividenden, Aktualisierung)
│   ├── lwc.js                 # TradingView Lightweight Charts (lokale Kopie)
│   ├── sw.js                  # Service Worker
│   ├── manifest.webmanifest   # PWA-Manifest
│   ├── icons/                 # App-Symbole (PNG, inkl. maskable und Apple-Touch-Icon)
│   ├── fonts/                 # Schrift-Teilmenge für „ExSE Aktien“ (Marcellus, SIL OFL 1.1) mit OFL.txt und LIESMICH.txt
│   ├── icon.svg               # Symbol-Quelle (SVG)
│   ├── favicon-16.png, favicon-32.png
│   ├── icon-192.png, icon-512.png, apple-touch-icon.png   # ältere Symboldateien, nicht mehr im Manifest
│   └── data/                  # wird im Workflow erzeugt (nicht im Repository)
├── CHANGELOG.md               # Änderungsprotokoll (Version 1.0 und Entwicklungsverlauf)
└── README.md                  # Diese Dokumentation
```
