# 문제 해결 가이드 🔧

## Firebase Serve 권한 에러

### 에러 메시지
```
Error: Request to https://cloudresourcemanager.googleapis.com/v1/projects/bibles-da0c4 
had HTTP Error: 403, The caller does not have permission
```

---

## 🎯 해결 방법 (순서대로 시도)

### 방법 1: 로컬 전용 서빙 (가장 간단) ✅

Firebase 프로젝트에 연결하지 않고 로컬 파일만 서빙:

```bash
cd /Users/user/Documents/bitbucket/fingerbible

# --only hosting 플래그로 호스팅만 실행
firebase serve --only hosting --port 5000
```

이 방법은 프로젝트 권한이 필요 없고, `firebase.json`의 설정을 기반으로 로컬 파일을 서빙합니다.

---

### 방법 2: Firebase 재로그인

권한 문제일 수 있으니 재로그인:

```bash
# 로그아웃
firebase logout

# 다시 로그인
firebase login

# 다시 시도
firebase serve
```

---

### 방법 3: 다른 포트 사용

5000 포트가 사용 중일 수 있음:

```bash
# 다른 포트로 실행
firebase serve --only hosting --port 8080

# 그러면 http://localhost:8080 으로 접속
```

---

### 방법 4: Emulator 사용

```bash
firebase emulators:start --only hosting
```

---

### 방법 5: .firebaserc 파일 임시 제거

프로젝트 연결을 일시적으로 해제:

```bash
# .firebaserc 백업
mv .firebaserc .firebaserc.backup

# 서버 실행
firebase serve --only hosting

# 테스트 완료 후 복원
mv .firebaserc.backup .firebaserc
```

---

### 방법 6: 간단한 Node.js 서버로 대체

Firebase serve가 안 되면 rewrites를 직접 구현한 간단한 서버:

**server-local.js 파일 생성:**

```javascript
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
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Rewrites: 모든 경로를 index.html로
  // /gen/1, /john/3 등의 경로도 index.html 서빙
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // CORS 헤더 추가 (개발 환경용)
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
  console.log(`\n테스트 URL:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/gen/1`);
  console.log(`  http://localhost:${PORT}/john/3`);
  console.log(`  http://localhost:${PORT}/psm/23`);
  console.log(`\n종료하려면 Ctrl+C를 누르세요.\n`);
});
```

**실행:**

```bash
node server-local.js
```

---

## 🎯 권장 방법

### 1번 또는 6번 방법 추천!

**1번 (Firebase Serve):**
```bash
firebase serve --only hosting --port 5000
```

**6번 (Node.js 서버):**
```bash
node server-local.js
```

둘 다 rewrites 기능이 작동해서 `/gen/1`, `/john/3` 같은 깔끔한 URL을 테스트할 수 있습니다.

---

## 📝 확인 사항

### 1. Firebase CLI 버전 확인
```bash
firebase --version
```

최신 버전이 아니면:
```bash
npm install -g firebase-tools
```

### 2. 로그인 상태 확인
```bash
firebase login:list
```

### 3. 프로젝트 확인
```bash
firebase projects:list
```

---

## 🔍 디버깅

### 상세 로그 보기
```bash
firebase serve --debug
```

### 특정 프로젝트로 실행
```bash
firebase serve --project bibles-da0c4
```

---

## 💡 왜 권한 에러가 발생하나요?

1. **Firebase 계정 권한 부족**
   - 프로젝트에 대한 접근 권한이 없음
   - 다른 계정으로 로그인되어 있음

2. **프로젝트 ID 불일치**
   - `.firebaserc`의 프로젝트 ID가 잘못됨

3. **API 활성화 안 됨**
   - Cloud Resource Manager API가 비활성화됨

4. **인증 토큰 만료**
   - 재로그인 필요

---

## ✅ 해결 확인

서버가 정상 실행되면:

```
✔  hosting: Local server: http://localhost:5000
```

브라우저에서 테스트:
```
http://localhost:5000/gen/1
http://localhost:5000/john/3
http://localhost:5000/psm/23
```

---

## 🚨 여전히 안 되면?

아래 정보와 함께 문의:

```bash
# 1. Firebase 버전
firebase --version

# 2. Node.js 버전
node --version

# 3. 로그인 상태
firebase login:list

# 4. 프로젝트 목록
firebase projects:list

# 5. firebase.json 내용
cat firebase.json

# 6. .firebaserc 내용
cat .firebaserc
```

