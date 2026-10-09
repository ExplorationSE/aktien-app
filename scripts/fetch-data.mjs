// Holt Kursdaten von Yahoo Finance und schreibt sie als JSON nach site/data/
// Je Symbol 5 Abrufe (1T, 5T, 1J, 5J, Max); 10J und 20J werden aus den Tagesdaten (Max, am Ende durch 5J ergänzt) ausgeschnitten.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const SYMBOLS = process.env.ONLY ? process.env.ONLY.split(',') : [
  'SPCX', 'TSLA', 'SIE.DE', 'PBR', 'BZ=F', 'GC=F', 'KAP.IL', 'CRESY', 'OKLO', 'ONDS', 'QUBT', 'RGTI',
  '^DJI', '^892400-USD-STRD', 'EEM', '^GDAXIP', '^STOXX50E', '^VIX', '^TNX',
  'EURUSD=X', // Umrechnung des Goldpreises in € (Modus „Gold“)
];
const FETCH = { '1T': ['1d', '1m'], '5T': ['5d', '1m'], '1J': ['1y', '1h'], '5J': ['5y', '1d'], 'Max': ['max', '1d'] };
const SLICE = { '10J': 10, '20J': 20 };
const LIVE = 'https://explorationse.github.io/aktien-app/data/';
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
      const j = get(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?${range === 'max' ? 'period1=0&period2=' + Math.floor(Date.now() / 1000) : 'range=' + range}&interval=${interval}&includePrePost=false`);
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
  const daily = got.Max || got['5J'] ? merge(got.Max, got['5J']) : null;
  if (got.Max) write(sym, 'Max', '1d', daily); else await keepOld(sym, 'Max');
  for (const [rk, y] of Object.entries(SLICE)) daily && got.Max ? write(sym, rk, '1d', sliceYears(daily, y)) : await keepOld(sym, rk);
}
fs.writeFileSync('site/data/status.json', JSON.stringify({ generatedAt: Math.floor(Date.now() / 1000), seconds: Math.round((Date.now() - t0) / 1000), ok, fallback, failed, files: status }));
console.log({ ok, fallback, failed, seconds: Math.round((Date.now() - t0) / 1000) });
if (ok === 0 && fallback === 0) process.exit(1);
