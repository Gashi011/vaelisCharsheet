const CACHE="vaelis-sheet-v16";
const ASSETS=["./","./index.html","./styles.css?v=16","./expanded.css?v=16","./app.js?v=16","./enhancements.js?v=16","./rest.js?v=16","./resources-plus.js?v=16","./roll-modifiers.js?v=16","./currency.js?v=16","./manifest.webmanifest?v=16","./assets/vaelis.jpeg","./assets/spirit-deck.jpeg","./assets/icon-192.png","./assets/icon-512.png","./assets/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))))});
