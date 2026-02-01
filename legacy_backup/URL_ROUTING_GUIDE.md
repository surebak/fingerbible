# URL 라우팅 가이드 📍

## 개요

이제 손가락 성경에 깔끔한 URL 기반 라우팅이 추가되어, 특정 성경 구절을 URL로 공유하고 북마크할 수 있습니다!

---

## 🔗 URL 형식

### 기본 형식 (권장)
```
https://fingerbible.com/<책코드>/<장번호>
https://fingerbible.com/<책코드>/<장번호>/<버전>
```

### 예시
```
https://fingerbible.com/gen/1          # 창세기 1장 (새번역)
https://fingerbible.com/john/3         # 요한복음 3장 (새번역)
https://fingerbible.com/psm/23/krv     # 시편 23편 (개역개정)
```

### 파라미터 설명

| 위치 | 설명 | 필수 | 예시 |
|------|------|------|-----|
| 1번째 | 성경 책 코드 | 필수 | `gen`, `mat`, `john` |
| 2번째 | 장 번호 | 필수 | `1`, `23`, `100` |
| 3번째 | 성경 버전 | 선택* | `krv`, `rnksv` |

*버전을 생략하면 기본값(새번역, `rnksv`)이 사용됩니다.

### 성경 책 코드 목록

#### 구약 (Old Testament)
```
gen  - 창세기          exo  - 출애굽기        lev  - 레위기
num  - 민수기          deut - 신명기          jos  - 여호수아
jdg  - 사사기          rth  - 룻기           1sam - 사무엘상
2sam - 사무엘하        1kgs - 열왕기상        2kgs - 열왕기하
1chr - 역대상          2chr - 역대하          ezr  - 에스라
neh  - 느헤미야        esth - 에스더          job  - 욥기
psm  - 시편            prv  - 잠언            ecc  - 전도서
song - 아가            isa  - 이사야          jer  - 예레미야
lam  - 예레미야 애가    ezk  - 에스겔          dan  - 다니엘
hos  - 호세아          joel - 요엘            amos - 아모스
obad - 오바댜          jon  - 요나            mic  - 미가
nah  - 나훔            hab  - 하박국          zep  - 스바냐
hag  - 학개            zec  - 스가랴          mal  - 말라기
```

#### 신약 (New Testament)
```
mat  - 마태복음        mrk  - 마가복음        luk  - 누가복음
john - 요한복음        acts - 사도행전        rom  - 로마서
1cor - 고린도전서      2cor - 고린도후서      gal  - 갈라디아서
eph  - 에베소서        phil - 빌립보서        col  - 골로새서
1the - 데살로니가전서  2the - 데살로니가후서  1tim - 디모데전서
2tim - 디모데후서      tit  - 디도서          phm  - 빌레몬서
heb  - 히브리서        jas  - 야고보서        1pet - 베드로전서
2pet - 베드로후서      1jn  - 요한일서        2jn  - 요한이서
3jn  - 요한삼서        jud  - 유다서          rev  - 요한계시록
```

### 버전 코드
- `krv` - 개역개정
- `rnksv` - 새번역 (기본값, 생략 가능)

---

## 📝 URL 예시

### 깔끔한 경로 방식 (권장) ✨
```
# 홈페이지 (기본: 창세기 1장, 새번역)
https://fingerbible.com/

# 창세기 1장 (새번역)
https://fingerbible.com/gen/1

# 시편 23편 (새번역)
https://fingerbible.com/psm/23

# 시편 23편 (개역개정)
https://fingerbible.com/psm/23/krv

# 요한복음 3장
https://fingerbible.com/john/3

# 마태복음 5장 (산상수훈)
https://fingerbible.com/mat/5

# 마태복음 5장 (개역개정)
https://fingerbible.com/mat/5/krv

# 로마서 8장
https://fingerbible.com/rom/8

# 요한계시록 21장
https://fingerbible.com/rev/21
```

### 쿼리 파라미터 방식 (하위 호환성)
```
# 구 방식도 계속 작동합니다
https://fingerbible.com/?book=gen&chapter=1&version=rnksv
https://fingerbible.com/?book=psm&chapter=23&version=krv
https://fingerbible.com/?book=john&chapter=3
```

