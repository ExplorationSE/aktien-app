'use strict';
const $ = id => document.getElementById(id);
const RANGES = ['1T', '5T', '1M', '6M', '1J', '5J', 'Max'];
const INTRA = { '1T': 1, '5T': 1, '1M': 1, '6M': 1, '1J': 1 };
const CHIPS = [['SPCX', 'SpaceX'], ['TSLA', 'Tesla'], ['SIE.DE', 'Siemens'], ['PBR', 'Petrobras'], ['GC=F', 'Gold (Future)'], ['OKLO', 'Oklo']];
const safe = s => s.replace(/[^A-Za-z0-9.]/g, '_');
const st = { sym: CHIPS.some(c => c[0] === localStorage.sym) ? localStorage.sym : 'SPCX', range: localStorage.range || '1T', type: localStorage.type || 'candle', data: null, timer: null };
const nf = (v, d = 2) => v == null || isNaN(v) ? '–' : v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const vf = v => v >= 1e9 ? nf(v / 1e9, 2) + ' Mrd.' : v >= 1e6 ? nf(v / 1e6, 2) + ' Mio.' : v >= 1e3 ? nf(v / 1e3, 1) + ' Tsd.' : nf(v, 0);
const CUR = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: 'CHF', BRL: 'R$' };
// Zeitstempel in lokale Gerätezeit verschieben (Chart arbeitet in UTC)
const loc = t => t - new Date(t * 1000).getTimezoneOffset() * 60;
const fmtDate = (t, withTime) => { const d = new Date(t * 1000); const o = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }; if (withTime) { o.hour = '2-digit'; o.minute = '2-digit'; } return d.toLocaleString('de-DE', o); };

const chart = LightweightCharts.createChart($('chart'), {
  autoSize: true,
  layout: { background: { color: '#0d1117' }, textColor: '#8b949e', fontSize: 11, fontFamily: 'system-ui' },
  grid: { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
  rightPriceScale: { borderColor: '#30363d', scaleMargins: { top: 0.08, bottom: 0.25 } },
  timeScale: { borderColor: '#30363d', timeVisible: true, secondsVisible: false, rightOffset: 3 },
  crosshair: { mode: LightweightCharts.CrosshairMode.Normal, vertLine: { color: '#58a6ff88', labelBackgroundColor: '#1f6feb' }, horzLine: { color: '#58a6ff88', labelBackgroundColor: '#1f6feb' } },
  localization: { locale: 'de-DE', priceFormatter: p => nf(p, Math.abs(p) < 1 ? 4 : 2),
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
  if (!r || !r.timestamp) { $('msg').textContent = `Für „${st.sym}“ wurden keine Kursdaten gefunden.`; $('msg').style.display = 'flex'; candles.setData([]); area.setData([]); volume.setData([]); return schedule('closed'); }
  $('msg').style.display = 'none';
  const m = r.meta, q = r.indicators.quote[0], ts = r.timestamp, cs = [], ar = [], vs = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open[i], h = q.high[i], l = q.low[i], c = q.close[i];
    if (o == null || c == null) continue;
    const t = loc(ts[i]); if (cs.length && t <= cs[cs.length - 1].time) continue;
    cs.push({ time: t, open: o, high: h, low: l, close: c }); ar.push({ time: t, value: c });
    vs.push({ time: t, value: q.volume[i] || 0, color: c >= o ? 'rgba(38,166,154,.45)' : 'rgba(239,83,80,.45)' });
  }
  candles.setData(cs); area.setData(ar); volume.setData(vs);
  chart.applyOptions({ timeScale: { timeVisible: !!INTRA[st.range] } });
  if (fit) chart.timeScale().fitContent();
  st.data = { cs, vs, m };
  renderQuote(m, cs);
  renderFresh(j.fetchedAt);
  schedule(marketState(m));
}

function renderQuote(m, cs) {
  const cur = CUR[m.currency] || (m.currency ? m.currency + ' ' : ''), price = m.regularMarketPrice;
  $('name').textContent = `${m.longName || m.shortName || m.symbol} · ${m.symbol} · ${m.fullExchangeName || m.exchangeName || ''}`;
  $('price').textContent = `${nf(price)} ${cur}`;
  let pct = m.regularMarketChangePercent, abs;
  if (pct == null && m.previousClose) pct = (price / m.previousClose - 1) * 100;
  if (pct != null) abs = price - price / (1 + pct / 100);
  let rangeTxt = '';
  if (st.range !== '1T' && cs.length) { const f = cs[0].open, rp = (price / f - 1) * 100; rangeTxt = ` · ${st.range}: ${rp >= 0 ? '+' : ''}${nf(rp)} %`; }
  $('chg').style.color = (pct || 0) >= 0 ? 'var(--up)' : 'var(--down)';
  $('chg').textContent = pct == null ? '' : `${abs >= 0 ? '+' : ''}${nf(abs)} (${pct >= 0 ? '+' : ''}${nf(pct)} %) ${marketState(m) === 'regular' ? 'heute' : 'letzter Handelstag'}${rangeTxt}`;
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
  $('legend').textContent = c.open != null
    ? `${d}  E ${nf(c.open)}  H ${nf(c.high)}  T ${nf(c.low)}  S ${nf(c.close)}  Vol ${v ? vf(v.value) : '–'}`
    : `${d}  ${nf(c.value)}  Vol ${v ? vf(v.value) : '–'}`;
});

document.addEventListener('visibilitychange', () => { if (!document.hidden) load(false); });

setType(st.type);
load(true);
