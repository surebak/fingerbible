# PWA 설치 가이드 📱

손가락 성경의 PWA 설치 프롬프트 및 설치 방법에 대한 가이드입니다.

---

## ✅ 구현된 기능

### 1. **커스텀 설치 프롬프트** ⭐⭐⭐
- 페이지 로드 3초 후 자동으로 표시
- 아름다운 UI 디자인
- 설치하기/닫기 버튼

### 2. **스마트 표시 로직**
- 이미 설치된 경우 표시 안 함
- 하루에 한 번만 표시
- 사용자가 닫으면 오늘은 더 이상 표시 안 함

### 3. **iOS 지원**
- iOS에서는 자동 프롬프트가 불가능
- 설치 버튼 클릭 시 수동 설치 안내 표시

---

## 🎯 설치 프롬프트가 나타나는 조건

### 브라우저 요구사항 (Chrome/Edge)
1. ✅ **HTTPS 연결** (또는 localhost)
2. ✅ **Service Worker 등록**
3. ✅ **manifest.json 존재**
4. ✅ **아이콘 포함** (192x192, 512x512)
5. ✅ **start_url 설정**
6. ✅ **display: standalone 설정**
7. ⚠️ **사용자 인게이지먼트** (몇 초간 페이지 방문)

### 프롬프트가 나타나지 않는 경우

#### 1. 이미 설치됨
```javascript
// 확인 방법 (개발자 도구 콘솔)
window.matchMedia('(display-mode: standalone)').matches
// true면 이미 설치됨
```

#### 2. 로컬 환경 (localhost)
- **Chrome:** 작동함 ✅
- **Safari:** 작동 안 함 ❌
- **Firefox:** 제한적 ✅

#### 3. 브라우저 정책
- 사용자가 이전에 거부한 경우 일정 기간 표시 안 됨
- 브라우저마다 다른 기준 적용

#### 4. iOS Safari
- iOS는 자동 프롬프트 미지원
- 수동으로 "홈 화면에 추가" 해야 함

---

## 📱 플랫폼별 설치 방법

### Android (Chrome)

#### 자동 프롬프트 사용
1. 사이트 접속
2. 3초 후 설치 프롬프트 표시
3. "설치하기" 버튼 클릭
4. 홈 화면에 아이콘 생성됨

#### 수동 설치
1. Chrome 메뉴(⋮) 클릭
2. "홈 화면에 추가" 선택
3. "설치" 버튼 클릭

### iOS (Safari)

#### 수동 설치만 가능
1. Safari로 사이트 접속
2. 하단 공유 버튼(⬆️) 클릭
3. 스크롤해서 "홈 화면에 추가" 찾기
4. "추가" 버튼 클릭
5. 홈 화면에 아이콘 생성됨

**참고:** iOS에서는 자동 프롬프트가 표시되지 않지만, 설치 버튼을 누르면 안내 메시지가 표시됩니다.

### Desktop (Windows/Mac)

#### Chrome/Edge
1. 주소창 오른쪽의 설치 아이콘(⊕) 클릭
2. 또는 메뉴 → "손가락 성경 설치" 선택
3. "설치" 버튼 클릭
4. 독립 실행형 앱으로 열림

---

## 🎨 커스텀 프롬프트 UI

### 디자인 특징
```css
- 하단 중앙에 표시
- 둥근 모서리 (border-radius: 16px)
- 그림자 효과
- 슬라이드업 애니메이션
- 앱 아이콘 표시
- 명확한 CTA 버튼
```

### 표시 타이밍
```javascript
// 3초 후 표시
setTimeout(() => {
  showInstallPromotion();
}, 3000);
```

### 닫기 동작
- ✅ X 버튼 클릭 → 오늘은 더 이상 표시 안 함
- ✅ 설치 완료 → 영구적으로 표시 안 함
- ✅ 다음 날 → 다시 표시 가능

---

## 🧪 테스트 방법

### 로컬 테스트

#### 1. 서버 실행
```bash
npm run serve
```

#### 2. Chrome에서 열기
```
http://localhost:5000
```

#### 3. 개발자 도구로 확인
```
F12 → Application 탭
- Manifest 확인
- Service Workers 확인
- Storage → Local Storage 확인
```

#### 4. 프롬프트 강제 실행
```javascript
// 콘솔에서 실행
localStorage.removeItem('pwa-install-dismissed');
window.location.reload();
```

### 실제 기기 테스트

#### Android
```
1. Chrome에서 사이트 접속
2. 3초 대기
3. 설치 프롬프트 확인
```

#### iOS
```
1. Safari에서 사이트 접속
2. 공유 → 홈 화면에 추가
3. 홈 화면에서 실행
4. 전체 화면 확인
```

---

## 🐛 문제 해결

### 프롬프트가 표시되지 않을 때

#### 1. Service Worker 확인
```javascript
// 콘솔에서 확인
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Service Worker:', reg ? 'Registered' : 'Not registered');
});
```

#### 2. Manifest 확인
```
개발자 도구 → Application → Manifest
- 에러 메시지 확인
- 아이콘 로드 확인
```

