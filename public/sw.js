const CACHE_NAME = 'todara-offline-v1';
// Almacenamos la ruta offline en caché al instalar la PWA
const OFFLINE_URLS = ['/es/offline', '/en/offline'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caché offline de Todara listo');
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Solo interceptamos las peticiones de navegación (cuando el usuario cambia de página)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        // Si el fetch falla (no hay internet), mostramos la página de Sofi alertando
        const cache = await caches.open(CACHE_NAME);
        
        // Detectamos si la URL pedía la versión en inglés, si no, damos la de español por defecto
        const url = new URL(event.request.url);
        const isEnglish = url.pathname.startsWith('/en');
        
        return (await cache.match(isEnglish ? '/en/offline' : '/es/offline')) || Response.error();
      })
    );
  }
});