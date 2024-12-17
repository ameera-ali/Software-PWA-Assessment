const CACHE_NAME = 'showcase-cache-v1';
const urlsToCache = [
     '/',
     '/showcase/frontend/Login1.html',
     '/showcase/frontend/Login1.css',
     '/showcase/frontend/Login1.js',
     '/showcase/frontend/browse.html',
     '/showcase/frontend/browse.css',
     '/showcase/frontend/browse.js',
     '/showcase/frontend/showcase.html',
     '/showcase/frontend/showcase.css',
     '/showcase/frontend/showcase.js',
 
    '/showcase/myPWA/manifest.json',
    
    '/showcase/icons/desktop_wide1.png',
    '/showcase/icons/manifest_icon.png',
    '/showcase/icons/manifest_icon2.png',
    '/showcase/icons/mobile_narrow2.png',

    '/showcase/frontend/alice.png',
    '/showcase/frontend/background.png',
    '/showcase/frontend/bigbangtheory.png',
    '/showcase/frontend/businessproposal.png',
    '/showcase/frontend/carmensandiago.png',
    '/showcase/frontend/friends.png',
    '/showcase/frontend/gilmoregirls.png',
    '/showcase/frontend/gossip_girl.png',
    '/showcase/frontend/hospitalplaylist.png',
    '/showcase/frontend/jane.png',
    '/showcase/frontend/logo.png',
    '/showcase/frontend/logo1.png',
    '/showcase/frontend/lupin.png',
    '/showcase/frontend/monsters.png',
    '/showcase/frontend/office.png',
    '/showcase/frontend/padlock.png',
    '/showcase/frontend/rookie.png',
    '/showcase/frontend/search.png',
    '/showcase/frontend/strangerthings.png',
    '/showcase/frontend/titans.png',
    '/showcase/frontend/unfortunate_events.png',
    '/showcase/frontend/user.png',
    '/showcase/frontend/you.png',
    '/showcase/frontend/youngsheldon.png',

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
                caches.match('/showcase/frontend/Login1.html')
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
