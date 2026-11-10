# list/[id] 작업 계획

- [x] 게시글 번역 조회 API 타입과 쿼리 훅을 기존 패턴에 맞춰 추가한다.
- [x] 영어 게시글 상세 화면에서 번역된 제목과 본문을 표시하도록 연동한다.
- [x] 번역 API 연동 동작을 테스트로 검증한다.
- [x] 기본 테스트와 빌드를 실행해 회귀를 확인한다.

- [x] Swagger 명세대로 번역 응답 타입과 인증 쿼리를 수정한다.
- [x] `translatedTitle`과 `translatedContent`를 상세 화면에 반영한다.
- [x] 수정된 API 계약을 테스트와 빌드로 재검증한다.

- [x] 실제 공통 응답 래퍼 구조에 맞춰 번역 응답 타입을 수정한다.
- [x] 번역 제목과 본문을 `result`에서 읽고 빈 값에는 원문을 유지한다.
- [x] 번역 응답 구조 수정 후 빌드를 검증한다.

- [x] 비로그인 사용자의 게시글 번역 API 요청을 비활성화한다.
- [x] 변경 후 빌드를 검증한다.

- [x] `PostDetailPreviewKakaoMap`을 `PostDetailPreviewNaverMap`으로 이름 변경한다 (폴더, 파일, `_internal/index.ts` export, `PostDetail` import).
- [x] 번역 네임스페이스 `PostDetailPreviewKakaoMap`을 `PostDetailPreviewNaverMap`으로 ko/en 동시에 변경한다.
- [x] `BaseKakaoMap level={7}`을 `BaseNaverMap zoom={13}`으로 전환한다.
- [x] `post-detail.spec.ts`가 차단하는 지도 SDK 요청을 카카오에서 네이버(`oapi.map.naver.com`)로 바꾼다.
- [x] `npm run check:i18n-keys`, `npm run test`, `npm run build`로 회귀를 확인한다.
- [x] `post-detail.spec.ts` e2e를 확인한다 (로컬 개발 서버가 e2e 모드가 아니라 CI에서 확인).
- [x] 실제 게시글 상세 화면에서 카카오 지도와 배율, 마커 위치가 같은지 확인한다.

전체 기획 스펙(찾기 완료 → 후기 작성 유도 → 후기 작성): [`chat/[postId]/_docs/manner-temperature-spec.md`](../../../chat/%5BpostId%5D/_docs/manner-temperature-spec.md)

## "분실물 찾기 완료" 확인 모달 (매너온도 3차 스프린트, 피그마 node-id=16364-160277)

`PostActionMenu`의 `handleStatusChange`가 확인 없이 바로 `putPostStatus`를 호출하는 문제 수정. Figma
시안은 "SEARCHING → FOUND" 방향에만 해당하는 후기 유도 팝업("고마운 마음을 후기로 남겨볼까요?")이고,
버튼 2개(나중에/후기 남기기) 모두 상태 변경은 확정된다(사용자 확인 완료). 반대 방향(FOUND → SEARCHING)은
이 팝업과 무관 — 기존처럼 확인 없이 바로 변경.

이 모달은 `chat/[postId]`의 헤더 메뉴 "분실물 찾기 완료" 항목에서도 그대로 재사용하므로, 라우트 전용이
아니라 `src/components/domain/PostFoundConfirmModal`에 전역 컴포넌트로 만든다 (2개 라우트에서 재사용되는
시점이라 CLAUDE.md 전역화 기준 충족).

- [x] `src/components/domain/PostFoundConfirmModal/PostFoundConfirmModal.tsx` 신규 작성 — `ModalLayout` +
      `usePutPostStatus(postId, false)` 내장(PostDeleteModal/UserBlockModal과 동일하게 자체 완결형),
      props는 `{ isOpen, onClose, postId }`. 아이콘은 Figma의 커스텀 일러스트를 API 한도로 못 받아와
      임시로 `CompleteCheck` 스프라이트 아이콘으로 대체했다가, 사용자가 직접 첨부한 `good.svg`로 교체
      완료(`Good`, size 48, 기존 원형 배경 래퍼는 제거 — 일러스트 자체가 배경/색을 포함)
  - [x] 버튼 "나중에" / "후기 남기기" 둘 다 현재는 동일하게 상태 변경만 수행 (후기 작성 플로우 자체는
        아직 코드베이스에 없어 이번 범위 밖 — "후기 남기기" 클릭 시 실제 후기 작성 화면으로 이동하는 것은
        후속 작업으로 남김)
- [x] `src/components/domain/index.ts`에 `PostFoundConfirmModal` export 추가
- [x] `PostActionMenu.tsx`: `handleStatusChange`를 `isFound`(FOUND→SEARCHING)일 때는 기존처럼 즉시 호출,
      `!isFound`(SEARCHING→FOUND)일 때는 모달을 먼저 열도록 분리
- [x] i18n: `PostFoundConfirmModal` 네임스페이스로 `title`, `description`, `laterLabel`, `reviewLabel`
      ko/en 동시 추가
