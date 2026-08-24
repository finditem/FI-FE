# write/post 작업 계획

로드맵 4단계(로그인 후 핵심 플로우) 첫 페이지: write/post(작성), write/post/[id](수정), write/post/location(위치 지정) 영어 번역.

## 커밋 1 — 작성 페이지

- [x] `page.tsx`의 `generateMetadata`를 `getTranslations("PostWritePage")`로 전환
- [x] `useWritePageType.ts`에 `useTranslations("useWritePageType")` 적용
- [x] `WriteForm.tsx`에 `useTranslations("WriteForm")` 적용 (sr-only, 이미지 미첨부 확인 모달 4문구)
- [x] `TitleSection.tsx`에 `useTranslations("TitleSection")` 적용
- [x] `ContentSection.tsx`에 `useTranslations("ContentSection")` 적용
- [x] `CategorySection.tsx`에 `useTranslations("CategorySection")` 적용 (`getItemCategoryLabel` 호출부는 제외)
- [x] `LocationSection.tsx`에 `useTranslations("LocationSection")` 적용
- [x] `messages/ko.json`/`messages/en.json`에 위 네임스페이스 추가
- [x] `npx jest` / `npx tsc --noEmit` 검증 (커밋 d842f331)

## 커밋 2 — 게시글 수정 페이지

- [x] `PostEditPage.tsx`에 `useTranslations("PostEditPage")` 적용
- [x] `PostEditSkeleton.tsx`에 `useTranslations("PostEditSkeleton")` 적용
- [x] `messages/ko.json`/`messages/en.json`에 네임스페이스 추가
- [x] `npx jest` / `npx tsc --noEmit` 검증

## 커밋 3 — 위치 등록 페이지

- [x] `location/layout.tsx`를 async + `getTranslations("PostWriteLocationLayout")`로 전환
- [x] `LocationSearchSection.tsx`에 `useTranslations("LocationSearchSection")` 적용 (`LocationGuideUI` 포함)
- [x] `LocationRangeSection.tsx`에 `useTranslations("LocationRangeSection")` 적용
- [x] `BottomSheet.tsx`에 `useTranslations("PostWriteBottomSheet")` 적용
- [x] `messages/ko.json`/`messages/en.json`에 네임스페이스 추가
- [x] `npx jest` / `npx tsc --noEmit` / `npm run build` 최종 검증 완료 (246 스위트/1385 테스트 통과, 신규 tsc 에러 없음, `/write/post`·`/write/post/[id]`·`/write/post/location` ko/en 정적 생성 확인)

## 스코프 제외 (참고, 수정 안 함)

- `inquiry-write`, `list/[id]`, `mypage/posts`
- `getItemCategoryLabel`/`getItemStatusLabel` 공유 유틸
- `PostWriteType.ts`의 zod 에러 메시지 (렌더링되지 않는 내부 메시지)
- `TempModal.tsx`/`useTempPostModal`/`useTempPostActions` (죽은 코드)
- `DISTANCE_OPTIONS.ts`의 km 라벨 (언어중립)

## 커밋 4 — 날짜 선택 모달

`DateSection`의 날짜 박스를 누르면 월 그리드 달력이 열리고, 제목을 누르면 연월 휠로 전환되는 모달을 만든다.

### 전역 공통 (라우트 밖)

- [x] `DateWheel`을 `DateRangeBottomSheet.tsx`에서 `src/components/common/DateWheel/`로 분리
- [x] 분리하면서 가운데 강조 스타일을 prop으로 개방 (기존 오버레이 방식이 기본값)
- [x] `DateRangeBottomSheet`가 분리된 `DateWheel`을 import하도록 변경 (기존 모양 유지)

### 라우트

