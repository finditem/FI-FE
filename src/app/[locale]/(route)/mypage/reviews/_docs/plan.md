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

- 보낸 후기 확정 문구는 디자인 확정 후 반영.
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
- 더미 데이터: `src/mock/data/review.data.ts`에 Figma 카피 그대로(오탈자 "아전히" 포함) 2건
  하드코딩, `TODO(수현)` 주석으로 API 연동 시 교체 지점 표시. `lint:i18n-literal`에서 이 파일은
  한글 리터럴 경고가 뜨는데, UI 번역 키가 아니라 임시 목데이터라 의도된 경고임.
- `ReviewCard`는 `ReviewsContent`에서만 쓰는 내부 구현이라 `_components/_internal/`에 배치
  (`user/[userId]`의 `_components/_internal/UserCommentItem` 선례를 따름 — `_components/index.ts`
  공개 배럴에는 올리지 않음).
- `ReviewsContent`의 "received" 분기를 `MOCK_RECEIVED_REVIEWS.length === 0` 체크로 바꿔 빈 상태/리스트
  상태를 모두 유지 — API 연동 시 목데이터 배열만 실제 fetch 결과로 교체하면 되는 구조.
- 하이드레이션 에러 대응: 더미 데이터의 `createdAt`이 모듈 로드 시점 `Date.now()` 기준 상대 시각이라
  서버 렌더(서버 프로세스 모듈 로드 시각)와 클라이언트 하이드레이션(클라 번들 로드 시각)의 값이 달라
  `<time>`의 `dateTime`/상대 라벨이 어긋났음. `ReviewsContent`의 received 리스트를 `useState`/`useEffect`
  마운트 플래그로 가려 SSR·첫 렌더에는 `LoadingState`만 보여주고, 마운트 이후에만 시간 의존 카드를
  렌더하도록 함(실제 리스트도 클라이언트 패칭이므로 로딩→리스트 흐름이 자연스러움). API 연동 시 이
  마운트 게이트는 쿼리의 `isLoading`으로 대체.

### 작업 항목

- [x] `_types/ReviewCardData.ts` — 카드 하나의 데이터 shape (`id`/`nickname`/`location`/`createdAt`/
      `content`/`tagLabel`/`extraTagCount`)
- [x] `src/mock/data/review.data.ts` — Figma 카피 기반 더미 데이터 2건
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

## 숨긴 후기 빈 상태 퍼블리싱

받은/보낸 후기와 동일한 형식(`EmptyState` + 아이콘 + title + description)으로 숨긴 후기 탭의
빈 상태를 추가. 아이콘은 사용자가 전달한 `~/Desktop/hidden-review.svg`, size는 다른 두 탭(90)과
달리 70으로 지정(사용자 지정값, 원본 viewBox가 71x70이라 자연스러운 크기이기도 함).

- [x] `hidden-review.svg`를 `src/assets/`로 복사, `icon-manifest.json`에 `HiddenReview` 등록,
      스프라이트 재생성(107개) 확인
- [x] `ReviewsContent`의 "hidden" 분기를 `EmptyState(icon="HiddenReview", iconSize=70)`로 교체
      (기존 `return null` 제거)
- [x] 번역 키 추가: `MypageReviewsPage.empty.hiddenTitle`("숨긴 후기가 없어요")/
      `hiddenDescription`("후기는 여기에서 확인하고 언제든 다시 해제할 수 있어요.") — ko/en
- [x] `npm run check:i18n-keys` 통과 확인
- [x] 타입체크(`npx tsc --noEmit`, 기존 무관 에러 외 신규 에러 없음) + `npm run test`(251 suites /
      1454 tests) 통과 확인. `npm run build`는 사용자의 로컬 `next dev`가 이미 `.next`를 쓰고 있어
      충돌 — 이번엔 건너뜀(아래 "막힌 지점" 참고)
- [ ] 로컬 dev에서 숨긴 후기 탭 빈 상태 렌더링 눈으로 확인

### 막힌 지점

`npm run build`가 `.next` 디렉터리를 사용자의 실행 중인 `next dev`(같은 프로젝트 경로)와 동시에
건드리면서 `PageNotFoundError`로 실패함(코드 문제 아님 — dev 서버가 켜져 있는 동안 `next build`를
돌리면 `.next` 산출물 형식이 충돌). 이후 세션에서는 dev 서버가 켜져 있을 때 `npm run build`를
돌리지 말고, `npx tsc --noEmit`(타입체크) + `npm run test`로 대체 검증할 것. 전체 build 검증이
필요하면 사용자에게 dev 서버를 잠시 멈춰달라고 요청할 것.

## 받은 후기 리스트 로딩 상태 퍼블리싱 (Figma node 17635-133898, TalkToFigma로 조회)

참고 Figma: "찾길 후기_받은 후기_M_로딩중" (파일 `BnMhrCOz7goLFef2jr8Zpf`, node 17635:133898).
주의: 이름이 비슷한 node 17651:138357("찾길 후기_받은 후기_로딩중_M")은 실제로는 후기 편지
상세(ReviewLetterDetail, `feat/review-letter-detail` 브랜치 소관) 페이지의 로딩 스켈레톤이라
이 작업 범위가 아님 — 이름 순서(`M_로딩중` vs `로딩중_M`)로 두 프레임이 구분됨. 공식 Figma
MCP(`mcp__figma__*`)는 Starter 플랜 호출 한도로 막혀 있어, 사용자가 켜둔 Figma 데스크톱 앱의
Talk to Figma 플러그인(채널 `mz1bgy0p`, `mcp__TalkToFigma__*`)으로 대신 조회함.