- [x] `PostActionMenu.test.tsx` — 기존에 테스트 파일 자체가 없어 해당 없음 (범위 밖, 후속 작업으로 필요 시 신설)
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys`, `npm run test`, `npm run build` 통과 확인

## "후기 남기기" 버튼 토스트 제거 (매너온도 3차 스프린트, 사용자 요청)

`PostFoundConfirmModal`의 "후기 남기기"는 상태 변경 성공/실패 토스트를 띄운 뒤 바로 후기 작성 페이지로
이동해, 토스트가 뜨자마자 라우트가 바뀌는 게 부자연스러웠다. `usePutPostStatus`는 `PostActionMenu`에서도
그대로 토스트가 필요해 훅 자체의 기본 동작은 유지하고, 옵션으로 껐다.

- [x] `usePutPostStatus(postId, isFound, options?)`에 `{ silent?: boolean }` 옵션 추가 — `silent`가
      `true`면 `onSuccess`/`onError` 모두 `addToast` 호출을 건너뛴다(쿼리 무효화는 silent 여부와 무관하게
      항상 수행)
- [x] `PostFoundConfirmModal.tsx`: "나중에" 버튼은 기존 훅 인스턴스(토스트 있음) 그대로 사용, "후기
      남기기" 버튼은 `usePutPostStatus(postId, false, { silent: true })` 별도 인스턴스로 토스트 없이
      상태만 바꾸고 바로 라우트 이동
- [x] `npm run test`, `npm run build` 통과 확인

## 게시글 상세 "찾았어요" 상태 변경 모달 제거 (사용자 요청)

게시글 상세 메뉴에서 "찾았어요"(SEARCHING → FOUND)를 누르면 뜨던 `PostFoundConfirmModal`(후기 유도
모달)을 제거한다. 게시글 상세에는 후기 대상 채팅방(roomId)이 없어 후기 작성 페이지로 넘길 수 없으므로,
확인 모달 없이 즉시 상태만 바꾸고 성공 토스트만 띄운다. `PostFoundConfirmModal` 컴포넌트 자체는 채팅
라우트(`ChatRoomHeaderInfoButton`)에서 그대로 쓰므로 삭제하지 않는다.

- [x] `PostActionMenu.tsx`: `handleStatusChange`를 방향 무관하게 `putPostStatus({ postStatus })` 즉시
      호출로 단순화하고, `PostFoundConfirmModal` import/state(`foundConfirmOpen`)/렌더를 제거한다.
      (`usePutPostStatus`가 기본으로 성공 토스트를 띄움)
- [x] 타입체크로 회귀 확인 (변경 파일 무에러, Sentry 관련 에러는 develop 사전 존재 이슈)

## SEO: 상세 본문 서버 렌더(H1) + soft 404 교정(H2) — 서버 props 방식 재설계

닫힌 PR #1397은 서버 프리패치 데이터를 `HydrationBoundary`로 React Query 캐시에 넣는 방식이었고,
로그인 e2e 6건이 깨져 철회했다. 이번에는 서버 데이터를 캐시에 넣지 않고 props로만 내려, 본문은 서버
데이터로 즉시 그리고 개인화 값과 인터랙션은 기존 클라이언트 쿼리(develop과 동일한 흐름)가 맡는다.

- [x] `_utils/getPostDetailOnServer`: 서버에서 `/posts/{id}`를 익명 fetch(revalidate 60)해 found / notFound(404) / unavailable(그 외 실패)로 구분해 돌려준다.
- [x] `page.tsx`: notFound면 `notFound()`(H2), found면 본문 데이터를 `initialPost` prop으로 `ClientDetail`에 내린다. unavailable이면 기존 클라이언트 렌더로 둔다.
- [x] `ClientDetail`: 본문은 `라이브 쿼리 결과 ?? initialPost`로 그려 서버 HTML에 싣는다(H1). 스켈레톤은 본문 데이터가 전혀 없을 때만 보인다.
- [x] `ClientDetail`: 상단 헤더(즐겨찾기·공유·메뉴), 댓글, 유사 게시글, 댓글 입력은 develop처럼 라이브 쿼리 결과가 생긴 뒤에만 렌더한다. 그 전에는 동작 없는 헤더 자리표시를 둔다.
- [x] `ClientDetail`: 영어 번역을 기다리는 동안 스켈레톤 대신 원문을 보여준다(서버 HTML 유지).
- [x] `PostDetailBody`: 경과 시간 라벨은 서버와 클라이언트 렌더 시각 차이로 달라질 수 있어 hydration 경고를 억제한다.
- [x] `ImageSection`: early return 앞으로 hook을 옮겨, 이미지 개수가 0장과 그 이상 사이로 바뀔 때 hook 개수 불일치로 크래시하던 문제를 고친다.
- [x] `npm run test`(276 suites / 1640 통과), `npm run build` 통과. `next start`로 서버 HTML에 제목·본문 h1이 실리고 `/list/99999999`가 404를 주는 것을 확인했다.
- [ ] e2e(post-detail.spec 익명·로그인 전체)가 CI에서 녹색인지 확인한다.
      로컬(dev 서버, 워커 1개)에서는 10건 중 8건 통과. 로그인 즐겨찾기 추가·제거 2건은 develop에서도 똑같이
      실패하는 기존 문제로, `/users/me` 조회가 끝나기 전에 클릭해 게스트 로그인 모달이 뜨는 경쟁 조건이다.
- [ ] 같은 방식을 PR3b(notice/[id])·PR3c(public-data)에 적용한다(별도 브랜치).
