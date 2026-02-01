const CACHE_NAME = 'fingerbible-v2.0.0';
const RUNTIME_CACHE = 'fingerbible-runtime';

// 성경 데이터 파일 목록 생성
const BIBLE_BOOKS = [
  'gen', 'exo', 'lev', 'num', 'deut', 'jos', 'jdg', 'rth',
  '1sam', '2sam', '1kgs', '2kgs', '1chr', '2chr', 'ezr', 'neh',
  'esth', 'job', 'psm', 'prv', 'ecc', 'song', 'isa', 'jer',
  'lam', 'ezk', 'dan', 'hos', 'joel', 'amos', 'obad', 'jon',
  'mic', 'nah', 'hab', 'zep', 'hag', 'zec', 'mal', 'mat',
  'mrk', 'luk', 'john', 'acts', 'rom', '1cor', '2cor', 'gal',
  'eph', 'phil', 'col', '1the', '2the', '1tim', '2tim', 'tit',
  'phm', 'heb', 'jas', '1pet', '2pet', '1jn', '2jn', '3jn',
  'jud', 'rev'
];

// 전체 성경 데이터 파일 목록 (개역개정 + 새번역)
const BIBLE_DATA_FILES = [];
// 오프라인 지원을 위해 자주 읽는 성경(창세기, 요한복음, 시편, 잠언, 마태복음, 로마서)만 우선 캐싱하거나
// 전체를 캐싱할 수 있습니다. 여기서는 전체를 캐싱합니다. (약 3.5MB gzip)
BIBLE_BOOKS.forEach(book => {
  BIBLE_DATA_FILES.push(`/data/krv/${book}.json`);
  BIBLE_DATA_FILES.push(`/data/rnksv/${book}.json`);
});

// 캐시할 정적 자원들
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/css/fingerbible.css',
  '/js/jquery-3.3.1.min.js',
  '/js/vue.js',
  '/icon.png',
  '/apple_icon.png',
  '/manifest.json',
  ...BIBLE_DATA_FILES
];

// 설치 이벤트: 정적 자원 캐싱
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing v2.0.0...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets including bible data');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch 이벤트: 네트워크 우선 전략 (Network First)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // POST, PUT, DELETE 등은 캐시하지 않고 바로 통과
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // 정적 자원(성경 데이터 포함)은 캐시 우선 전략
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 나머지는 네트워크 우선 전략
  event.respondWith(networkFirst(request));
});

// 캐시 우선 전략
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    // GET 요청이고 성공한 응답만 캐시
    if (response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    throw error;
  }
}

// 네트워크 우선 전략
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);

    // GET 요청이고 성공한 응답만 캐시
    if (response.ok && request.method === 'GET') {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // 네트워크 실패 시 캐시에서 반환 (GET 요청만)
    if (request.method === 'GET') {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
    }

    // 캐시도 없으면 에러
    throw error;
  }
}

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-bible-data') {
    event.waitUntil(syncBibleData());
  }
});

async function syncBibleData() {
  console.log('[Service Worker] Syncing bible data...');
  // 여기에 동기화 로직 추가 가능
}

// Push 알림 (선택사항)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);

  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '열기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('손가락 성경', options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

