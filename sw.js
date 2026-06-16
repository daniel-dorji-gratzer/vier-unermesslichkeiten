const CACHE = 'vum-v127';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    '/vier-unermesslichkeiten/',
    '/vier-unermesslichkeiten/gleichmut-hero.jpg',
    '/vier-unermesslichkeiten/freude-hero.jpg',
    '/vier-unermesslichkeiten/mitgefuehl-hero.jpg',
    '/vier-unermesslichkeiten/liebe-hero.jpg',
    '/vier-unermesslichkeiten/gleichmut-hero-nacht.jpg',
    '/vier-unermesslichkeiten/liebe-hero-nacht.jpg',
    '/vier-unermesslichkeiten/mitgefuehl-hero-nacht.jpg',
    '/vier-unermesslichkeiten/freude-hero-nacht.jpg',
    '/vier-unermesslichkeiten/fonts/fraunces-roman-latin.woff2',
    '/vier-unermesslichkeiten/fonts/fraunces-roman-latin-ext.woff2',
    '/vier-unermesslichkeiten/fonts/fraunces-italic-latin.woff2',
    '/vier-unermesslichkeiten/fonts/fraunces-italic-latin-ext.woff2',
    '/vier-unermesslichkeiten/fonts/plexmono-400-latin.woff2',
    '/vier-unermesslichkeiten/fonts/plexmono-500-latin.woff2',
    '/vier-unermesslichkeiten/fonts/plexmono-600-latin.woff2',
  ])));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => {
      // Tell all open clients to reload so they pick up the new version
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
