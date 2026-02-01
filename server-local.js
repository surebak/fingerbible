const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.xml': 'application/xml',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  // URL에서 쿼리 파라미터 제거
  const url = req.url.split('?')[0];
  console.log(`${req.method} ${url}`);
  
  let filePath = path.join(PUBLIC_DIR, url === '/' ? 'index.html' : url);
  
  // 파일 존재 여부 확인
  let fileExists = false;
  let isDirectory = false;
  
  try {
    const stats = fs.statSync(filePath);
    fileExists = true;
    isDirectory = stats.isDirectory();
  } catch (err) {
    fileExists = false;
  }
  
  // Rewrites 로직:
  // 1. 파일이 존재하면 → 그 파일 서빙
  // 2. 디렉토리면 → index.html로
  // 3. 파일이 없고 확장자가 없으면 (SPA 라우트) → index.html로
  // 4. 파일이 없고 확장자가 있으면 (실제 파일 요청) → 404
  
  if (isDirectory) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fileExists) {
    const hasExtension = path.extname(url) !== '';
    if (!hasExtension) {
      // 확장자가 없는 경로 (예: /gen/1, /john/3) → SPA 라우팅
      filePath = path.join(PUBLIC_DIR, 'index.html');
      console.log(`  → Rewrite to index.html (SPA route)`);
    } else {
      // 확장자가 있는데 파일이 없음 (예: /missing.js) → 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found', 'utf-8');
      console.log(`  → 404 (file not found)`);
      return;
    }
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found', 'utf-8');
        console.log(`  → 404 (read error)`);
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
        console.log(`  → 500 (server error)`);
      }
    } else {
      // 기본 헤더
      const headers = { 
        'Content-Type': contentType
      };
      
      // Service Worker는 캐시 방지
      if (url === '/service-worker.js') {
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      }
      
      res.writeHead(200, headers);
      res.end(content, 'utf-8');
      console.log(`  → 200 (${contentType})`);
    }
  });
});

server.listen(PORT, () => {
  console.log('\n');
  console.log('='.repeat(60));
  console.log('🚀 손가락 성경 로컬 개발 서버');
  console.log('='.repeat(60));
  console.log(`\n✅ Server running at http://localhost:${PORT}/\n`);
  console.log('📖 테스트 URL:');
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/gen/1        (창세기 1장)`);
  console.log(`   http://localhost:${PORT}/john/3       (요한복음 3장)`);
  console.log(`   http://localhost:${PORT}/psm/23       (시편 23편)`);
  console.log(`   http://localhost:${PORT}/mat/5/krv    (마태복음 5장 개역개정)`);
  console.log(`   http://localhost:${PORT}/rom/8        (로마서 8장)`);
  console.log('\n💡 브라우저에서 위 URL을 열어서 테스트하세요!');
  console.log('\n⏹  종료하려면 Ctrl+C를 누르세요.\n');
  console.log('='.repeat(60));
  console.log('\n');
});