#### 3. 설치 가능 여부 확인
```javascript
// 콘솔에서 확인
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('Install prompt available!');
});
```

#### 4. 로컬 스토리지 초기화
```javascript
// 콘솔에서 실행
localStorage.clear();
location.reload();
```

### iOS에서 작동하지 않을 때

**정상입니다!** iOS는 자동 프롬프트를 지원하지 않습니다.

해결책:
1. 수동 안내 메시지 표시 (구현됨)
2. 상단에 배너 추가 (선택사항)
3. 도움말 페이지 제공 (선택사항)

---

## 💡 사용자 경험 개선

### 현재 구현
```
✅ 3초 지연 (사용자가 페이지를 볼 시간)
✅ 하루 한 번만 표시
✅ 아름다운 UI
✅ 간단한 설치 과정
✅ iOS 안내 메시지
```

### 추가 개선 가능 사항

#### 1. A/B 테스트
```javascript
// 표시 시간 최적화
- 3초 vs 5초 vs 10초
- 페이지뷰 2회 후 표시
```

#### 2. 설치 유도 문구 개선
```
- "오프라인에서도 사용하세요"
- "빠른 접속을 원하시나요?"
- "홈 화면에서 바로 열기"
```

#### 3. 컨텍스트 기반 표시
```javascript
// 특정 조건에서만 표시
- 3회 이상 방문한 사용자
- 특정 기능 사용 후
- 북마크가 많을 때
```

#### 4. 배너 추가 (iOS용)
```html
<!-- 상단 고정 배너 -->
<div class="ios-install-banner">
  📱 앱으로 설치하기: 공유 → 홈 화면에 추가
</div>
```

---

## 📊 설치율 추적

### Google Analytics 이벤트
```javascript
// 설치 프롬프트 표시
ga('send', 'event', 'PWA', 'Prompt Shown');

// 설치 버튼 클릭
ga('send', 'event', 'PWA', 'Install Clicked');

// 설치 완료
ga('send', 'event', 'PWA', 'App Installed');

// 프롬프트 닫기
ga('send', 'event', 'PWA', 'Prompt Dismissed');
```

### 추적 지표
```
- 프롬프트 노출수
- 설치 버튼 클릭률
- 실제 설치율
- 플랫폼별 설치율
```

---

## 🎯 설치 전환율 최적화

### 베스트 프랙티스

#### 1. 타이밍
```
✅ 첫 방문: 3-5초 후
✅ 재방문: 즉시 또는 특정 액션 후
❌ 즉시: 너무 성급함
❌ 너무 늦게: 사용자가 이미 떠남
```

#### 2. 빈도
```
✅ 하루 한 번
✅ 사용자가 닫으면 존중
❌ 계속 표시: 짜증남
❌ 한 번만: 놓칠 수 있음
```

#### 3. 메시지
```
✅ 명확한 혜택 설명
✅ 간단한 문구
❌ 기술 용어 사용
❌ 강요하는 느낌
```

---

## 📱 설치 후 경험

### 확인 사항
```
✅ 전체 화면 실행
✅ 스플래시 스크린 표시
✅ 상태바 색상 적용
✅ 오프라인 작동
✅ 빠른 로딩
```

### 테스트
```bash
1. 앱 설치
2. 홈 화면에서 아이콘 클릭
3. 전체 화면으로 열리는지 확인
4. 브라우저 UI가 없는지 확인
5. 네트워크 끄고 작동 확인
```

---

## 🔧 커스터마이징

### 프롬프트 표시 시간 변경
```javascript
// index.html에서 수정
setTimeout(() => {
  showInstallPromotion();
}, 3000);  // 3000ms = 3초

// 5초로 변경하려면
}, 5000);
```

### 프롬프트 스타일 변경
```css
/* style.css에서 수정 */
.pwa-install-prompt {
  /* 위치, 색상, 크기 등 변경 */
}
```

### 메시지 변경
```html
<!-- index.html에서 수정 -->
<h3>손가락 성경 설치</h3>
<p>홈 화면에 추가하여 앱처럼 사용하세요</p>
```

---

## ✅ 체크리스트

배포 전 확인:

- [ ] Service Worker 등록 확인
- [ ] manifest.json 유효성 확인
- [ ] 아이콘 파일 존재 확인 (192x192, 512x512)
- [ ] HTTPS 연결 확인
- [ ] Chrome에서 설치 프롬프트 테스트
- [ ] iOS에서 수동 설치 테스트
- [ ] 설치 후 전체 화면 확인
- [ ] 오프라인 작동 확인
- [ ] 프롬프트 닫기 동작 확인
- [ ] 재방문 시 프롬프트 표시 확인

---

## 📚 참고 자료

- [Add to Home Screen (Google)](https://web.dev/customize-install/)
- [Web App Manifest (MDN)](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [beforeinstallprompt Event](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [iOS PWA Support](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)

---

**마지막 업데이트:** 2025-11-21  
**PWA Install 버전:** 1.0.0

🎯 **목표:** 방문자의 20% 이상 설치 전환율

