// Holt Zeitreihen der Deutschen Bundesbank (ohne Schlüssel), höchstens einmal pro Kalendertag (ab 12 Uhr UTC, nach der
// Veröffentlichung des Vortageswerts), sonst wird die zuletzt veröffentlichte Datei übernommen:
//  - Bund 10J: Umlaufsrendite börsennotierter Bundeswertpapiere, Restlaufzeit über 9 bis 10 Jahre, ungewogen (ab 1989)
//  - Frankfurter Goldfixing in DM je kg (1968–1998) und Devisenkurs DM je USD (bis 1998): verlängern GC=F nach hinten
//  - EZB-Referenzkurs USD je EUR (ab 1999): verlängert EURUSD=X (Yahoo ab 12/2003) nach hinten
//  - EZB-Referenzkurs KRW je EUR (ab 1999): ergibt mit USD je EUR den Kurs KRW je USD und verlängert KRW=X (Yahoo ab 12/2003) nach hinten
// Ergebnis: site/data/bbk.json (Rohdaten, von fetch-data.mjs für die Verkettung genutzt) und BUND10J_<Zeitraum>.json im Yahoo-Format
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const LIVE = 'https://explorationse.github.io/aktien-app/data/';
const API = 'https://api.statistiken.bundesbank.de/rest/data/';
const DAY = 86400, now = Math.floor(Date.now() / 1000);
const SERIES = {
  bund: ['BBSIS', 'D.I.UMU.RD.EUR.S1311.B.A604.R0910.R.A.A._Z._Z.A'],
  goldDem: ['BBEX3', 'D.XAU.DEM.EA.AC.C01'],
  demUsd: ['BBEX3', 'D.USD.DEM.AA.AC.000'],
  usdEur: ['BBEX3', 'D.USD.EUR.BB.AC.000'],
  krwEur: ['BBEX3', 'D.KRW.EUR.BB.AC.000'],
};
fs.mkdirSync('site/data', { recursive: true });
function getCsv(flow, key) {
  const out = execFileSync('curl', ['-sS', '--max-time', '60', '-A', 'Mozilla/5.0', '-w', '\n%{http_code}', `${API}${flow}/${key}?format=csv&lang=en`], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const i = out.lastIndexOf('\n'), code = out.slice(i + 1).trim();
  if (code !== '200') throw new Error(`${flow}/${key}: HTTP ${code}`);
  const lines = out.slice(0, i).split('\n'), title = (lines[1] || '').split(',').slice(1, -1).join(',').replace(/^"|"$/g, '');
  const values = [];
  for (const l of lines) { const m = /^(\d{4}-\d{2}-\d{2}),([^,]*)/.exec(l); if (m && m[2] !== '.' && m[2] !== '') values.push([m[1], +m[2].replace(/"/g, '')]); }
  if (values.length < 100) throw new Error(`${flow}/${key}: nur ${values.length} Werte`);
  return { id: `${flow}.${key}`, title, values };
}
const due = p => { if (!p || Object.keys(SERIES).some(k => !p.series?.[k])) return true; // auch bei neu hinzugekommener Reihe sofort abrufen
  const d = new Date(now * 1000), today = Math.floor(now / DAY);
  const fetchedDay = Math.floor(p.fetchedAt / DAY), triedRecently = now - (p.lastAttempt || 0) < 3 * 3600;
  return !triedRecently && (now - p.fetchedAt >= DAY || (fetchedDay < today && d.getUTCHours() >= 12)); };
let prev = null;
try { const r = await fetch(LIVE + 'bbk.json?t=' + now); if (r.ok) prev = await r.json(); } catch {}
let data = prev;
if (due(prev)) {
  try {
    const series = {}; for (const [k, [f, key]] of Object.entries(SERIES)) series[k] = getCsv(f, key);
    data = { fetchedAt: now, series };
    console.log('Bundesbank neu abgerufen:', Object.entries(series).map(([k, s]) => `${k} ${s.values[0][0]}–${s.values.at(-1)[0]} (${s.values.length})`).join('; '));
  } catch (e) {
    console.warn('Bundesbank-Abruf fehlgeschlagen:', e.message);
    if (prev) { data = { ...prev, lastAttempt: now }; console.log('vorherige Bundesbank-Daten übernommen'); }
  }
} else console.log('Bundesbank-Daten aktuell (Abruf vor', Math.round((now - prev.fetchedAt) / 3600), 'h) – übernommen');
if (!data) { console.warn('Keine Bundesbank-Daten'); process.exit(0); }
fs.writeFileSync('site/data/bbk.json', JSON.stringify(data));

// Bund 10J als Chart-Dateien (Tageswerte; Eröffnung = Hoch = Tief = Schluss)
const b = data.series.bund, ts = d => Date.parse(d + 'T00:00:00Z') / 1000;
function chartOf(vals) {
  const last = b.values.at(-1), prevV = b.values.at(-2);
  const meta = { currency: 'EUR', symbol: 'BUND10J', exchangeName: 'Bundesbank', fullExchangeName: 'Deutsche Bundesbank', instrumentType: 'INDEX', bbk: true,
    longName: 'Bund 10J Rendite (Umlaufsrendite Bundeswertpapiere, Restlaufzeit 9–10 J.)', shortName: 'Bund 10J', gmtoffset: 0, timezone: 'UTC', dataGranularity: '1d',
    regularMarketPrice: last[1], previousClose: prevV[1], chartPreviousClose: prevV[1], regularMarketTime: ts(last[0]) + 12 * 3600, firstTradeDate: ts(b.values[0][0]), source: b.id, sourceTitle: b.title };
  const c = vals.map(v => v[1]);
  return { meta, timestamp: vals.map(v => ts(v[0])), indicators: { quote: [{ open: c, high: c, low: c, close: c, volume: c.map(() => 0) }] } };
}
const lastT = ts(b.values.at(-1)[0]);
for (const [rk, years] of [['1J', 1], ['5J', 5], ['10J', 10], ['20J', 20], ['Max', 0]]) {
  let vals = b.values;
  if (years) { const d = new Date(lastT * 1000); d.setUTCFullYear(d.getUTCFullYear() - years); const from = d.toISOString().slice(0, 10); vals = vals.filter(v => v[0] >= from); }
  fs.writeFileSync(`site/data/BUND10J_${rk}.json`, JSON.stringify({ fetchedAt: data.fetchedAt, symbol: 'BUND10J', range: rk, interval: '1d', source: 'bbk', chart: { result: [chartOf(vals)] } }));
}
console.log('Bund 10J:', b.values.at(-1).join(' '), '%');
