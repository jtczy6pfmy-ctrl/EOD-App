const CACHE_NAME = "eod-inspection-v9";

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
          const resetFix = `
<script>
(() => {
  function resetFields(buttonId, fields) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener("click", () => {
      setTimeout(() => {
        fields.forEach(({ id, value }) => {
          const field = document.getElementById(id);
          if (field) field.value = value;
        });
      }, 0);
    });
  }

  // Chassis defaults: NSPZ / 5652 / Defect / blank number / blank note.
  resetFields("addInspection", [
    { id: "prefix", value: "NSPZ" },
    { id: "type", value: "5652" },
    { id: "condition", value: "Defect" },
    { id: "number", value: "" },
    { id: "equipmentNote", value: "" }
  ]);

  // Container defaults: blank prefix / 5653 / Defect / blank number / blank note.
  resetFields("addContainerInspection", [
    { id: "containerPrefix", value: "" },
    { id: "containerType", value: "5653" },
    { id: "containerCondition", value: "Defect" },
    { id: "containerNumber", value: "" },
    { id: "containerNote", value: "" }
  ]);

  // Rack defaults: ZNSU / 5657 / Defect / blank number / blank note.
  resetFields("addRackInspection", [
    { id: "rackCondition", value: "Defect" },
    { id: "rackNumber", value: "" },
    { id: "rackNote", value: "" }
  ]);
})();
</script>`;

          return new Response(
            html.replace("</body>", resetFix + "\n</body>"),
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
