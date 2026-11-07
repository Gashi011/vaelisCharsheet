const CACHE="vaelis-sheet-v18-card-deck";
const ASSETS=["./","./index.html","./styles.css?v=17","./expanded.css?v=17","./card-roll.css?v=18","./app.js?v=17","./enhancements.js?v=18","./rest.js?v=17","./resources-plus.js?v=17","./card-roll.js?v=18","./roll-modifiers.js?v=18","./currency.js?v=17","./manifest.webmanifest?v=18","./assets/vaelis.jpeg","./assets/spirit-deck.jpeg","./assets/icon-192.png","./assets/icon-512.png","./assets/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))))});
