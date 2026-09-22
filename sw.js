const CACHE = "shoulder-tracker-v13";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./exercises.js",
  "./diagrams.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./diagrams/doorway-pec.webp",
  "./diagrams/thoracic-extension.webp",
  "./diagrams/chin-tucks.webp",
  "./diagrams/upper-trap-levator.webp",
  "./diagrams/cross-body.webp",
  "./diagrams/band-er.webp",
  "./diagrams/floor-slides.webp",
  "./diagrams/sidelying-er.webp",
  "./diagrams/kneeling-sa-row.webp",
  "./diagrams/prone-t.webp",
  "./diagrams/face-pull.webp",
  "./diagrams/pushup-plus.webp",
  "./diagrams/farmer-carry.webp",
  "./diagrams/floor-press.webp",
  "./diagrams/cable-row.webp",
  "./diagrams/suitcase-carry.webp",
  "./diagrams/band-low-row.webp",
  "./diagrams/wall-slides.webp",
  "./diagrams/prone-y.webp",
  "./diagrams/scaption.webp",
  "./diagrams/closed-chain.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
