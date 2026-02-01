# PWA 업데이트 노트 📱

## 변경 사항 요약

이 프로젝트를 최신 PWA (Progressive Web App) 스펙에 맞게 업데이트했습니다. 이제 안드로이드와 iOS 기기에서 네이티브 앱처럼 설치하고 사용할 수 있습니다.

---

## 📋 추가된 파일들

### 1. **manifest.json** (Web App Manifest)
- 최신 PWA 표준에 맞는 매니페스트 파일
- 앱 이름, 아이콘, 테마 색상, 디스플레이 모드 등 정의
- 바로가기(shortcuts) 기능 추가: 창세기, 시편, 마태복음
- iOS 및 안드로이드 모두 지원

### 2. **service-worker.js** (서비스 워커)
- 오프라인 지원 기능
- 캐싱 전략:
  - 정적 자원: 캐시 우선 전략
  - 동적 콘텐츠: 네트워크 우선 전략
  - Firebase API: 캐시하지 않음
- 자동 업데이트 감지 및 적용
- Push 알림 지원 (선택적)
- 백그라운드 동기화 지원

### 3. **browserconfig.xml**
- Windows/IE11 타일 설정

### 4. **offline.html**
- 오프라인 상태일 때 표시되는 페이지
- 자동 재연결 감지

### 5. **.well-known/assetlinks.json**
- Android TWA (Trusted Web Activities) 지원

### 6. **robots.txt & sitemap.xml**
- SEO 최적화

### 7. **icon-512.png**
- 512x512 크기의 고해상도 아이콘 생성

---

## 🔧 수정된 파일들

### **index.html**
- `<html lang="ko">` 추가
- 최신 메타 태그 추가:
  - `viewport-fit=cover`: 노치 디스플레이 지원
  - `theme-color`: 앱 테마 색상
  - `apple-mobile-web-app-*`: iOS PWA 지원
  - Open Graph 및 Twitter 카드 최적화
- 아이콘 링크 업데이트:
  - 다양한 크기의 아이콘 지원
  - iOS 스플래시 스크린
- 서비스 워커 등록 코드 추가:
  - 자동 업데이트 감지
  - 설치 프롬프트 관리
  - 온라인/오프라인 감지
  - 스탠드얼론 모드 감지

### **firebase.json**
- HTTP 헤더 설정 추가:
  - 서비스 워커: 캐시 방지
  - Manifest: 적절한 Content-Type
  - 이미지/CSS/JS: 장기 캐싱
  - 보안 헤더: XSS, Frame Options 등
- SPA 라우팅 지원

---

## ✨ 주요 기능

### 1. **홈 화면에 추가**
- ✅ 안드로이드: Chrome에서 "홈 화면에 추가" 자동 프롬프트
- ✅ iOS: Safari에서 공유 버튼 > "홈 화면에 추가"

### 2. **오프라인 지원**
- ✅ 정적 자원 캐싱
- ✅ 네트워크 없이도 기본 기능 사용 가능
- ✅ 오프라인 페이지 제공

### 3. **네이티브 앱 같은 경험**
- ✅ 스플래시 스크린
- ✅ 상태 표시줄 색상 커스터마이징
- ✅ 전체 화면 모드
- ✅ 빠른 로딩

### 4. **SEO 최적화**
- ✅ Open Graph 메타 태그
- ✅ Twitter 카드
- ✅ Structured data ready
- ✅ robots.txt & sitemap.xml

### 5. **크로스 플랫폼**
- ✅ iOS (Safari)
- ✅ Android (Chrome)
- ✅ Desktop (모든 모던 브라우저)
- ✅ Windows (Edge)

---

## 🚀 테스트 방법

### 안드로이드에서 테스트
1. Chrome 브라우저로 사이트 접속
2. 주소창 오른쪽의 "설치" 버튼 클릭
3. 또는 메뉴 > "홈 화면에 추가"

### iOS에서 테스트
1. Safari 브라우저로 사이트 접속
2. 하단의 공유 버튼 (⬆️) 클릭
3. "홈 화면에 추가" 선택
4. 추가 버튼 클릭

### 개발자 도구에서 테스트
1. Chrome DevTools 열기 (F12)
2. Application 탭 선택
3. Manifest, Service Workers, Cache Storage 확인
4. Lighthouse 탭에서 PWA 점수 확인

---

## 📊 Lighthouse PWA 체크리스트

업데이트 후 다음 항목들이 통과되어야 합니다:

- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Contains a web app manifest
- ✅ Has a valid manifest
- ✅ Configured for a custom splash screen
- ✅ Sets a theme color
- ✅ Content sized correctly for viewport
- ✅ Has a `<meta name="viewport">` tag
- ✅ Provides a valid apple-touch-icon

---

## 🔄 배포 방법

### Firebase Hosting
```bash
# Firebase CLI 설치 (아직 없다면)
npm install -g firebase-tools

# 로그인
firebase login

# 배포
firebase deploy
```

---

## 🛠️ 추가 개선 사항 (선택)

### 1. Push 알림 구현
현재 service-worker.js에 푸시 알림 기본 코드가 포함되어 있습니다. 
실제 사용하려면:
- Firebase Cloud Messaging 설정
- 알림 권한 요청 UI 추가
- 서버 측 알림 전송 로직 구현

### 2. 백그라운드 동기화
오프라인에서 작성한 데이터를 온라인 시 자동 동기화

### 3. 앱 바로가기 확장
manifest.json의 shortcuts에 더 많은 성경 책 추가

### 4. 다크 모드 개선
`prefers-color-scheme` 미디어 쿼리 활용

### 5. 성능 최적화
- 이미지 WebP 포맷으로 변환
- Critical CSS 인라인
- 폰트 최적화

---

## 📱 지원 브라우저

| 브라우저 | 최소 버전 | 홈 화면 추가 | Service Worker |
|---------|---------|------------|---------------|
| Chrome  | 67+     | ✅         | ✅            |
| Safari  | 11.3+   | ✅         | ✅            |
| Firefox | 44+     | ⚠️         | ✅            |
| Edge    | 17+     | ✅         | ✅            |
| Samsung | 8.2+    | ✅         | ✅            |

⚠️ Firefox는 Android에서만 "홈 화면에 추가" 지원

---

## 🐛 문제 해결

### 서비스 워커가 업데이트되지 않을 때
```javascript
// 개발자 도구 콘솔에서 실행
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### iOS에서 아이콘이 표시되지 않을 때
- apple_icon.png가 180x180 크기인지 확인
- 투명 배경이 있으면 흰색으로 변경

### manifest.json이 인식되지 않을 때
- MIME 타입이 `application/manifest+json`인지 확인
- HTTPS로 배포되었는지 확인 (localhost 제외)

---

## 📚 참고 자료

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Apple PWA Documentation](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Google Web Fundamentals](https://developers.google.com/web/fundamentals)

---

## ✅ 체크리스트

배포 전 확인사항:
- [ ] Firebase 프로젝트 설정 확인
- [ ] HTTPS 설정 (Firebase Hosting은 자동)
- [ ] manifest.json의 start_url 확인
- [ ] 모든 아이콘 파일 존재 확인
- [ ] 서비스 워커 등록 코드 동작 확인
- [ ] Chrome DevTools Lighthouse PWA 테스트 실행
- [ ] 실제 모바일 기기에서 테스트
- [ ] 오프라인 모드 테스트

---

**마지막 업데이트:** 2025-11-21  
**PWA 버전:** 1.0.0

