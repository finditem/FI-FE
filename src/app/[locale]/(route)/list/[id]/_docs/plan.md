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
      기존 `CompleteCheck` 스프라이트 아이콘으로 대체(후속 작업에서 교체 필요)
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
