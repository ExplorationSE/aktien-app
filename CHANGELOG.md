# Änderungsprotokoll

Alle Änderungen an der ExSE Aktien-Chart-App, abgeleitet aus der Git-Historie. Zeitangaben in MESZ. Die Versionsnummer entspricht der Cache-Version des Service Workers (`aktien-vN`).

## v11 – 09.10.2026

- `921c2e6` (18:38) – Schalter „Kerzen | Linie“ vollständig lesbar und symmetrisch (beide Hälften gleich breit, eigene zentrierte Zeile unter den Zeiträumen).

## v10 – 09.10.2026

- `7ab75c7` (18:11) – Zeiträume neu: 1T, 5T, 1J, 5J, 10J, 20J, Max. 1M und 6M entfernt; 10J und 20J mit Tageskerzen.

## v9 – 09.10.2026

- `7faaf99` (18:00) – Log-Schalter entfernt; die Preisachse ist immer logarithmisch.

## v8 – 09.10.2026

- `6c5dab4` (17:38) – App-Symbole für Android und Firefox überarbeitet: nur noch PNG-Symbole (48–512 px, keine SVG), große `<link rel="icon">` 512/192 px, separate *maskable*-Dateien, neue Dateinamen (`icons/*-v8-*`); der Service Worker fängt Manifest und Symbole nicht mehr ab.

## v7 – 09.10.2026

- `722d8b9` (17:31) – Symbol mit realistischem Kursverlauf wiederhergestellt.

## v6 – 09.10.2026

- `6ede9f2` (17:25) – Vorheriges ExSE-Symbol (Zickzack-Linie) wiederhergestellt.

## v5 – 09.10.2026

- `cc73562` (17:18) – Logarithmische Preisachse mit Log-Schalter (standardmäßig aktiv).

## v4 – 09.10.2026

- `ef7a96d` (17:09) – Chart zeigt stets den gesamten gewählten Zeitraum (1T–Max), auch bei Tausenden von Kerzen auf schmalen Bildschirmen.

## v3 – 09.10.2026

- `71de132` (16:51) – App-Symbol: natürlicherer, feinerer Kursverlauf.
- `e412b87` (16:46) – Neues App-Symbol „ExSE“ (Preußischblau auf Schwarz), Favicons, Apple-Touch-Icon.
- `7ddebe3` (16:45) – Oklo (`OKLO`, NYSE) als feste Auswahl hinzugefügt.

## v2 – 09.10.2026

- `b19fe7f` (16:10) – Zeitraum „Max“ mit Tageskerzen statt monatlicher Kerzen.
- `1c41c97` (16:08) – Erste Version: Aktien-Chart-PWA auf GitHub Pages mit automatischem Kursdatenabruf per GitHub Actions (SpaceX, Tesla, Siemens, Petrobras, Gold).
