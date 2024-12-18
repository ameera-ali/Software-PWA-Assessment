const CACHE_NAME = 'showcase-cache-v1';
const urlsToCache = [
     '/',
     '/myPWA/frontend/Login1.html',
     '/myPWA/frontend/Login1.css',
     '/showcase/frontend/Login1.js',
     '/myPWA/frontend/browse.html',
     '/myPWA/frontend/browse.css',
     '/myPWA/frontend/browse.js',
     '/myPWA/frontend/showcase.html',
     '/myPWA/frontend/showcase.css',
     '/myPWA/frontend/showcase.js',
 
    '/myPWA/manifest.json',
    
    '/myPWA/icons/desktop_wide1.png',
    '/myPWA/icons/manifest_icon.png',
    '/myPWA/icons/manifest_icon2.png',
    '/myPWA/icons/mobile_narrow2.png',

    '/myPWA/frontend/alice.png',
    '/myPWA/frontend/background.png',
    '/myPWA/frontend/bigbangtheory.png',
    '/myPWA/frontend/businessproposal.png',
    '/myPWA/frontend/carmensandiago.png',
    '/myPWA/frontend/friends.png',
    '/myPWA/frontend/gilmoregirls.png',
    '/myPWA/frontend/gossip_girl.png',
    '/myPWA/frontend/hospitalplaylist.png',
    '/myPWA/frontend/jane.png',
    '/myPWA/frontend/logo.png',
    '/myPWA/frontend/logo1.png',
    '/myPWA/frontend/lupin.png',
    '/myPWA/frontend/monsters.png',
    '/myPWA/frontend/office.png',
    '/myPWA/frontend/padlock.png',
    '/myPWA/frontend/rookie.png',
    '/myPWA/frontend/search.png',
    '/myPWA/frontend/strangerthings.png',
    '/myPWA/frontend/titans.png',
    '/myPWA/frontend/unfortunate_events.png',
    '/myPWA/frontend/user.png',
    '/myPWA/frontend/you.png',
    '/myPWA/frontend/youngsheldon.png',

];


// Install the service worker
// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

//Fetch requests
self.addEventListener('fetch', event => {
    event.respondWith (
        caches.match(event.request).then(response =>
            {
                //Return the cached response if found, otherwise fetch from network
                return response ||
                fetch(event.request).catch(()=>
                caches.match('/myPWA/frontend/Login1.html')
                );
            })
    );
});


 // Activate the service worker

// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});