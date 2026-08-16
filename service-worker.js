const CACHE_NAME = "eod-inspection-v5";

const FILES_TO_CACHE = [
  "./"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(FILES_TO_CACHE);

    })

  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      )

    )

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  if(
    event.request.mode === "navigate" ||
    event.request.url.endsWith("/index.html")
  ){

    event.respondWith(

      fetch(event.request, {
        cache: "no-store"
      })

      .catch(() =>
        caches.match(event.request)
      )

    );

    return;

  }


  event.respondWith(

    caches.match(event.request).then(cached => {

      return cached || fetch(event.request);

    })

  );

});
