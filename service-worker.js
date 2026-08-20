const CACHE_NAME="eod-inspection-v12";

self.addEventListener("install",event=>{
 self.skipWaiting();
});

self.addEventListener("activate",event=>{
 event.waitUntil(
  caches.keys().then(keys=>
   Promise.all(
    keys
     .filter(key=>key!==CACHE_NAME)
     .map(key=>caches.delete(key))
   )
  )
 );
 self.clients.claim();
});

self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;

 const url=new URL(event.request.url);
 const isNavigation=
  event.request.mode==="navigate" ||
  url.pathname.endsWith("/index.html");

 if(isNavigation){
  event.respondWith(
   fetch(event.request,{cache:"no-store"})
    .then(async response=>{
     const html=await response.text();

     const resetScript=`<script>
(() => {
  // A hard refresh/new app load starts a fresh inspection count.
  localStorage.removeItem("eodInspectionReport_v9");
})();
</script>`;

     return new Response(
      html.replace("<body>","<body>"+resetScript),
      {
       status:response.status,
       statusText:response.statusText,
       headers:response.headers
      }
     );
    })
    .catch(()=>caches.match(event.request))
  );
  return;
 }

 event.respondWith(
  fetch(event.request,{cache:"no-store"})
   .then(response=>{
    if(response&&response.ok&&url.origin===self.location.origin){
     const copy=response.clone();
     caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
    }
    return response;
   })
   .catch(()=>caches.match(event.request))
 );
});
