/* Raktárszerviz app — offline gyorsítótár */
const VER = 'rsz-v9';
const CORE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './template_rsz.docx',
  './template_jh.docx',
  'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js'
];

const OKH = ['localhost', '127.0.0.1', 'cyberdroppp.github.io'];

self.addEventListener('install', e => {
  if (!OKH.includes(self.location.hostname)) { self.skipWaiting(); return; }
  e.waitUntil(
    caches.open(VER).then(c =>
      Promise.all(CORE.map(u => c.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Dropbox API hívások: soha ne gyorsítótárazzuk
  if (url.hostname.includes('dropboxapi.com') || url.hostname.includes('dropbox.com')) return;
  if (e.request.method !== 'GET') return;

  // fiokok.json: mindig a friss hálózati verzió (belépési fiókok), offline esetén gyorsítótár
  if (url.pathname.endsWith('fiokok.json')) {
    e.respondWith(
      fetch(e.request).then(r => {
        if (r.ok) { const cp = r.clone(); caches.open(VER).then(c => c.put(e.request, cp)); }
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: url.origin === location.origin }).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        if (resp.ok && (url.origin === location.origin || url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'cdn.jsdelivr.net')) {
          const copy = resp.clone();
          caches.open(VER).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() =>
        url.origin === location.origin ? caches.match('./index.html') : Response.error()
      );
    })
  );
});
