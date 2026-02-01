# 로컬 테스트 가이드 🧪

Firebase Hosting의 rewrites 기능은 로컬에서도 완벽하게 테스트할 수 있습니다!

---

## 🚀 빠른 시작

### 1. Firebase CLI로 로컬 서버 실행

```bash
# 프로젝트 디렉토리로 이동
cd /Users/user/Documents/bitbucket/fingerbible

# Firebase Hosting 에뮬레이터 실행
firebase serve --only hosting

# 또는 단축 명령어
firebase serve
```

### 2. 브라우저로 테스트

서버가 시작되면 다음과 같은 메시지가 표시됩니다:

```
✔  hosting: Local server: http://localhost:5000
```

이제 브라우저에서 다음 URL들을 테스트해보세요:

```
http://localhost:5000/
http://localhost:5000/gen/1
http://localhost:5000/john/3
http://localhost:5000/psm/23
http://localhost:5000/mat/5/krv
```

---

## ✅ 테스트 체크리스트

### 기본 URL
- [ ] `http://localhost:5000/` → 창세기 1장 표시
- [ ] `http://localhost:5000/gen/1` → 창세기 1장
- [ ] `http://localhost:5000/gen/2` → 창세기 2장

### 다양한 책
- [ ] `http://localhost:5000/psm/23` → 시편 23편
- [ ] `http://localhost:5000/john/3` → 요한복음 3장
- [ ] `http://localhost:5000/mat/5` → 마태복음 5장
- [ ] `http://localhost:5000/rom/8` → 로마서 8장

### 버전 지정
- [ ] `http://localhost:5000/psm/23` → 시편 23편 (새번역)
- [ ] `http://localhost:5000/psm/23/krv` → 시편 23편 (개역개정)
- [ ] `http://localhost:5000/john/3/krv` → 요한복음 3장 (개역개정)

### UI 테스트
- [ ] 책 선택 시 URL 변경 확인
- [ ] 장 선택 시 URL 변경 확인
- [ ] 버전 변경 시 URL 변경 확인
- [ ] 브라우저 뒤로가기 동작 확인
- [ ] 브라우저 앞으로가기 동작 확인

### 에러 처리
- [ ] `http://localhost:5000/invalid/1` → 창세기로 리다이렉트
- [ ] `http://localhost:5000/gen/999` → 창세기 1장으로 이동
- [ ] `http://localhost:5000/gen/0` → 창세기 1장으로 이동

### 하위 호환성 (쿼리 파라미터)
- [ ] `http://localhost:5000/?book=gen&chapter=1`
- [ ] `http://localhost:5000/?book=john&chapter=3&version=krv`

---

## 🔍 개발자 도구로 확인하기

### 1. URL 변경 확인
1. Chrome DevTools 열기 (F12)
2. Console 탭 선택
3. 책/장을 선택하면서 콘솔 확인
4. URL이 `/gen/1`, `/john/3` 형식으로 변경되는지 확인

### 2. History API 확인
```javascript
// 콘솔에서 실행
history.state
// 출력: { book: 'gen', chapter: 1, version: 'rnksv' }
```

### 3. Network 탭 확인
1. Network 탭 선택
2. `/gen/1` 같은 URL로 이동
3. 실제로는 `index.html`이 로드됨을 확인
4. Firebase rewrites가 작동 중!

---

## 🛠️ 문제 해결

### Firebase CLI가 없는 경우
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login
```

### 포트가 이미 사용 중인 경우
```bash
# 다른 포트로 실행
firebase serve --port 8080

# 그러면 http://localhost:8080 으로 접속
```

### rewrites가 작동하지 않는 경우

**1. firebase.json 확인**
```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**2. 서버 재시작**
```bash
# Ctrl+C로 서버 종료 후 재시작
firebase serve
```

**3. 캐시 삭제**
- 브라우저 캐시 삭제 (Cmd+Shift+R / Ctrl+Shift+R)
- 하드 새로고침

### 404 에러가 나는 경우
```bash
# firebase.json의 public 폴더 경로 확인
# "public": "public" 로 되어 있는지 확인
cat firebase.json
```

---

## 🎯 Firebase Serve vs 일반 웹 서버

### Firebase Serve (권장) ✅
```bash
firebase serve
```
- ✅ rewrites 지원
- ✅ headers 지원
- ✅ redirects 지원
- ✅ 실제 배포 환경과 동일
- ✅ `/gen/1` 같은 경로 방식 작동

### Python HTTP Server ❌
```bash
python -m http.server 8000
```
- ❌ rewrites 미지원
- ❌ `/gen/1`로 접속하면 404 에러
- ❌ `index.html`만 직접 열 수 있음

### Node.js HTTP Server ❌
```bash
npx http-server
```
- ❌ rewrites 미지원
- ❌ `/gen/1`로 접속하면 404 에러

### Live Server (VS Code) ❌
- ❌ rewrites 미지원
- ❌ 단순 파일 서빙만 가능

---

## 📱 모바일에서 테스트

### 같은 네트워크에서 테스트
```bash
# 로컬 IP 확인
ifconfig | grep "inet " | grep -v 127.0.0.1

# 예: 192.168.0.10

# 모바일에서 접속
http://192.168.0.10:5000/gen/1
http://192.168.0.10:5000/john/3
```

---

## 🔄 핫 리로드 (자동 새로고침)

Firebase serve는 기본적으로 핫 리로드를 지원하지 않습니다. 
파일을 수정한 후:

1. 브라우저에서 수동으로 새로고침 (F5)
2. 또는 서버를 재시작

**자동 새로고침을 원한다면:**
```bash
# browser-sync 설치
npm install -g browser-sync

# 별도 터미널에서 실행
browser-sync start --proxy "localhost:5000" --files "public/**/*"
```

---

## 🚀 배포 전 최종 체크

```bash
# 1. 로컬 테스트
firebase serve

# 2. 모든 URL 테스트 통과

# 3. Firebase 배포
firebase deploy

# 4. 실제 URL에서 재테스트
```

---

## 📊 성능 테스트

### Lighthouse 실행
1. Chrome DevTools → Lighthouse 탭
2. "Generate report" 클릭
3. PWA 점수 확인

### 로컬에서도 가능!
```
http://localhost:5000 에서 Lighthouse 실행
PWA 요구사항 충족 확인
```

---

## 🎓 더 알아보기

### Firebase Hosting 에뮬레이터 문서
https://firebase.google.com/docs/hosting/test-preview-deploy

### Rewrites 상세 설명
https://firebase.google.com/docs/hosting/full-config#rewrites

---

## 💡 팁

### 1. 개발 중에는 항상 firebase serve 사용
일반 웹 서버로는 깔끔한 URL이 작동하지 않습니다!

### 2. 여러 탭에서 동시 테스트
- 탭1: `/gen/1`
- 탭2: `/john/3`
- 탭3: `/psm/23`

### 3. 콘솔 로그 확인
```javascript
// index.html에 추가된 로그들
console.log('[PWA] ...');
console.warn('Invalid book code:', ...);
```

### 4. State 확인
```javascript
// 브라우저 콘솔에서
history.state
// { book: 'gen', chapter: 1, version: 'rnksv' }
```

---

## ✨ 요약

**로컬 테스트가 완벽하게 가능합니다!**

```bash
# 실행
firebase serve

# 테스트
http://localhost:5000/gen/1
http://localhost:5000/john/3
http://localhost:5000/psm/23/krv
```

Firebase의 rewrites 기능이 로컬에서도 동일하게 작동하므로,
배포 전에 모든 기능을 완벽하게 테스트할 수 있습니다! 🎉