- [x] `_utils/buildCalendarWeeks`로 월 그리드 6주 배열 생성 (`date-fns`)
- [x] `_internal/DatePickerModal/_internal/CalendarGrid` 월 그리드 뷰
- [x] `_internal/DatePickerModal/_internal/MonthWheel` 연·월 휠 뷰
- [x] `_internal/DatePickerModal` 모달 셸과 그리드/휠 전환
- [x] `DateSection`에 `onClick` 연결하고 선택된 날짜 표시
- [x] `DateSection`을 폼의 `date` 필드에 연결
- [x] `messages/ko.json`/`messages/en.json`에 `DateSection`·`DatePickerModal` 네임스페이스 추가
- [x] jest / tsc 검증 (write/post 6스위트 29테스트, DateRangeBottomSheet 2스위트 24테스트 통과, tsc 14개로 develop 기준선과 동일)
- [x] `DateSection.test.tsx`와 `buildCalendarWeeks.test.ts` 추가
- [ ] `DateWheel`의 단위 테스트. 공통 컴포넌트인데 분리 전에도 없었고 이번에도 추가하지 못했다.
- [x] Figma `get_design_context`/`get_variable_defs`로 그리드 화면의 치수·색·타이포를 실제 값으로 교체
- [x] 연월 휠 화면(13385:146071)을 Figma로 대조하고 휠 하나로 다시 구현
- [ ] 브라우저에서 그리드·휠 전환을 눈으로 확인

### 실제 배치

`DatePickerModal`, `CalendarGrid`, `MonthWheel`은 `DateSection`에서만 쓰므로 `_internal/DatePickerModal/_internal/...`으로 두 번 중첩하지 않고 `DateSection/_internal/` 아래에 나란히 두었다.

### Figma에서 확인한 값 (node 13385:134201 `popup_cal`)

- [x] 모달: `p-20px`, `radius 12px`, 콘텐츠 폭 302px, 헤더·그리드 묶음과 오늘 버튼 사이 `gap 8px`
- [x] 그리드: 칸 `40x40`, 칸 간격과 줄 간격 모두 `4px`, 선택 칸 `radius 10px`
- [x] 제목 `2026년 7월`: `H3/Semi-Bold` 18px, `Labels-Vibrant/Primary` #333333
- [x] 요일: `Body 2/Semi-Bold` 14px, `Labels-Vibrant/Secondary` #999999
- [x] 날짜: `Body 2/Medium` 14px, `[Fg]/Layout/Header/Default` #363636
- [x] 앞뒤 달·선택 불가 날짜: `Labels-Vibrant/Secondary` #999999
- [x] 선택 날짜: 배경 `[Fill]/Brand/Subtle/Default` #d6f8e1, 글자 `[Fg]/Brand/Strong(use this)/Default` #009e53, `Body 2/Semi-Bold`
- [x] 화살표: 제목 옆 24px, 좌우 32px, 모두 36px 정사각 버튼 안에 든다
- [x] 화살표 색: 활성 `[Fill]/Brand/Normal/Default` #1eb87b, 비활성 `[Fg]/Neutral/Normal/Placeholder` #787878
- [x] 오늘 버튼: `Body 1/Semi-Bold` 16px, `System/Success` #00b76e, 오른쪽 정렬, 위에 구분선

### 연월 휠에서 확인한 값 (node 13385:146071 `popup_cal`)

- [x] 휠은 하나다. 연과 월을 `2026년 8월`처럼 한 줄에 합쳐 보여준다. 앞서 세운 "휠 두 개" 가정은 틀렸다.
- [x] 줄 간격 `4px`, 글자 `H2/Medium` 20px, letterSpacing -0.2px (프로젝트 `text-h2-medium`과 정확히 일치)
- [x] 선택 안 된 줄 `Labels-Vibrant/Tertiary` #bfbfbf, 선택된 줄 `Labels-Vibrant/Primary` #333
- [x] 선택 강조는 `rgba(152,227,189,0.15)`(= `flatGreen-200` 15%) 알약, 높이 37px, `radius 100px`, 가로 전체
- [x] 휠이 열리면 제목이 `[Fg]/Brand/Normal/Default` #0aa874로 바뀐다
- [x] 휠 화면은 헤더와 휠 사이 간격이 `14px`이고 좌우 화살표가 사라진다

### 날짜 선택 후 입력 필드 (node 13891:107744 `Text field`)

- [x] 필드: 높이 44px, `bg-fill-neutral-strong-enteredSelected` #f5f5f5, `radius 10px`, `px 8px`, 아이콘과 글자 `gap 4px`
- [x] 선택된 날짜: `Body 1/Medium` 16px, `Labels-Vibrant/Primary` #333
- [x] 달력 아이콘: 20px, 글자와 같은 #333. 스프라이트가 `currentColor`라 부모 글자색만 주면 함께 진해진다. (배치는 이후 사용자 요청으로 시안과 달리 오른쪽 끝으로 옮겼다.)
- [x] 값이 없을 때는 `[Fg]/Neutral/Normal/Placeholder` #787878을 유지한다. 문구는 이후 사용자 요청으로 오늘 날짜를 넣기로 정했다. 앞서 보류였던 "값이 없을 때 무엇을 보여줄지"는 이걸로 닫혔다.

