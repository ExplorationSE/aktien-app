// Holt Kursdaten von Yahoo Finance und schreibt sie als JSON nach site/data/
// Je Symbol 5 Abrufe (1T, 5T, 1J, 5J, Max); 10J und 20J werden aus den Tagesdaten (Max, am Ende durch 5J ergänzt) ausgeschnitten.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const SYMBOLS = process.env.ONLY ? process.env.ONLY.split(',') : [
  'SPCX', 'TSLA', 'SIE.DE', '9880.HK', '005380.KS', 'PBR', 'BZ=F', 'GC=F', 'KAP.IL', 'CRESY', 'OKLO', 'ONDS', 'QUBT', 'RGTI',
  '^DJI', '^990100-USD-STRD', '^892400-USD-STRD', 'EFA', 'EEM', '^GDAXI', 'EWG', 'EZU', '^VIX', '^TNX',
  'EURUSD=X', // Umrechnung des Goldpreises in € (Modus „Gold“)
  'HKD=X', 'KRW=X', // HKD bzw. KRW je USD: Goldpreis in HKD/KRW (Modus „Gold“), Umrechnung in USD (Modus „Real“)
];
const FETCH = { '1T': ['1d', '1m'], '5T': ['5d', '1m'], '1J': ['1y', '1h'], '5J': ['5y', '1d'], 'Max': ['max', '1d'] };
const SLICE = { '10J': 10, '20J': 20 };
const LIVE = 'https://explorationse.github.io/aktien-app/data/';
// Max: Yahoo erlaubt höchstens 100 Jahre Tagesdaten je Abruf – daher 99 Jahre zurück (auch vor 1970, negative Zeitstempel)
const MAX_FROM = Math.floor(Date.now() / 1000 - 99 * 365.25 * 86400);
const safe = s => s.replace(/[^A-Za-z0-9.]/g, '_');
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync('site/data', { recursive: true });
// curl statt fetch: Yahoo blockt Node-fetch häufig mit HTTP 429
function get(url) {
  const out = execFileSync('curl', ['-sS', '--max-time', '20', '-A', 'Mozilla/5.0', '-H', 'Accept: application/json', '-w', '\n%{http_code}', url], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const i = out.lastIndexOf('\n'), code = out.slice(i + 1).trim();
  if (code !== '200') throw new Error('HTTP ' + code);
  return JSON.parse(out.slice(0, i));
}
async function fetchRange(sym, range, interval) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const host = attempt % 2 ? 'query2' : 'query1';
    try {
      const j = get(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?${range === 'max' ? 'period1=' + MAX_FROM + '&period2=' + Math.floor(Date.now() / 1000) : 'range=' + range}&interval=${interval}&includePrePost=false`);
      const res = j?.chart?.result?.[0];
      if (!res?.timestamp?.length) throw new Error('leer');
      delete res.meta.validRanges;
      return res;
    } catch (e) { console.warn(sym, range, host, e.message); await sleep(1500 * (attempt + 1)); }
  }
  return null;
}
// Teilmenge der Balken (Indizes) eines Chart-Ergebnisses
function pick(res, idx) {
  const q = res.indicators.quote[0], a = res.indicators.adjclose?.[0]?.adjclose, out = { ...res, timestamp: idx.map(i => res.timestamp[i]), indicators: { quote: [{}] } };
  for (const k of Object.keys(q)) out.indicators.quote[0][k] = idx.map(i => q[k][i]);
  if (a) out.indicators.adjclose = [{ adjclose: idx.map(i => a[i]) }];
  return out;
}
const day = t => Math.floor(t / 86400);
// Tagesdaten: Max-Historie bis vor den Beginn von 5J, danach die (aktuelleren) 5J-Balken
function merge(max, y5) {
  if (!max) return y5; if (!y5) return max;
  const d0 = day(y5.timestamp[0]), a = pick(max, max.timestamp.map((t, i) => i).filter(i => day(max.timestamp[i]) < d0));
  const q = a.indicators.quote[0], q5 = y5.indicators.quote[0], out = { ...max, timestamp: a.timestamp.concat(y5.timestamp), indicators: { quote: [{}] } };
  for (const k of Object.keys(q5)) out.indicators.quote[0][k] = (q[k] || a.timestamp.map(() => null)).concat(q5[k]);
  const aa = a.indicators.adjclose?.[0]?.adjclose, a5 = y5.indicators.adjclose?.[0]?.adjclose;
  if (aa && a5) out.indicators.adjclose = [{ adjclose: aa.concat(a5) }];
  out.meta = { ...max.meta, ...y5.meta, firstTradeDate: max.meta.firstTradeDate ?? y5.meta.firstTradeDate };
  return out;
}
function sliceYears(res, years) {
  const last = new Date(res.timestamp[res.timestamp.length - 1] * 1000); last.setUTCFullYear(last.getUTCFullYear() - years);
  const from = last.getTime() / 1000;
  return pick(res, res.timestamp.map((t, i) => i).filter(i => res.timestamp[i] >= from - 86400));
}
// Yahoo liefert den letzten Tagesbalken (v. a. bei europäischen Börsen nach Handelsschluss) oft ohne Werte:
// dann aus den Minutenkerzen desselben Tages ergänzen (Eröffnung, Hoch, Tief, Schluss, Volumen)
function fillLast(d, intra) {
  if (!d || !intra) return d;
  const q = d.indicators.quote[0], i = d.timestamp.length - 1, off = d.meta.gmtoffset || 0;
  if (q.close[i] != null) return d;
  const qi = intra.indicators.quote[0], key = t => Math.floor((t + off) / 86400), k = key(d.timestamp[i]);
  const idx = intra.timestamp.map((t, j) => j).filter(j => key(intra.timestamp[j]) === k && qi.close[j] != null && qi.open[j] != null);
  if (!idx.length) return d;
  q.open[i] = qi.open[idx[0]]; q.close[i] = qi.close[idx[idx.length - 1]];
  q.high[i] = Math.max(...idx.map(j => qi.high[j] ?? -Infinity)); q.low[i] = Math.min(...idx.map(j => qi.low[j] ?? Infinity));
  q.volume[i] = idx.reduce((a, j) => a + (qi.volume[j] || 0), 0);
  const a = d.indicators.adjclose?.[0]?.adjclose; if (a) a[i] = q.close[i]; // jüngster Balken: Faktor 1
  return d;
}
// Verlängerung nach hinten mit Bundesbank-Daten (site/data/bbk.json aus fetch-bbk.mjs):
//  GC=F (ab 08/2000): Frankfurter Goldfixing DM/kg ÷ DM je USD ÷ 32,1507 = USD je Feinunze (1968–1998),
//    01/1999–08/2000 linear aus Monatsdurchschnitten interpoliert (scripts/gold-bridge-1999-2000.json)
//  EURUSD=X (ab 12/2003): EZB-Referenzkurs ab 1999; davor rechnerisch 1,95583 ÷ (DM je USD) (fester Umrechnungskurs DM/€)
const OZ_PER_KG = 32.1507466, DEM_PER_EUR = 1.95583;
let BBK = null; try { BBK = JSON.parse(fs.readFileSync('site/data/bbk.json', 'utf8')).series; } catch { console.warn('bbk.json fehlt – keine Verlängerung von GC=F/EURUSD=X'); }
const BRIDGE = JSON.parse(fs.readFileSync(new URL('./gold-bridge-1999-2000.json', import.meta.url), 'utf8'));
const dts = d => Date.parse(d + 'T00:00:00Z') / 1000, iso = t => new Date(t * 1000).toISOString().slice(0, 10);
function prepend(res, vals, chain) { // vals: [[Datum, Wert]] aufsteigend, alle vor dem ersten Yahoo-Balken
  if (!vals.length) return res;
  const off = res.meta.gmtoffset || 0, t = vals.map(v => dts(v[0]) - off), c = vals.map(v => +v[1].toPrecision(6));
  const q = res.indicators.quote[0], out = { ...res, timestamp: t.concat(res.timestamp), indicators: { quote: [{}] } };
  for (const k of Object.keys(q)) out.indicators.quote[0][k] = (k === 'volume' ? c.map(() => 0) : c).concat(q[k]);
  const a = res.indicators.adjclose?.[0]?.adjclose; if (a) out.indicators.adjclose = [{ adjclose: c.concat(a) }];
  out.meta = { ...res.meta, chain, firstTradeDate: t[0] };
  return out;
}
function firstDay(res) { const off = res.meta.gmtoffset || 0, c = res.indicators.quote[0].close; for (let i = 0; i < res.timestamp.length; i++) if (c[i] != null) return [iso(res.timestamp[i] + off), c[i]]; return null; }
function stepMap(vals) { let i = -1; return d => { while (i + 1 < vals.length && vals[i + 1][0] <= d) i++; return i >= 0 ? vals[i][1] : null; }; }
function extendGold(res) {
  if (!BBK?.goldDem || !BBK?.demUsd) return res;
  const f = firstDay(res); if (!f) return res;
  const fx = stepMap(BBK.demUsd.values), vals = [];
  for (const [d, dmKg] of BBK.goldDem.values) { if (d >= f[0]) break; const r = fx(d); if (r) vals.push([d, dmKg / r / OZ_PER_KG]); }
  if (!vals.length) return res;
  // Brücke: Stützpunkte letzter Fixingwert, Monatsdurchschnitte jeweils zur Monatsmitte, erster GC=F-Schlusskurs
  const last = vals.at(-1), pts = [[dts(last[0]), last[1]], ...Object.entries(BRIDGE.monthly).map(([m, v]) => [dts(m + '-15'), v]).filter(p => p[0] > dts(last[0]) && p[0] < dts(f[0])), [dts(f[0]), f[1]]];
  let bridgeFrom = null, bridgeTo = null;
  for (let t = dts(last[0]) + 86400, k = 0; t < dts(f[0]); t += 86400) {
    const wd = new Date(t * 1000).getUTCDay(); if (wd === 0 || wd === 6) continue;
    while (pts[k + 1][0] < t) k++;
    const [t0, v0] = pts[k], [t1, v1] = pts[k + 1]; vals.push([iso(t), v0 + (v1 - v0) * (t - t0) / (t1 - t0)]);
    bridgeFrom ??= iso(t); bridgeTo = iso(t);
  }
  return prepend(res, vals, [
    { from: vals[0][0], to: last[0], kind: 'fixing', text: 'Frankfurter Goldfixing (Bundesbank), DM/kg in USD/oz umgerechnet' },
    ...(bridgeFrom ? [{ from: bridgeFrom, to: bridgeTo, kind: 'interpoliert', text: 'aus Monatsdurchschnitten (Weltbank) linear interpoliert' }] : []),
    { from: f[0], kind: 'yahoo', text: 'GC=F (Yahoo Finance)' }]);
}
function extendEurUsd(res) {
  if (!BBK?.usdEur || !BBK?.demUsd) return res;
  const f = firstDay(res); if (!f) return res;
  const ecb = BBK.usdEur.values.filter(v => v[0] < f[0]), e0 = ecb.length ? ecb[0][0] : f[0];
  const dem = BBK.demUsd.values.filter(v => v[0] < e0).map(([d, r]) => [d, DEM_PER_EUR / r]);
  const vals = dem.concat(ecb);
  return prepend(res, vals, [
    ...(dem.length ? [{ from: dem[0][0], to: dem.at(-1)[0], kind: 'dm', text: 'rechnerisch aus DM je USD (Bundesbank) und 1,95583 DM/€' }] : []),
    ...(ecb.length ? [{ from: ecb[0][0], to: ecb.at(-1)[0], kind: 'ezb', text: 'EZB-Referenzkurs (Bundesbank)' }] : []),
    { from: f[0], kind: 'yahoo', text: 'EURUSD=X (Yahoo Finance)' }]);
}
//  KRW=X (ab 12/2003): EZB-Referenzkurs KRW je EUR ÷ USD je EUR = KRW je USD (ab 1999, nur Tage mit beiden Kursen)
function extendKrwUsd(res) {
  if (!BBK?.krwEur || !BBK?.usdEur) return res;
  const f = firstDay(res); if (!f) return res;
  const ue = new Map(BBK.usdEur.values), vals = BBK.krwEur.values.filter(v => v[0] < f[0] && ue.get(v[0])).map(([d, k]) => [d, k / ue.get(d)]);
  if (!vals.length) return res;
  return prepend(res, vals, [
    { from: vals[0][0], to: vals.at(-1)[0], kind: 'ezb', text: 'rechnerisch aus EZB-Referenzkursen KRW je EUR und USD je EUR (Bundesbank)' },
    { from: f[0], kind: 'yahoo', text: 'KRW=X (Yahoo Finance)' }]);
}
const EXTEND = { 'GC=F': extendGold, 'EURUSD=X': extendEurUsd, 'KRW=X': extendKrwUsd };
let ok = 0, fallback = 0, failed = 0;
const status = {};
const write = (sym, rk, interval, res) => { const file = `${safe(sym)}_${rk}.json`; fs.writeFileSync(`site/data/${file}`, JSON.stringify({ fetchedAt: Math.floor(Date.now() / 1000), symbol: sym, range: rk, interval, chart: { result: [res] } })); ok++; status[file] = 'ok'; };
async function keepOld(sym, rk) { // Vorherige veröffentlichte Daten behalten, damit die Seite nie leer ist
  const file = `${safe(sym)}_${rk}.json`;
  try { const r = await fetch(LIVE + file); if (!r.ok) throw 0; fs.writeFileSync(`site/data/${file}`, await r.text()); fallback++; status[file] = 'alt'; }
  catch { failed++; status[file] = 'fehlt'; }
}
const t0 = Date.now();
for (const sym of SYMBOLS) {
  const got = {};
  for (const [rk, [range, interval]] of Object.entries(FETCH)) { got[rk] = await fetchRange(sym, range, interval); await sleep(250); }
  got['5J'] = fillLast(got['5J'], got['1T']); got.Max = fillLast(got.Max, got['1T']);
  for (const rk of ['1T', '5T', '1J', '5J']) got[rk] ? write(sym, rk, FETCH[rk][1], got[rk]) : await keepOld(sym, rk);
  let daily = got.Max || got['5J'] ? merge(got.Max, got['5J']) : null;
  if (daily && got.Max && EXTEND[sym]) { const n = daily.timestamp.length; daily = EXTEND[sym](daily); console.log(sym, 'nach hinten verlängert um', daily.timestamp.length - n, 'Tage, ab', iso(daily.timestamp[0])); }
  if (got.Max) write(sym, 'Max', '1d', daily); else await keepOld(sym, 'Max');
  for (const [rk, y] of Object.entries(SLICE)) daily && got.Max ? write(sym, rk, '1d', sliceYears(daily, y)) : await keepOld(sym, rk);
}
fs.writeFileSync('site/data/status.json', JSON.stringify({ generatedAt: Math.floor(Date.now() / 1000), seconds: Math.round((Date.now() - t0) / 1000), ok, fallback, failed, files: status }));
console.log({ ok, fallback, failed, seconds: Math.round((Date.now() - t0) / 1000) });
if (ok === 0 && fallback === 0) process.exit(1);
