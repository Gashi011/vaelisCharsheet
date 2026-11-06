const CACHE="vaelis-sheet-v15";
const ASSETS=["./","./index.html","./styles.css?v=15","./expanded.css?v=15","./app.js?v=15","./enhancements.js?v=15","./rest.js?v=15","./resources-plus.js?v=15","./roll-modifiers.js?v=15","./currency.js?v=15","./manifest.webmanifest?v=15","./assets/vaelis.jpeg","./assets/spirit-deck.jpeg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))))});
