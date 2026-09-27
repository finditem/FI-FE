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