---

## 🎯 주요 기능

### 1. **자동 URL 업데이트**
- 책을 선택하면 URL이 자동으로 변경됩니다
- 장을 선택하면 URL에 반영됩니다
- 버전을 변경해도 URL이 업데이트됩니다

### 2. **브라우저 히스토리 지원**
- ✅ 뒤로가기: 이전에 읽던 구절로 돌아갑니다
- ✅ 앞으로가기: 다음 구절로 이동합니다
- ✅ 새로고침: 현재 구절을 유지합니다

### 3. **딥링크 지원**
- URL을 복사해서 공유하면 받은 사람도 같은 구절을 볼 수 있습니다
- 카카오톡, 문자, 이메일 등으로 특정 구절 공유 가능

### 4. **북마크 가능**
- 브라우저 북마크에 특정 구절을 저장할 수 있습니다
- 북마크를 클릭하면 해당 구절로 바로 이동합니다

### 5. **SEO 최적화**
- 각 페이지의 제목이 "창세기 1장 - 손가락 성경" 형식으로 변경됩니다
- Open Graph 메타 태그가 자동으로 업데이트되어 SNS 공유 시 정보가 표시됩니다

---

## 💡 사용 시나리오

### 시나리오 1: 구절 공유
```
1. 사용자가 요한복음 3장 16절을 읽고 있습니다
2. URL이 자동으로 "/john/3"로 변경됩니다
3. 이 깔끔한 URL을 복사해서 친구에게 전송합니다
4. 친구가 링크를 클릭하면 같은 구절이 표시됩니다
```

### 시나리오 2: 말씀 묵상 계획
```
1. 일주일 말씀 묵상 계획을 세웁니다
2. 각 날짜의 구절 URL을 북마크에 저장합니다
   - 월: fingerbible.com/mat/5
   - 화: fingerbible.com/mat/6
   - 수: fingerbible.com/mat/7
3. 매일 해당 북마크를 클릭해서 읽습니다
```

### 시나리오 3: 온라인 성경공부
```
1. 소그룹 리더가 이번 주 본문을 정합니다
2. 손가락 성경에서 해당 구절로 이동합니다
3. 깔끔한 URL을 복사해서 그룹 채팅방에 공유합니다
   예: "이번 주는 fingerbible.com/eph/2 입니다"
4. 모든 멤버가 같은 구절을 보면서 공부합니다
```

---

## 🔧 기술적 세부사항

### History API 사용
```javascript
// URL 업데이트 (히스토리 추가)
history.pushState({ book, chapter, version }, '', newUrl);

// URL 업데이트 (히스토리 교체)
history.replaceState({ book, chapter, version }, '', newUrl);
```

### URL 방식
1. **경로 방식** (권장): `/gen/1`, `/john/3/krv`
2. **쿼리 파라미터 방식** (하위 호환): `?book=gen&chapter=1`

### 우선순위
1. **URL 경로** (최우선)
2. **URL 쿼리 파라미터** (하위 호환)
3. **쿠키** (URL이 없을 때)
4. **기본값** (모두 없을 때)

### 초기 로드
- 첫 방문 시: `replaceState` 사용 (히스토리 추가 안 함)
- 탐색 시: `pushState` 사용 (히스토리 추가)

### 뒤로가기/앞으로가기
```javascript
window.addEventListener('popstate', function(event) {
    // 히스토리 상태에서 book, chapter, version 복원
    // UI 업데이트 및 성경 본문 로드
});
```

---

## 📱 PWA와의 통합

### 앱 바로가기 (Shortcuts)
manifest.json에 정의된 바로가기:

```json
{
  "shortcuts": [
    {
      "name": "창세기",
      "url": "/gen/1"
    },
    {
      "name": "시편 23편",
      "url": "/psm/23"
    },
    {
      "name": "요한복음 3장",
      "url": "/john/3"
    },
    {
      "name": "마태복음 5장",
      "url": "/mat/5"
    }
  ]
}
```

### 사용 방법
- 안드로이드: 앱 아이콘 길게 누르면 바로가기 표시
- iOS: (현재 바로가기 미지원)

