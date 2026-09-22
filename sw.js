const CACHE = "shoulder-tracker-v12";
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
  "./diagrams/doorway-pec.svg",
  "./diagrams/thoracic-extension.svg",
  "./diagrams/chin-tucks.svg",
  "./diagrams/upper-trap-levator.svg",
  "./diagrams/cross-body.svg",
  "./diagrams/band-er.svg",
  "./diagrams/floor-slides.svg",
  "./diagrams/sidelying-er.svg",
  "./diagrams/kneeling-sa-row.svg",
  "./diagrams/prone-t.svg",
  "./diagrams/face-pull.svg",
  "./diagrams/pushup-plus.svg",
  "./diagrams/farmer-carry.svg",
  "./diagrams/floor-press.svg",
  "./diagrams/cable-row.svg",
  "./diagrams/suitcase-carry.svg",
  "./diagrams/band-low-row.svg",
  "./diagrams/wall-slides.svg",
  "./diagrams/prone-y.svg",
  "./diagrams/scaption.svg",
  "./diagrams/closed-chain.svg"
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