Figma는 필드 안에서 달력 아이콘만 따로 `<button>`으로 감싸지만, 중첩 버튼은 유효하지 않은 마크업이라
필드 전체를 버튼 하나로 두는 기존 구조를 유지했다.

### 남은 가정

- 헤더의 `YYYY년 M월`은 휠 선택을 실시간으로 따라간다. 시안은 헤더가 `2026년 7월`인데 휠 선택은 `2026년 8월`이라 서로 어긋나 있어 확정하지 못했다.
- 휠 줄 값은 연속된 달로 채운다. 시안의 `2023년 5월 / 2024년 6월 / ...`은 연과 월이 같이 1씩 올라가는 목업 문자열이라 실제 데이터로 보지 않았다.
- 휠에는 별도 적용 버튼을 두지 않고 고르는 즉시 반영하며 제목 토글로 그리드에 돌아간다.
- 미래 날짜는 선택할 수 없다. 하한은 2025년으로 `useMakeDate`의 기존 규칙을 따른다.

### 보류

- [x] `usePostWriteSubmit.ts:85`·`usePostEditSubmit.ts:58`이 `date`를 `new Date().toISOString()`으로 덮어쓰는 문제. 커밋 5에서 처리했다.
- [x] `date`를 필수 입력으로 할지. 필수로 확정했고 커밋 5에서 처리했다.

## 커밋 5 — 선택한 날짜 서버 전송

모달에서 고른 날짜를 `POST /posts`와 `PUT /posts/{id}`의 JSON request 파트에 실어 보낸다.

### 정한 것

- 서버가 요구하는 형식은 타임존 표기가 없는 ISO 8601 로컬 날짜·시간 `YYYY-MM-DDTHH:mm:ss`다. 기존 `new Date().toISOString()`은 `Z`가 붙은 UTC라 형식부터 어긋나 있었다.
- 날짜만 고르는 UI라 시·분·초는 제출 시점의 로컬 시각으로 채운다. 같은 날 올라온 글끼리 정렬 순서가 생긴다.
- `date`는 필수다. `RequiredText`로 이미 필수 표시를 하고 있었으므로 스키마를 표시에 맞춘다.

### 작업 항목

- [x] `_utils/buildPostDateTime`로 폼의 `YYYY-MM-DD`와 제출 시각을 합쳐 `YYYY-MM-DDTHH:mm:ss`를 만드는 유틸 추가
- [x] `postWriteSubmitSchema`에 `date` 재정의를 넣어 빈 값이 통과하지 못하게 막기
- [x] `usePostWriteSubmit`의 `date: new Date().toISOString()`을 `buildPostDateTime(values.date)`로 교체
- [x] `usePostWriteSubmit`의 `canSubmit` 의존성 배열에 `watchedValues.date` 추가
- [x] `usePostEditSubmit`의 `date: new Date().toISOString()`을 `buildPostDateTime(values.date)`로 교체
- [x] `buildPostDateTime.test.ts` 추가
- [x] `tests/e2e/post-write.spec.ts`에 날짜 선택 단계 추가. 날짜가 필수가 되면서 기존 두 테스트의 `작성 완료` 버튼이 비활성 상태가 되어 그대로 두면 깨진다.
- [x] `tests/e2e/post-write.spec.ts`에 날짜 미선택 시 버튼 비활성 테스트와 POST 요청 `date` 형식 검증 테스트 추가
- [x] `tests/e2e/post-edit.spec.ts`의 PUT 검증 테스트에 `date` 형식 단언 추가
- [x] jest 253스위트 1434테스트 통과, `tsc` 14개로 develop 기준선과 동일
- [x] `PostEditPage`에 `DateSection` 추가. 수정 화면은 `WriteForm`과 별개로 섹션을 나열하는데 `DateSection`이 빠져 있어서, 전송 로직만 고쳤을 때는 날짜를 보거나 고칠 방법이 없었다. 순서는 작성 화면과 같게 `ContentSection`과 `LocationSection` 사이에 뒀다.
- [x] `DateSection`의 날짜 필드에서 달력 아이콘 제거. 사용자 요청이었다가 곧이어 위치를 바꿔 되살리기로 정해져 아래 항목으로 이어졌다.
- [x] 달력 아이콘을 오른쪽 끝으로 되살리고 `justify-between`으로 텍스트와 갈라 놓기. 자식이 텍스트와 아이콘 둘뿐이라 별도 묶음 없이 양 끝으로 벌어진다.
- [x] 값이 없을 때 플레이스홀더로 오늘 날짜 표시. 고른 값이 아니므로 `time`이 아닌 `span`으로 두고 placeholder 색을 유지한다. 쓰이지 않게 된 `DateSection.placeholder` 키를 `ko.json`·`en.json`에서 제거했다.
- [x] `Date`를 `YYYY-MM-DD`로 만드는 자리가 네 곳으로 늘어 `_utils/formatDateToYmd`로 분리. `DateSection`과 `buildPostDateTime`이 함께 쓴다.
- [x] `post-write.spec.ts`의 `selectToday`가 `time#date-value`를 보도록 강화. 플레이스홀더도 오늘 날짜라 텍스트만으로는 선택 여부를 가릴 수 없어졌다.
- [x] 디자이너가 준 새 달력 아이콘을 `src/assets/write-calendar.svg`로 넣고 매니페스트에 `WriteCalendar`로 등록. `Calendar`가 이미 있어 덮지 않고 글쓰기 전용 이름으로 갈랐다. 원본의 `fill="#787878"`은 생성기의 자동 치환 대상이 아니라 직접 `currentColor`로 바꿔야 부모 글자색을 따라간다. 스프라이트는 97개로 재생성했다.
- [ ] e2e 실행. 프로덕션 빌드가 선행되어야 해서 아직 돌리지 않았다.

