'use strict';
const $ = id => document.getElementById(id);
const RANGES = ['1T', '5T', '1J', '5J', '10J', '20J', 'Max'];
const INTRA = { '1T': 1, '5T': 1, '1J': 1 };
const CHIPS = [['SPCX', 'SpaceX'], ['TSLA', 'Tesla'], ['SIE.DE', 'Siemens'], ['PBR', 'Petrobras'], ['GC=F', 'Gold (Future)'], ['OKLO', 'Oklo']];
const safe = s => s.replace(/[^A-Za-z0-9.]/g, '_');
const st = { sym: CHIPS.some(c => c[0] === localStorage.sym) ? localStorage.sym : 'SPCX', range: ['1T', '5T', '1J', '5J', '10J', '20J', 'Max'].includes(localStorage.range) ? localStorage.range : '1T', type: localStorage.type || 'candle', data: null, raw: null, pct: false, pctBase: null, pctMode: false /* Start: Kurs */, real: false /* Start: nominal */, gold: false /* Start: Währung */, aux: null, timer: null };
const nf = (v, d = 2) => v == null || isNaN(v) ? '–' : v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
// „Prozent“: intern Index (Beginn = 100) auf log. Achse, angezeigt als Veränderung seit Beginn (Index − 100)
const pf = v => { const d = v - 100, a = Math.abs(d), s = nf(a, a >= 1000 ? 0 : 1); return (s === nf(0, a >= 1000 ? 0 : 1) ? '' : d > 0 ? '+' : '\u2212') + s + ' %'; };
// Verhältnis Aktie/Gold in Unzen, 3 gültige Ziffern (mind. 2 Nachkommastellen), z. B. „0,0912 oz“
const of = v => v > 0 ? nf(v, Math.min(8, Math.max(2, 2 - Math.floor(Math.log10(v))))).replace(/(,\d\d\d*?)0+$/, '$1') + ' oz' : '–'; // überflüssige Endnullen weg (mind. 2 Nachkommastellen)
const vf = v => v >= 1e9 ? nf(v / 1e9, 2) + ' Mrd.' : v >= 1e6 ? nf(v / 1e6, 2) + ' Mio.' : v >= 1e3 ? nf(v / 1e3, 1) + ' Tsd.' : nf(v, 0);
const CUR = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF', BRL: 'R$' };
// Zeitstempel in lokale Gerätezeit verschieben (Chart arbeitet in UTC)
const loc = t => t - new Date(t * 1000).getTimezoneOffset() * 60;
const fmtDate = (t, withTime) => { const d = new Date(t * 1000); const o = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }; if (withTime) { o.hour = '2-digit'; o.minute = '2-digit'; } return d.toLocaleString('de-DE', o); };

