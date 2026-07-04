/* Raktárszerviz app — offline gyorsítótár */
const VER = 'rsz-v3';
const CORE = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js'
];

self.addEventListener('install', e => {
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

  e.respondWith(
    caches.match(e.request, { ignoreSearch: url.origin === location.origin }).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(resp => {
        if (resp.ok && (url.origin === location.origin || url.hostname === 'cdnjs.cloudflare.com')) {
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
