# reviews 작업 계획

/mypage/reviews "찾길 후기" 페이지 퍼블리싱. 받은 후기 / 보낸 후기 / 숨긴 후기 세 탭을
쿼리스트링으로 구분한다. 이번 범위는 탭 구조 + 빈 상태(Empty) 퍼블리싱까지. 후기 리스트 카드와
API 연동은 제외한다.

참고 Figma: `찾길 후기_받은 후기_Empty_M` (node 16364-160726)

## 확정된 결정 (사용자 피드백 반영)

- 이번 범위는 빈 상태까지만.
- 숨긴 후기 탭은 일단 콘텐츠를 비워 둔다(빈 상태 UI 없이 placeholder).
- 빈 상태는 공통 `EmptyState`(`@/components`) 컴포넌트를 사용한다. `icon`/`title`/`description`을
  직접 받는 범용 컴포넌트라 공통 코드 수정 없이 재사용 가능(`user/[userId]`의 `TabContents` 패턴과 동일).

## 설계 메모

- 라우트: `src/app/[locale]/(route)/mypage/reviews/`
- 탭 구분: 쿼리스트링 `?tab=received | sent | hidden` (값 없음/비정상 값이면 `received`로 폴백).
  `received`는 기본값이라 쿼리에서 제거. `user/[userId]`의 `useUserProfileTabQuery` 패턴 그대로 따른다.
- 헤더: 공통 `DetailHeader` title="찾길 후기"(번역 키).
- 탭 UI: 공통 `Tab`(`@/components`) 재사용 — Figma의 녹색 밑줄/60px/3등분과 일치. 새 탭 컴포넌트 안 만든다.
- 빈 상태: `EmptyState` + 새 아이콘. iconSize 90(Figma 90x81, viewBox 95x90).
  - 받은 후기: "아직 받은 후기가 없어요" / "후기편지가 도착하면 여기에 후기 목록이 표기돼요." (Figma 확정)
  - 보낸 후기: 받은 후기 패턴에 맞춰 임시 문구 작성(디자인 확정 시 교체).
  - 숨긴 후기: 빈 상태 없이 비워 둠.
- 아이콘 등록: `~/Desktop/receive-review.svg`, `send-review.svg`를 `src/assets/`로 복사하고
  `icon-manifest.json`에 `ReceiveReview`/`SendReview`로 등록. 멀티컬러(녹색/화이트)라 스프라이트의
  currentColor 변환(#000/#D9D9D9) 영향 없이 색 유지. 스프라이트는 predev/prebuild에서 자동 생성.

## 작업 항목

### 아이콘 에셋

- [x] `receive-review.svg`, `send-review.svg`를 `src/assets/`로 복사
- [x] `icon-manifest.json`에 `ReceiveReview`/`SendReview` 등록
- [x] `npm run generate:icon-sprite`로 스프라이트 생성 확인 (106개, 두 심볼 등록 확인)

### 라우트 골격

- [x] `reviews/layout.tsx` — `generateMetadata`(title/description), `other: { "page-type": "mypage-reviews" }` (`comments/layout.tsx` 참고)
- [x] `reviews/page.tsx` — 서버 컴포넌트. `DetailHeader title={t("title")}` + `h1 sr-only` + 컨테이너 (`comments/page.tsx` 참고)

### 탭 + 콘텐츠 컴포넌트

- [x] `_types/ReviewTabType.ts` — `ReviewTabType = "received" | "sent" | "hidden"`
- [x] `_hooks/useReviewTabQuery` — `useSearchParams` 파싱(폴백) + `router.replace`로 탭 변경 (`useUserProfileTabQuery` 참고)
- [x] `_components/ReviewsContainer` (client) — `useReviewTabQuery`로 선택 탭 관리, `Tab` 렌더 + `ReviewsContent`
- [x] `_components/ReviewsContent` — 탭별 분기. received/sent는 `EmptyState`, hidden은 빈 placeholder (TODO 주석)
- [x] `_components/index.ts` 배럴 export

### 번역(i18n)

- [x] 네임스페이스: `MypageReviewsLayout`(title/description), `MypageReviewsPage`(title/srOnlyTitle/탭 라벨 + 빈 상태 heading/description)
- [x] `src/messages/ko.json`, `en.json`에 키 동시 추가
- [x] `npm run lint:i18n-literal`(reviews 파일 경고 없음), `npm run check:i18n-keys`(ko/en 일치) 통과 확인

### 검증

- [x] `npm run test`(251 suites / 1453 tests 통과) + `npm run build`(타입체크 포함) 통과, `/ko|en/mypage/reviews` 라우트 생성 확인
- [ ] 로컬 dev에서 `?tab=received/sent/hidden` 전환 및 빈 상태 노출 눈으로 확인 (dev 서버는 사용자 실행)

## 열린 질문 / 후속

- 숨긴 후기 빈 상태 아이콘/문구, 보낸 후기 확정 문구는 디자인 확정 후 반영.
- 각 탭의 리스트(후기 카드) 상태와 API 연동은 별도 작업으로 분리.
- "찾길 후기" 진입 지점 링크 추가는 이번 범위 제외.
- 신규 라우트 컴포넌트의 Storybook/Jest 테스트는 별도 PR로 분리(컨벤션).