### 알아둘 것

- 새 `WriteCalendar`는 viewBox 24×24에 여백이 있어 글리프가 박스의 약 62%만 채운다. 기존 `Calendar`는 16×16에 약 79%였다. 같은 `size`를 주면 새 아이콘이 작아 보이므로 에셋이 저작된 크기 그대로 `size={24}`를 줬다. Figma 필드 시안의 20px는 기존 아이콘 기준 값이라 그대로 쓰면 눈에 띄게 작다. 눈으로 확인이 필요하다.
- 기존 `Calendar`(`src/assets/calendar.svg`)는 지금 쓰는 곳이 없다. `DateSection`이 유일한 사용처였는데 `WriteCalendar`로 옮겨갔다. 다른 화면에서 쓸 계획이 없으면 정리 대상이다.

- 플레이스홀더가 오늘 날짜라서, 날짜를 고르지 않아도 필드가 값이 있는 것처럼 보인다. 그런데 `date`는 필수라 고르기 전에는 `작성 완료`가 비활성이다. 사용자가 "왜 눌리지 않는지" 모를 수 있다. 정말로 오늘 날짜를 기본값으로 넣을지(그러면 필수 검증을 통과하고 버튼이 바로 활성화된다) 기획 확인이 필요하다.

- `DatePickerModal`의 하한 `MIN_YEAR`(2025)는 이전 달 화살표(`isFirstMonth`)와 `MonthWheel`의 목록 시작점에만 걸려 있고 `CalendarGrid`에는 `minDate`가 없다. 수정 화면은 `usePostEditInit`이 `data.createdAt`으로 초기값을 채우므로, 2025년 이전에 작성된 글이 있다면 그 달로 열려 하한 아래 날짜를 고를 수 있다. 서비스 오픈이 2025년이라 실제 API 응답으로는 도달하지 않지만 `post-edit.spec.ts`의 목업은 `createdAt: "2024-01-15T12:00:00Z"`라 그 상태가 된다. 막으려면 `CalendarGrid`에 `maxDate`와 짝이 되는 `minDate`를 추가한다.

### 스코프 제외

- `useTempPostActions.saveTempPost`의 `date: values.date`. `useTempPostActions`와 `useTempPostModal`은 어디서도 import되지 않는 죽은 코드라 이번 범위에서 건드리지 않는다.

### 확인 필요 (백엔드)

- `GET /posts/{id}` 응답(`PostDetailData`)에 `date` 필드가 없다. 그래서 `usePostEditInit`이 `date: data.createdAt`으로 채우고 있고, 수정 화면을 열면 사용자가 골랐던 분실·습득 날짜가 아니라 글 작성 시각이 보인다. 사용자가 날짜를 다시 고르지 않고 저장하면 `createdAt`의 날짜가 `date`로 다시 저장된다. 응답에 `date`가 추가돼야 왕복이 맞는다.
