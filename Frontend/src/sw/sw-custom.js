// src/sw/sw-custom.js

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
});

// 👇 This is required — make sure this is the last line
self.__WB_MANIFEST;
