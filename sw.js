// ═══════════════════════════════════════════════════════════════
// Офлайн-режим калькулятора.
//
// Стратегии намеренно разные:
//   • страницы и prices.json — «сначала сеть»: пока интернет есть,
//     менеджер видит свежую версию и свежие цены; копия кладётся
//     в кэш и достаётся, только когда сети нет;
//   • шрифты и библиотеки — «сначала кэш»: они не меняются,
//     ходить за ними в сеть при каждом открытии незачем.
//
// При обновлении файлов достаточно поднять CACHE_VERSION —
// старый кэш удалится, у всех подтянется новая версия.
// ═══════════════════════════════════════════════════════════════
const CACHE_VERSION = 'sruby-v1';
const CORE = [
  './', './index.html', './admin.html', './print.html',
  './prices.json', './manifest.json', './icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Публикация цен требует сети по определению — не трогаем
  if (url.hostname === 'api.github.com') return;

  const isDoc = req.mode === 'navigate'
             || url.pathname.endsWith('.html')
             || url.pathname.endsWith('.json')
             || url.pathname.endsWith('/');

  if (isDoc) {
    // Сначала сеть, кэш — запасной аэродром
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          // ignoreSearch — у prices.json всегда есть ?t=…
          caches.match(req, { ignoreSearch: true })
            .then(hit => hit || caches.match('./index.html'))
        )
    );
    return;
  }

  // Статика: сначала кэш, при промахе — сеть с докладыванием в кэш
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => new Response('', { status: 504, statusText: 'Нет сети' })))
  );
});
