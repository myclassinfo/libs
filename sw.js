const staticAssets = [
	'./',
	'./student.html',
	'./login.html',
	'./assets/css/page.css',
	'./assets/img/logo.png',
	'./assets/img/logo2.png',
	'./assets/img/logo_small.png',
	'./assets/js/page.js',
	'./assets/js/student.js',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css',
	'https://code.jquery.com/jquery-3.2.1.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js'
];

self.addEventListener('install', async event=>{
	const cache = await caches.open('lib-static');
	cache.addAll(staticAssets);

});

self.addEventListener('fetch', event=>{
	const req = event.request;
	event.respondWith(cacheFirst(req));
});

async function cacheFirst(req){
	const cachedResponse = await caches.match(req);
	return cachedResponse || fetch(req);
}