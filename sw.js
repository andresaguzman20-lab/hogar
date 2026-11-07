// Guarda la app en el celular para que abra aunque no haya señal.
// Siempre intenta primero la versión nueva de internet; si no hay conexión, usa la guardada.
// Los datos NO pasan por acá: se piden siempre al motor de Apps Script.
const VERSION = 'hogar-v6.3';
const ARCHIVOS = ['./', './index.html', './config.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(r => { if (r && r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(req, copia)); } return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
