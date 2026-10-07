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
- 보낸 후기/숨긴 후기의 리스트(후기 카드) 상태와 전체 API 연동은 별도 작업으로 분리.
- "찾길 후기" 진입 지점 링크 추가는 이번 범위 제외.
- 신규 라우트 컴포넌트의 Storybook/Jest 테스트는 별도 PR로 분리(컨벤션).

## 받은 후기 리스트 상태 퍼블리싱 (Figma node 16664-86655)

참고 Figma: "받은 후기" 탭에 후기가 있을 때의 리스트 상태. 상단 "후기 N" 카운트 + 후기 카드 반복.
받은 후기 API가 아직 없어(매너온도 3차 스프린트 공통 이슈 — `project-manner-temperature-sprint3`
메모리 참고) 더미 데이터로 리스트 자체를 퍼블리싱하고, 실제 연동은 TODO로 남긴다.

### 설계 메모

- 카드 구조(아바타 60px, 닉네임, 케밥 메뉴, 위치·시간, 본문 2줄 말줄임, 태그 칩 + "+N" 배지)는
  기존 공통 컴포넌트로 전부 구성 가능해 새 디자인 시스템 컴포넌트를 만들지 않음:
  - 아바타: `ProfileAvatar`(size 60) — 프로필 이미지는 사용자별 동적 데이터라 Figma 목업 이미지를
    에셋으로 쓰지 않고 기존 fallback(`/user/default-profile.svg`) 그대로 사용.
  - 태그 칩: 공통 `Chip` — 회색 라벨 칩은 `type="neutralStrong"`(bg #f5f5f5 / text #5d5d5d), "+N"
    배지는 `type="brandSubtle"`(bg #d6f8e1 / text #0aa874)로 Figma 색상과 정확히 일치.
  - 케밥(···) 버튼: 공통 `KebabMenuButton`(`size="small"`, 20px). Figma의 점 아이콘은 가로 점 3개
    (`dot-horizontal2`)인데 반해 기존 `DetailMenu` 아이콘은 세로 점 3개라 완전히 일치하지는 않음 —
    Figma MCP 호출 한도 초과로 정확한 에셋을 내려받지 못해 기존 아이콘으로 대체. 추후 에셋 확보 시 교체.
  - 본문 2줄 말줄임: `line-clamp-2`(`UserCommentItem`/`CommentMeta`에서 쓰는 패턴과 동일).
  - 닉네임/카운트 텍스트: 디자인 토큰 체계에 "Body1/Bold"(16px·700)가 없어 가장 가까운
    `text-body1-semibold`로 대체(`UserCommentItem`의 닉네임류 텍스트와 동일 선택).
- 더미 데이터: `_constants/MOCK_RECEIVED_REVIEWS.ts`에 Figma 카피 그대로(오탈자 "아전히" 포함) 2건
  하드코딩, `TODO(수현)` 주석으로 API 연동 시 교체 지점 표시. `lint:i18n-literal`에서 이 파일은
  한글 리터럴 경고가 뜨는데, UI 번역 키가 아니라 임시 목데이터라 의도된 경고임.
- `ReviewCard`는 `ReviewsContent`에서만 쓰는 내부 구현이라 `_components/_internal/`에 배치
  (`user/[userId]`의 `_components/_internal/UserCommentItem` 선례를 따름 — `_components/index.ts`
  공개 배럴에는 올리지 않음).
- `ReviewsContent`의 "received" 분기를 `MOCK_RECEIVED_REVIEWS.length === 0` 체크로 바꿔 빈 상태/리스트
  상태를 모두 유지 — API 연동 시 목데이터 배열만 실제 fetch 결과로 교체하면 되는 구조.

### 작업 항목

- [x] `_types/ReviewCardData.ts` — 카드 하나의 데이터 shape (`id`/`nickname`/`location`/`createdAt`/
      `content`/`tagLabel`/`extraTagCount`)
- [x] `_constants/MOCK_RECEIVED_REVIEWS.ts` — Figma 카피 기반 더미 데이터 2건
- [x] `_components/_internal/ReviewCard` — 카드 프레젠테이션 컴포넌트(아바타/닉네임/케밥/위치·시간/
      본문/칩)
- [x] `ReviewsContent`의 "received" 분기를 리스트 상태로 확장 ("후기 N" 카운트 헤더 + `ReviewCard` 목록,
      빈 배열이면 기존 `EmptyState` 유지)
- [x] 번역 키 추가: `MypageReviewsPage.countLabel`, `ReviewCard.menuAriaLabel` (ko/en)
- [x] `npm run check:i18n-keys` 통과 확인
- [x] `npm run build`(타입체크 포함) 통과, `/ko|en/mypage/reviews` 라우트 생성 확인
- [x] `npm run test`(251 suites / 1454 tests) 통과 확인
- [ ] 로컬 dev에서 받은 후기 탭 리스트 카드 렌더링 눈으로 확인 (dev 서버는 사용자 실행)
- [ ] 케밥 메뉴 가로점 아이콘(`dot-horizontal2`) 에셋 확보 후 교체 — 현재는 기존 세로점 `DetailMenu`로 대체
- [ ] 케밥 메뉴 클릭 동작(신고/숨기기 등) 연동 — 현재는 버튼만 퍼블리싱, onClick 미연결
