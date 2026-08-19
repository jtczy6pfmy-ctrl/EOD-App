const CACHE_NAME = "eod-inspection-v7";

const FILES_TO_CACHE = [
  "./"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
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
  if (
    event.request.mode === "navigate" ||
    event.request.url.endsWith("/index.html")
  ) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => response.text())
        .then(html => {
          // Fix the inspection-entry reset bug without changing the existing
          // inspection data, progress count, or report-generation logic.
          const resetFix = `
<script>
(() => {
  const clearInspectionEntry = (buttonId, fieldIds) => {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener("click", () => {
      // Run after the existing add handler so the new inspection is saved first.
      setTimeout(() => {
        fieldIds.forEach(id => {
          const field = document.getElementById(id);
          if (field) field.value = "";
        });
      }, 0);
    });
  };

  clearInspectionEntry("addInspection", ["number", "equipmentNote"]);
  clearInspectionEntry("addContainerInspection", ["containerPrefix", "containerNumber", "containerNote"]);
  clearInspectionEntry("addRackInspection", ["rackNumber", "rackNote"]);
})();
</script>`;

          return new Response(
            html.replace("</body>", resetFix + "\\n</body>"),
            {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            }
          );
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
