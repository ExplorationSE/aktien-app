const C = 'aktien-v24', SHELL = ['./', './index.html', './app.js', './lwc.js', './manifest.webmanifest', './favicon-32.png', './favicon-16.png', './icons/icon-v8-192.png', './icons/icon-v8-512.png', './icons/apple-touch-icon-v8.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.pathname.endsWith('.webmanifest') || u.pathname.includes('/icons/') || u.origin !== location.origin) return; // Browser lädt direkt
  if (u.pathname.includes('/data/')) { // Kursdaten: immer Netzwerk zuerst, nur offline der letzte Stand
    const key = u.origin + u.pathname;
    e.respondWith(fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(key, cp)); } return r; }).catch(() => caches.match(key)));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request)));
});
