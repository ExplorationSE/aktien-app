// Holt Verbraucherpreisindizes für die Inflationsbereinigung (höchstens einmal pro Tag)
//  - US-VPI: BLS CPI-U, alle Städte, nicht saisonbereinigt (CUUR0000SA0), API v1 ohne Schlüssel
//  - HVPI DE: Eurostat prc_hicp_minr (coicop18=TOTAL, 2025=100), ohne Schlüssel
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const LIVE = 'https://explorationse.github.io/aktien-app/data/';
const DAY = 86400, now = Math.floor(Date.now() / 1000);
fs.mkdirSync('site/data', { recursive: true });
const curl = (args) => {
  const out = execFileSync('curl', ['-sS', '--max-time', '40', '-A', 'Mozilla/5.0', '-w', '\n%{http_code}', ...args], { encoding: 'utf8', maxBuffer: 32 << 20 });
  const i = out.lastIndexOf('\n'), code = out.slice(i + 1).trim();
  if (code !== '200') throw new Error('HTTP ' + code);
  return JSON.parse(out.slice(0, i));
};
const ym = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
// Fehlende Monate zwischen erstem und letztem Wert linear interpolieren
function fillGaps(v) {
  const keys = Object.keys(v).sort(), out = {}, interpolated = [];
  let [y, m] = keys[0].split('-').map(Number); const last = keys[keys.length - 1];
  const all = []; while (ym(y, m) <= last) { all.push(ym(y, m)); if (++m > 12) { m = 1; y++; } }
  all.forEach((k, i) => {
    if (v[k] != null) { out[k] = v[k]; return; }
    let a = i - 1, b = i + 1; while (v[all[a]] == null) a--; while (v[all[b]] == null) b++;
    out[k] = +(v[all[a]] + (v[all[b]] - v[all[a]]) * (i - a) / (b - a)).toFixed(3); interpolated.push(k);
  });
  return { values: out, interpolated };
}
function bls() {
  const v = {}, endY = new Date().getUTCFullYear();
  for (let s = 1996; s <= endY; s += 10) {
    const j = curl(['-H', 'Content-Type: application/json', '-d', JSON.stringify({ seriesid: ['CUUR0000SA0'], startyear: String(s), endyear: String(Math.min(s + 9, endY)) }), 'https://api.bls.gov/publicAPI/v1/timeseries/data/']);
    if (j.status !== 'REQUEST_SUCCEEDED') throw new Error('BLS: ' + j.status + ' ' + (j.message || []).join(' '));
    for (const d of j.Results.series[0].data) if (/^M(0[1-9]|1[0-2])$/.test(d.period) && !isNaN(parseFloat(d.value))) v[ym(d.year, +d.period.slice(1))] = parseFloat(d.value);
  }
  return { label: 'US-VPI', source: 'BLS CPI-U, alle Städte, nicht saisonbereinigt (CUUR0000SA0)', ...fillGaps(v) };
}
function eurostat() {
  const j = curl(['https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?format=JSON&geo=DE&coicop18=TOTAL&unit=I25&lang=en']);
  const idx = j.dimension.time.category.index, inv = Object.fromEntries(Object.entries(idx).map(([k, i]) => [i, k])), v = {};
  for (const [i, val] of Object.entries(j.value)) v[inv[i]] = val;
  const r = { label: 'HVPI DE', source: 'Eurostat HVPI Deutschland, 2025=100 (prc_hicp_minr)', ...fillGaps(v) };
  const lastI = Math.max(...Object.keys(j.value).map(Number)); if ((j.status || {})[lastI] === 'e') r.estimated = [inv[lastI]];
  return r;
}
for (const [file, fn] of [['cpi_us.json', bls], ['cpi_de.json', eurostat]]) {
  let prev = null;
  try { const r = await fetch(LIVE + file + '?t=' + now); if (r.ok) prev = await r.json(); } catch {}
  // Erneuter Abruf frühestens nach 24 h; nach einem Fehlschlag frühestens nach 3 h (schont das BLS-Tageslimit)
  if (prev && (now - prev.fetchedAt < DAY || now - (prev.lastAttempt || 0) < 3 * 3600)) { fs.writeFileSync('site/data/' + file, JSON.stringify(prev)); console.log(file, 'aktuell (Abruf vor', Math.round((now - prev.fetchedAt) / 3600), 'h) – übernommen'); continue; }
  try {
    const d = fn(), keys = Object.keys(d.values).sort();
    const out = { ...d, first: keys[0], last: keys[keys.length - 1], fetchedAt: now };
    fs.writeFileSync('site/data/' + file, JSON.stringify(out)); console.log(file, 'neu abgerufen', out.first, '–', out.last, 'interpoliert:', out.interpolated.join(',') || '–');
  } catch (e) {
    console.warn(file, 'Abruf fehlgeschlagen:', e.message);
    if (prev) { fs.writeFileSync('site/data/' + file, JSON.stringify({ ...prev, lastAttempt: now })); console.log(file, 'vorherige Datei übernommen'); }
  }
}