---

## 🐛 에러 처리

### 잘못된 책 코드
```
URL: /invalid/1
결과: 기본값(창세기)으로 리다이렉트
콘솔: "Invalid book code: invalid - redirecting to Genesis"
```

### 범위 초과 장 번호
```
URL: /gen/999
결과: 해당 책의 1장으로 이동
콘솔: "Chapter 999 exceeds max chapters 50 for gen"
```

### 음수 또는 0
```
URL: /gen/0
결과: 1장으로 이동
```

### 잘못된 버전
```
URL: /gen/1/invalid
결과: 기본 버전(rnksv)으로 설정
```

---

## 🎨 메타 태그 자동 업데이트

각 페이지마다 다음 메타 태그가 자동으로 업데이트됩니다:

```html
<title>창세기 1장 - 손가락 성경</title>
<meta name="description" content="창세기 1장을 읽어보세요...">
<meta property="og:title" content="창세기 1장 - 손가락 성경">
<meta property="og:description" content="...">
<meta property="og:url" content="현재 URL">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
```

이를 통해:
- SEO 최적화
- SNS 공유 시 미리보기 표시
- 브라우저 탭 제목 업데이트

---

## 🚀 활용 팁

### 1. QR 코드 생성
특정 구절의 URL로 QR 코드를 만들어 교회 주보나 전단지에 인쇄하세요.

### 2. 이메일 서명
이메일 서명에 좋아하는 성경 구절 링크를 추가하세요.

### 3. 소셜 미디어
SNS에 말씀을 공유할 때 손가락 성경 링크를 함께 게시하세요.

### 4. 웹사이트 임베드
본인의 웹사이트나 블로그에 특정 구절로 연결되는 링크를 추가하세요.

---

## 📊 분석 (선택사항)

Google Analytics를 사용한다면 다음 이벤트를 추적할 수 있습니다:

```javascript
// 책 변경 추적
ga('send', 'event', 'Bible', 'BookChange', book);

// 장 변경 추적
ga('send', 'event', 'Bible', 'ChapterChange', book + ' ' + chapter);

// 버전 변경 추적
ga('send', 'event', 'Bible', 'VersionChange', version);
```

---

## 🔄 마이그레이션

### 기존 쿠키 기반 시스템
- ✅ 기존 쿠키는 계속 작동합니다
- ✅ URL 파라미터가 없으면 쿠키에서 읽습니다
- ✅ 하위 호환성 유지

### 업그레이드 과정
1. 사용자가 처음 방문 → 쿠키에서 읽기
2. 책/장 변경 → URL 업데이트 시작
3. 이후 방문 → URL이 우선

---

## ✅ 테스트 체크리스트

- [ ] 책 선택 시 URL 변경 확인
- [ ] 장 선택 시 URL 변경 확인
- [ ] 버전 변경 시 URL 변경 확인
- [ ] 뒤로가기 동작 확인
- [ ] 앞으로가기 동작 확인
- [ ] 새로고침 후 상태 유지 확인
- [ ] URL 직접 입력 시 올바른 구절 표시 확인
- [ ] 잘못된 파라미터 에러 처리 확인
- [ ] 모바일에서 URL 복사 및 공유 확인
- [ ] PWA 바로가기 동작 확인

---

## 🎓 개발자 정보

### 주요 함수

| 함수 | 설명 |
|------|------|
| `getUrlParams()` | URL에서 파라미터 추출 |
| `updateUrl(updateHistory)` | URL 업데이트 |
| `updateMetaTags()` | 메타 태그 업데이트 |
| `loadFromUrl()` | URL에서 상태 로드 |
| `read_once()` | 성경 본문 로드 + URL 업데이트 |

### 이벤트 리스너

```javascript
// 뒤로가기/앞으로가기
window.addEventListener('popstate', handler);

// 책 선택
$('.books > div').on('click', handler);

// 장 선택
$('.chapters').on('click', 'li', handler);

// 버전 변경
$('#current select').on('change', handler);
```

---

**마지막 업데이트:** 2025-11-21  
**라우팅 버전:** 1.0.0