이 작업은 `develop` 최신 커밋에서 새로 분기한 `design/mypage-reviews-loading` 브랜치
(worktree: `/Users/isuhyeon/orca/workspaces/FI-FE/design-reviews-loading`)에서 진행. 작업
도중 기존 작업 브랜치 `feat/review-letter-detail`(worktree `develop-3`)에서 과거 세션이 stash
적용 충돌을 미해결 상태로 남겨둔 것을 발견했으나, 이번 작업과 무관해 손대지 않고 그대로 보존함
(develop-3 쪽에서 별도로 해결 필요).

### 설계 메모

- Figma 프레임 구조: 탭(`Tab Menu`, 이미 공통 컴포넌트로 구현됨) 아래 "후기 N" 카운트 라벨
  자리의 회색 바(42x24, 내부 bar 42x16 rounded-4) + `Review1` 카드 스켈레톤 2개 반복.
- 카드 스켈레톤(`Review1`, 350x148, `ReviewCard`와 동일한 `px-5 py-[30px]` 패딩)은 실제
  `ReviewCard`의 레이아웃을 그대로 따름:
  - 아바타 자리: 60x60 원형 (`Ellipse 87`)
  - 닉네임/위치 자리: 87x20 + 140x16, 둘 다 rounded-4, gap 4px → 실제 카드의
    `flex flex-col gap-1` 헤더 영역과 1:1 대응
  - 본문 자리: 350x40 rounded-10 블록 하나로, 실제 카드의 2줄 말줄임(`line-clamp-2`) 본문을
    표현 (줄 단위로 나누지 않음) — 실제 카드와 동일하게 `mt-3`
  - 태그 자리: 183x24 + 30x24 pill(rounded-full), gap 4px — 실제 `Chip`/`+N` 배지 자리,
    실제 카드와 동일하게 `mt-3 gap-1`
  - 배경의 연한 민트색 블롭 장식(`Frame 2`, e3fcee)은 스크린샷에는 보이지 않는 장식용
    잔여 요소로 판단해 구현 생략.
- 기존 스켈레톤 컨벤션(`NoticeListSkeleton`, `PostFeedSkeleton`) 그대로 따름:
  `bg-labelsVibrant-quaternary skeleton-animation` 공통 클래스 + `cn()` 조합, 컴포넌트
  하나당 폴더 하나(`_internal/ReviewListSkeleton/ReviewListSkeleton.tsx`).
- `ReviewsContent`의 `!isMounted` 분기(하이드레이션 에러 회피용 임시 게이트, 추후
  `isLoading`으로 교체 예정이라고 이미 TODO 주석 있음)에서 기존 범용 `LoadingState`(스피너)
  대신 이 `ReviewListSkeleton`을 반환하도록 교체.
- 카드 반복 개수: Figma가 정확히 2개만 보여주고(헤더+탭+카드2개로 390x844 한 화면이 꽉 참),
  임의로 늘리지 않고 Figma 그대로 `count` 기본값 2로 설정(prop으로 오버라이드 가능).
- 적용 범위(사용자 피드백 반영): 로딩 스켈레톤은 받은/보낸/숨긴 세 탭 모두에 적용한다. 따라서
  마운트 게이트(`!isMounted`)를 `received` 분기 안이 아니라 탭 분기 바깥 최상단으로 올려, 어떤
  탭으로 진입하든(`?tab=received/sent/hidden`) 첫 렌더에 스켈레톤이 보이도록 한다. 보낸/숨긴 탭
  전용 로딩 디자인은 Figma에 따로 없어 같은 `ReviewListSkeleton`을 재사용한다. 마운트 이후에는
  각 탭이 기존대로 리스트(받은) 또는 빈 상태(보낸/숨긴)를 렌더한다.

### 작업 항목

- [x] `_components/_internal/ReviewListSkeleton/ReviewListSkeleton.tsx` 작성 (카운트 라벨
      스켈레톤 + `ReviewCardSkeletonItem` 2개 반복)
- [x] `ReviewsContent`의 `!isMounted` 분기를 `LoadingState` → `ReviewListSkeleton`으로 교체
- [x] 마운트 게이트를 탭 분기 밖 최상단으로 올려 세 탭(받은/보낸/숨긴) 모두 로딩 스켈레톤 적용
- [x] `npx jest reviews` 통과 확인 (258 suites / 1534 tests)
- [ ] 로컬 dev에서 `/ko/mypage/reviews?tab=received|sent|hidden` 첫 렌더(마운트 전) 시 스켈레톤
      노출 눈으로 확인 (dev 서버는 사용자 실행 — 이번엔 새 worktree라 아직 안 띄워져 있음)
- [ ] 신규 컴포넌트(`ReviewListSkeleton`)의 Storybook/Jest 테스트는 별도 `test/*` 브랜치·PR로
      분리(컨벤션)

## 숨긴 후기 탭 제거

제품 기능 삭제 결정에 따라 마이페이지 후기 목록에서 숨긴 후기 탭과 관련 쿼리 상태를 제거한다.

- [x] 후기 탭과 `ReviewTabType`에서 `hidden`을 제거한다.
- [x] 기존 `?tab=hidden` 접근은 기본 받은 후기 탭으로 폴백하도록 변경한다.
- [x] 숨긴 후기 빈 상태, 번역 키, Storybook 상태를 제거한다.
- [x] 기존 테스트를 두 탭 구조에 맞게 갱신한다.