const chart = LightweightCharts.createChart($('chart'), {
  autoSize: true,
  layout: { background: { color: '#0d1117' }, textColor: '#8b949e', fontSize: 11, fontFamily: 'system-ui' },
  grid: { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
  rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.08, bottom: 0.25 }, mode: LightweightCharts.PriceScaleMode.Logarithmic }, // Preisachse immer logarithmisch (Volumen-Skala bleibt linear)
  timeScale: { borderColor: '#30363d', timeVisible: true, secondsVisible: false, rightOffset: 0, minBarSpacing: 0.01, fixLeftEdge: true, fixRightEdge: true },
  crosshair: { mode: LightweightCharts.CrosshairMode.Normal, vertLine: { color: '#58a6ff88', labelBackgroundColor: '#1f6feb' }, horzLine: { color: '#58a6ff88', labelBackgroundColor: '#1f6feb' } },
  localization: { locale: 'de-DE', priceFormatter: p => p < 0 ? '' : st.pct ? pf(p) : st.goldOn ? of(p) : nf(p, p > 0 && p < 1 ? 4 : 2), // keine negativen Achsenwerte im Volumen-Randbereich; im Modus „Prozent“ als Veränderung
    timeFormatter: t => fmtDate(t, !!INTRA[st.range]) },
  handleScale: { axisPressedMouseMove: { time: true, price: false } },
});
const volume = chart.addHistogramSeries({ priceScaleId: 'vol', priceFormat: { type: 'volume' }, lastValueVisible: false, priceLineVisible: false });
chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
const candles = chart.addCandlestickSeries({ upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' });
const area = chart.addAreaSeries({ lineColor: '#58a6ff', topColor: 'rgba(88,166,255,.35)', bottomColor: 'rgba(88,166,255,0)', lineWidth: 2, visible: false });

function setType(t) {
  st.type = localStorage.type = t;
  candles.applyOptions({ visible: t === 'candle' }); area.applyOptions({ visible: t !== 'candle' });
  $('tCandle').classList.toggle('on', t === 'candle'); $('tArea').classList.toggle('on', t !== 'candle');
}
$('tCandle').onclick = () => setType('candle'); $('tArea').onclick = () => setType('area');

$('ranges').innerHTML = RANGES.map(r => `<button data-r="${r}">${r}</button>`).join('');
$('ranges').onclick = e => { const r = e.target.dataset.r; if (r) { st.range = localStorage.range = r; load(true); } };
$('chips').innerHTML = CHIPS.map(([s, n]) => `<button data-s="${s}">${n}</button>`).join('');
$('chips').onclick = e => { const s = e.target.dataset.s; if (s) pick(s); };
function pick(s) { st.sym = localStorage.sym = s; load(true); }

function marketState(m) {
  const now = Date.now() / 1000, p = m.currentTradingPeriod || {};
  if (p.regular && now >= p.regular.start && now < p.regular.end) return 'regular';
  if (p.pre && now >= p.pre.start && now < p.pre.end) return 'pre';
  if (p.post && now >= p.post.start && now < p.post.end) return 'post';
  return 'closed';
}

async function load(fit) {
  document.querySelectorAll('#ranges button').forEach(b => b.classList.toggle('on', b.dataset.r === st.range));
  document.querySelectorAll('#chips button').forEach(b => b.classList.toggle('on', b.dataset.s === st.sym));
  if (fit) $('msg').textContent = 'Lade Kursdaten …', $('msg').style.display = 'flex';
  let j;
  try { const r = await fetch(`./data/${safe(st.sym)}_${st.range}.json?t=${Date.now()}`, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); j = await r.json(); }
  catch (e) { $('msg').textContent = 'Keine Verbindung zum Server.'; $('msg').style.display = 'flex'; return schedule('closed'); }
  const r = j && j.chart && j.chart.result && j.chart.result[0];
  if (!r || !r.timestamp) { st.raw = null; $('msg').textContent = `Für „${st.sym}“ wurden keine Kursdaten gefunden.`; $('msg').style.display = 'flex'; candles.setData([]); area.setData([]); volume.setData([]); updateRealUI(null); return schedule('closed'); }
  $('msg').style.display = 'none';
  st.raw = j;
  st.aux = goldAvail(r.meta) && st.gold ? await loadAux(r.meta) : null;
  render(fit);
  schedule(marketState(r.meta));
}

// Modus „Gold“: Kurs geteilt durch Goldpreis (GC=F, USD je Unze) zum selben Zeitpunkt = Unzen Gold je Aktie.
// Bei Euro-Werten wird der Goldpreis mit EURUSD=X (USD je EUR) zum selben Zeitpunkt in Euro umgerechnet.
const goldAvail = m => !!m && st.sym !== 'GC=F' && (m.currency === 'USD' || m.currency === 'EUR');
async function getJson(sym) {
  const r = await fetch(`./data/${safe(sym)}_${st.range}.json?t=${Date.now()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error(r.status);
  const x = (await r.json()).chart.result[0]; if (!x || !x.timestamp) throw new Error('leer'); return x;
}
async function loadAux(m) {
  try { const [g, fx] = await Promise.all([getJson('GC=F'), m.currency === 'EUR' ? getJson('EURUSD=X') : null]); return { g, fx }; }
  catch (e) { return { err: true }; }
}
// Reihe für Zuordnung: Tageskerzen über das Kalenderdatum (in der Zeitzone der jeweiligen Börse), Intraday über den Zeitstempel;
// fehlende Werte werden mit dem letzten vorherigen Wert aufgefüllt
const DAY = 86400, dkey = (t, off) => Math.floor((t + off) / DAY);
function series(x, daily) {
  const off = x.meta.gmtoffset || 0, c = x.indicators.quote[0].close, out = [];
  for (let i = 0; i < x.timestamp.length; i++) if (c[i] != null && c[i] > 0) { const k = daily ? dkey(x.timestamp[i], off) : x.timestamp[i]; if (out.length && out[out.length - 1][0] === k) out[out.length - 1][1] = c[i]; else out.push([k, c[i]]); }
  return out;
}
function stepper(s) { let i = -1; return k => { while (i + 1 < s.length && s[i + 1][0] <= k) i++; return i >= 0 ? s[i][1] : null; }; } // Schlüssel aufsteigend abfragen

// Inflationsbereinigung: Preisindex je Währung (USD → US-VPI, EUR → HVPI DE)
const CPI = {}, NO_REAL = { '1T': 1, '5T': 1 }, CPI_FOR = { USD: 'us', EUR: 'de' };
async function loadCpi() {
  await Promise.all(['us', 'de'].map(async k => {
    try { const r = await fetch(`./data/cpi_${k}.json?t=${Date.now()}`, { cache: 'no-store' }); if (r.ok) CPI[k] = await r.json(); } catch (e) {}
  }));
  CPI.loadedAt = Date.now();
  if (st.raw) render(false);
}
const cpiOf = m => m && CPI[CPI_FOR[m.currency]];
const realOn = m => st.real && !NO_REAL[st.range] && !!cpiOf(m) && !st.goldOn;
// Monatswert (Stufenmethode); nach dem letzten verfügbaren Monat wird dieser fortgeschrieben
function cpiAt(c, t) {
  const d = new Date(t * 1000), k = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  return c.values[k] ?? (k > c.last ? c.values[c.last] : c.values[c.first]);
}
function updateRealUI(m) {
  const avail = !!cpiOf(m) && !NO_REAL[st.range] && !st.goldOn, on = avail && st.real;
  $('tNom').disabled = $('tReal').disabled = !avail;
  $('realTog').classList.toggle('dis', !avail);
  $('realTog').title = !m ? '' : st.goldOn ? 'Im Gold-Modus ohne Bedeutung (die Inflation kürzt sich im Verhältnis heraus)' : NO_REAL[st.range] ? 'Bei 1T/5T ohne Bedeutung' : !cpiOf(m) ? 'Für diese Währung nicht verfügbar' : 'Inflationsbereinigung';
  const ga = goldAvail(m);
  $('tCur').disabled = $('tGold').disabled = !ga;
  $('goldTog').classList.toggle('dis', !ga);
  $('goldTog').title = !m ? '' : st.sym === 'GC=F' ? 'Beim Gold selbst ohne Bedeutung' : !ga ? 'Für diese Währung nicht verfügbar' : 'Kurs in Unzen Gold je Aktie';
  $('tCur').classList.toggle('on', !st.goldOn); $('tGold').classList.toggle('on', st.goldOn);
  $('tNom').classList.toggle('on', !on); $('tReal').classList.toggle('on', on);
  $('tKurs').classList.toggle('on', !st.pctMode); $('tPct').classList.toggle('on', st.pctMode);
  const c = cpiOf(m), base = c ? `${c.last.slice(5)}/${c.last.slice(0, 4)}` : '';
  const gx = m && m.currency === 'EUR' ? ', in € über EURUSD=X' : '', gFrom = st.goldFrom ? `, ab ${fmtDate(st.goldFrom)} (ältere ${gx ? 'Gold-/Wechselkursdaten' : 'Golddaten'} fehlen)` : '';
  const txt = st.goldOn ? (st.pctMode ? `In Gold: Veränderung seit Beginn (Unzen Gold je Aktie, GC=F${gx})${gFrom}` : `In Gold: Unzen Gold je Aktie (GC=F${gx})${gFrom}`)
    : st.gold && ga && st.aux && st.aux.err ? 'Goldkurs derzeit nicht verfügbar – Anzeige in Währung'
    : on ? (st.pctMode ? `Inflationsbereinigt (${c.label}), Veränderung seit Beginn, Preise von ${base}` : `Inflationsbereinigt (${c.label}), in Preisen von ${base}`)
    : (st.pctMode && m ? 'Nominal, Veränderung seit Beginn' : '');
  $('reallabel').textContent = txt;
  $('reallabel').style.display = txt ? 'block' : 'none';
}
function setPct(v) { st.pctMode = v; if (st.raw) render(false); else updateRealUI(null); }
$('tKurs').onclick = () => setPct(false); $('tPct').onclick = () => setPct(true);
function setReal(v) { st.real = v; if (st.raw) render(false); }
function setGold(v) { st.gold = v; if (st.raw) load(false); }
$('tCur').onclick = () => setGold(false); $('tGold').onclick = () => setGold(true);
$('tNom').onclick = () => setReal(false); $('tReal').onclick = () => setReal(true);

function render(fit) {
  const j = st.raw, r = j.chart.result[0], m = r.meta, q = r.indicators.quote[0], ts = r.timestamp, cs = [], ar = [], vs = [];
  // Gold-Modus: Goldpreis (in Währung des Werts) je Balken; Tageskerzen über das Datum, Intraday über den letzten vorherigen Goldkurs
  const ax = st.aux, daily = !INTRA[st.range];
  st.goldOn = !!(st.gold && goldAvail(m) && ax && ax.g); st.goldFrom = null;
  let goldAt = null;
  if (st.goldOn) {
    const gS = stepper(series(ax.g, daily)), fS = ax.fx ? stepper(series(ax.fx, daily)) : null, off = m.gmtoffset || 0;
    goldAt = t => { const k = daily ? dkey(t, off) : t, g = gS(k); if (g == null) return null; if (!fS) return g; const fx = fS(k); return fx ? g / fx : null; };
  }
  const useReal = realOn(m), c = useReal ? cpiOf(m) : null, base = c ? c.values[c.last] : 1;
  let skipped = 0;
  for (let i = 0; i < ts.length; i++) {
    let o = q.open[i], h = q.high[i], l = q.low[i], cl = q.close[i];
    if (o == null || cl == null) continue;
    const t = loc(ts[i]); if (cs.length && t <= cs[cs.length - 1].time) continue;
    if (c) { const f = base / cpiAt(c, ts[i]); o *= f; h *= f; l *= f; cl *= f; }
    if (goldAt) { const g = goldAt(ts[i]); if (!g) { skipped++; continue; } o /= g; h /= g; l /= g; cl /= g; } // alle Werte des Balkens durch den Gold-Schlusskurs desselben Tages bzw. Zeitpunkts
    cs.push({ time: t, open: o, high: h, low: l, close: cl }); ar.push({ time: t, value: cl });
    vs.push({ time: t, value: q.volume[i] || 0, color: cl >= o ? 'rgba(38,166,154,.45)' : 'rgba(239,83,80,.45)' });
  }
  if (goldAt && skipped && cs.length) st.goldFrom = cs[0].time; // Wert älter als die Golddaten: erst ab Beginn der Golddaten
  st.ratio = goldAt && cs.length ? [cs[0].open, cs[cs.length - 1].close] : null;
  const pfmt = goldAt && !st.pctMode ? { type: 'price', precision: 8, minMove: 1e-8 } : { type: 'price', precision: 2, minMove: 0.01 };
  candles.applyOptions({ priceFormat: pfmt }); area.applyOptions({ priceFormat: pfmt });
  // „Prozent“: als Index darstellen – Eröffnung des ersten Balkens = 100 (weiterhin logarithmische Achse), angezeigt als 0,0 %
  st.pct = st.pctMode && cs.length > 0; st.pctBase = st.pct ? cs[0].open : null;
  if (st.pct) { const k = 100 / st.pctBase; for (const b of cs) { b.open *= k; b.high *= k; b.low *= k; b.close *= k; } for (const x of ar) x.value *= k; }
  // War vorher der ganze Zeitraum sichtbar (nicht hineingezoomt), nach dem Aktualisieren wieder ganz anzeigen
  const lr = chart.timeScale().getVisibleLogicalRange(), prevN = st.data ? st.data.cs.length : 0;
  const wasFull = !fit && lr && lr.from <= 0.5 && lr.to >= prevN - 1.5;
  candles.setData(cs); area.setData(ar); volume.setData(vs);
  // Dezente 0-%-Linie im Real-Modus
  for (const [s, k] of [[candles, 'zc'], [area, 'za']]) { if (st[k]) { s.removePriceLine(st[k]); st[k] = null; } if (st.pct) st[k] = s.createPriceLine({ price: 100, color: 'rgba(139,148,158,.45)', lineWidth: 1, lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: false, title: '' }); }
  chart.applyOptions({ timeScale: { timeVisible: !!INTRA[st.range] } });
  if (fit || wasFull) fitAll();
  st.data = { cs, vs, m };
  $('legend').textContent = ''; // keine veralteten Fadenkreuzwerte nach Wechsel
  renderQuote(m, cs);
  renderFresh(j.fetchedAt);
  updateRealUI(m);
}

// Gesamten Zeitraum anzeigen (auch tausende Tageskerzen auf schmalem Handy-Bildschirm)
// Bei Größenänderung (z. B. Drehen des Telefons) Gesamtansicht beibehalten, solange nicht selbst gezoomt/verschoben wurde
let userMoved = false;
for (const ev of ['pointerdown', 'touchstart', 'wheel']) $('chart').addEventListener(ev, () => { userMoved = true; }, { passive: true });
new ResizeObserver(() => { if (!userMoved && st.data) fitAll(); }).observe($('chartwrap'));
function fitAll() {
  userMoved = false;
  const ts = chart.timeScale();
  ts.fitContent();
  requestAnimationFrame(() => ts.fitContent());
  setTimeout(() => ts.fitContent(), 60);
}

function renderQuote(m, cs) {
  const cur = CUR[m.currency] || (m.currency ? m.currency + ' ' : ''), price = m.regularMarketPrice;
  $('name').textContent = `${m.longName || m.shortName || m.symbol} · ${m.symbol} · ${m.fullExchangeName || m.exchangeName || ''}`;
  $('price').textContent = `${nf(price)} ${cur}`;
  let pct = m.regularMarketChangePercent, abs;
  if (pct == null && m.previousClose) pct = (price / m.previousClose - 1) * 100;
  if (pct != null) abs = price - price / (1 + pct / 100);
  const sg = v => Math.abs(v) < 0.005 ? '' : v > 0 ? '+' : '\u2212'; // Vorzeichen mit typografischem Minus
  let rangeTxt = '';
  if (st.range !== '1T' && cs.length) { const f = st.pct ? st.pctBase : cs[0].open, rp = st.ratio ? (st.ratio[1] / st.ratio[0] - 1) * 100 : (price / f - 1) * 100; rangeTxt = ` · ${st.range}${st.ratio ? ' in Gold' : realOn(m) ? ' real' : ''}: ${rp > 0 ? '+' : rp < 0 ? '\u2212' : ''}${nf(Math.abs(rp))} %`; }
  $('chg').style.color = (pct || 0) >= 0 ? 'var(--up)' : 'var(--down)';
  $('chg').textContent = pct == null ? '' : `${sg(abs)}${nf(Math.abs(abs))} (${sg(pct)}${nf(Math.abs(pct))} %) ${marketState(m) === 'regular' ? 'heute' : 'letzter Handelstag'}${rangeTxt}`;
  const s = marketState(m), names = { regular: 'Börse geöffnet', pre: 'Vorbörslich', post: 'Nachbörslich', closed: 'Börse geschlossen' };
  const t = new Date(m.regularMarketTime * 1000).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  let ext = '';
  if (s !== 'regular' && m.fulldayPrice && Math.abs(m.fulldayPrice - price) > 1e-6) ext = ` · ${s === "pre" ? "Vorbörslich" : "Nachbörslich"} zuletzt: ${nf(m.fulldayPrice)} ${cur} (${m.fulldayChangePercent >= 0 ? '+' : ''}${nf(m.fulldayChangePercent)} %)`;
  $('state').innerHTML = `<span class="dot ${s === 'regular' ? 'live' : ''}"></span>${names[s]} · Stand: ${t} Uhr${ext}`;
  const first = m.firstTradeDate;
  $('note').textContent = first && Date.now() / 1000 - first < 3 * 365 * 86400 ? `Börsennotiert seit ${new Date(first * 1000).toLocaleDateString('de-DE')} – ältere Kurse gibt es nicht.` : '';
  document.title = `${m.symbol} ${nf(price)} – Aktien-Chart`;
}

function renderFresh(f) {
  if (!f) { $('fresh').textContent = ''; return; }
  const age = (Date.now() / 1000 - f) / 60, t = new Date(f * 1000).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  $('fresh').textContent = `Daten abgerufen: ${t} Uhr (vor ${age < 1 ? 'weniger als 1' : Math.round(age)} Min.)${age > 30 ? ' – Aktualisierung verzögert' : ''}`;
  $('fresh').style.color = age > 30 ? '#d29922' : 'var(--mut)';
}
function schedule(s) {
  clearTimeout(st.timer);
  st.timer = setTimeout(() => load(false), s === 'closed' ? 300000 : 60000);
}

chart.subscribeCrosshairMove(p => {
  if (!st.data) return;
  const c = p.time && p.seriesData.get(candles) || p.time && p.seriesData.get(area);
  if (!c) { $('legend').textContent = ''; return; }
  const v = p.seriesData.get(volume), d = fmtDate(p.time, !!INTRA[st.range]);
  if (st.pct) { // Prozentwerte, dahinter (realer bzw. nominaler) Schlusskurs in Klammern
    const cur = CUR[st.data.m.currency] || '', real = (c.close ?? c.value) * st.pctBase / 100, rs = st.goldOn ? of(real) : `${nf(real)} ${cur}`;
    $('legend').textContent = c.open != null
      ? `${d}  E ${pf(c.open)}  H ${pf(c.high)}  T ${pf(c.low)}  S ${pf(c.close)} (${rs})  Vol ${v ? vf(v.value) : '–'}`
      : `${d}  ${pf(c.value)} (${rs})  Vol ${v ? vf(v.value) : '–'}`;
    return;
  }
  if (st.goldOn) {
    $('legend').textContent = c.open != null
      ? `${d}  E ${of(c.open)}  H ${of(c.high)}  T ${of(c.low)}  S ${of(c.close)}  Vol ${v ? vf(v.value) : '–'}`
      : `${d}  ${of(c.value)}  Vol ${v ? vf(v.value) : '–'}`;
    return;
  }
  $('legend').textContent = c.open != null
    ? `${d}  E ${nf(c.open)}  H ${nf(c.high)}  T ${nf(c.low)}  S ${nf(c.close)}  Vol ${v ? vf(v.value) : '–'}`
    : `${d}  ${nf(c.value)}  Vol ${v ? vf(v.value) : '–'}`;
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) { load(false); if (Date.now() - (CPI.loadedAt || 0) > 6 * 3600e3) loadCpi(); } });

setType(st.type);
load(true);
loadCpi();
