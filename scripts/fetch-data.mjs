// Holt Kursdaten von Yahoo Finance und schreibt sie als JSON nach site/data/
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const SYMBOLS = (process.env.ONLY ? process.env.ONLY.split(',') : ['SPCX', 'TSLA', 'SIE.DE', 'PBR', 'GC=F', 'OKLO', 'EURUSD=X']); // EURUSD=X: Umrechnung des Goldpreises in € (Modus „Gold“)
const RANGES = { '1T': ['1d', '1m'], '5T': ['5d', '1m'], '1J': ['1y', '1h'], '5J': ['5y', '1d'], '10J': ['10y', '1d'], '20J': ['20y', '1d'], 'Max': ['max', '1d'] };
const LIVE = 'https://explorationse.github.io/aktien-app/data/';
const safe = s => s.replace(/[^A-Za-z0-9.]/g, '_');
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync('site/data', { recursive: true });
// curl statt fetch: Yahoo blockt Node-fetch häufig mit HTTP 429
async function get(url) {
  const out = execFileSync('curl', ['-sS', '--max-time', '20', '-A', 'Mozilla/5.0', '-H', 'Accept: application/json', '-w', '\n%{http_code}', url], { encoding: 'utf8', maxBuffer: 64 << 20 });
  const i = out.lastIndexOf('\n'), code = out.slice(i + 1).trim();
  if (code !== '200') throw new Error('HTTP ' + code);
  return JSON.parse(out.slice(0, i));
}
let ok = 0, fallback = 0, failed = 0;
const status = {};
for (const sym of SYMBOLS) for (const [rk, [range, interval]] of Object.entries(RANGES)) {
  const file = `${safe(sym)}_${rk}.json`, path = `site/data/${file}`;
  let done = false;
  for (let attempt = 0; attempt < 4 && !done; attempt++) {
    const host = attempt % 2 ? 'query2' : 'query1';
    try {
      const j = await get(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?${range === 'max' ? 'period1=0&period2=' + Math.floor(Date.now() / 1000) : 'range=' + range}&interval=${interval}&includePrePost=false`);
      const res = j?.chart?.result?.[0];
      if (!res?.timestamp?.length) throw new Error('leer');
      delete res.meta.validRanges;
      fs.writeFileSync(path, JSON.stringify({ fetchedAt: Math.floor(Date.now() / 1000), symbol: sym, range: rk, interval, chart: { result: [res] } }));
      ok++; done = true; status[file] = 'ok';
    } catch (e) { console.warn(sym, rk, host, e.message); await sleep(1500 * (attempt + 1)); }
  }
  if (!done) { // Vorherige veröffentlichte Daten behalten, damit die Seite nie leer ist
    try { const r = await fetch(LIVE + file); if (!r.ok) throw 0; fs.writeFileSync(path, await r.text()); fallback++; status[file] = 'alt'; }
    catch { failed++; status[file] = 'fehlt'; }
  }
  await sleep(250);
}
fs.writeFileSync('site/data/status.json', JSON.stringify({ generatedAt: Math.floor(Date.now() / 1000), ok, fallback, failed, files: status }));
console.log({ ok, fallback, failed });
if (ok === 0 && fallback === 0) process.exit(1);
