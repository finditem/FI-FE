# write/post/[id] (게시글 수정 페이지) 작업 계획

## 배경

Figma 스펙(찾아줘 v2.0, node-id 15428-316139, "분실했어요 게시글 작성_디스크립션")에 정의된
"게시글 수정 제한 정책" 및 "다국어 정책"을 구현한다.

### 정책 요약

- 동일 계정·동일 게시글 기준 최근 1분 내 최대 5회까지 수정 가능. 서버에서 정상 완료될 때마다 1회 차감.
- 1분 내 5회 수정 완료 후 추가 수정 시도 시 3분간 해당 게시글 수정 제한.
- 제한 도달 시: Toast("1분 내 수정 가능 횟수(N회)를 초과했어요.") 노출 + [작성 완료] 버튼 Disabled 전환,
  버튼 내부에 남은 제한 시간을 초 단위 카운트다운으로 표시. 제한 상태에서도 제목/본문/이미지 등 입력값
  변경은 계속 가능하고, 서버 전송(제출)만 막는다. 카운트다운 종료 시 버튼 Active로 복귀.
- 페이지 이탈 후 재진입해도 남은 제한 시간이 유지되어야 한다 (수정 횟수/제한 타이머는 초기화되지 않음).
- 게시글 변경값 비교: 특수문자만 변경된 경우도 정상 완료 시 수정 1회로 카운트(서버 판단 기준).
- 게시글 캐싱: 상세 조회 캐시를 유지하다가 수정 완료 시 최신 내용으로 갱신 (기존 `usePutPost.ts`가
  `post-detail`/`post-translation`/`posts`/`/users/me/posts` 쿼리를 이미 invalidate하고 있음, 확인됨).
- 다국어: 수정 횟수(5회)/제한 시간(3분)은 로케일과 무관하게 동일 적용. Toast/버튼/카운트다운 등
  시스템 UI 문구는 next-intl로 사용자 설정 언어에 맞춰 노출. 게시글 제목/본문 등 사용자 입력값은
  번역 대상이 아니며 원문 그대로 유지(수정 페이지는 원문 편집 화면이라 기존 게시글 번역 기능과 무관).

## API 계약 (확정)

사용자로부터 실제 백엔드 응답 스펙을 전달받아 반영함. PUT `/posts/{postId}`가 제한에 걸리면:

```json
{
  "isSuccess": false,
  "code": "POST429-UPDATE_RATE_LIMITED",
  "message": "게시글 수정이 1분에 5번을 초과했습니다. 잠시 후 다시 시도해주세요.",
  "result": { "retryAfterSeconds": 180 }
}
```

- `code`가 `POST429-UPDATE_RATE_LIMITED`인지로 분기한다(HTTP status 429 여부는 보지 않음).
- `result.retryAfterSeconds`(초)를 받아 `Date.now() + retryAfterSeconds * 1000`으로 절대 해제
  시각을 계산해 카운트다운에 쓴다.
- 서버 `message`는 그대로 노출하지 않는다 — 다국어 정책상 시스템 문구는 next-intl로 사용자 설정
  언어에 맞춰야 하는데 서버 메시지는 항상 한국어로 고정되어 있기 때문. Toast는 자체 i18n 키
  (`usePutPost.limitExceededToast`)로 렌더링한다.
- 응답에 허용 횟수(5회) 필드는 없다 — 정책 문서상 고정값이라 `POST_EDIT_LIMIT_COUNT` 상수로 관리한다
  (정책이 바뀌면 이 상수도 함께 바꿔야 함).

### 남은 확인 필요 사항

- [ ] 게시글 상세 조회(GET) 응답이 현재 잠금 상태를 함께 내려주는지는 아직 미확인. 확인 전까지는
      제출을 실제로 시도해야만(429 응답) 잠금 여부를 알 수 있다. 페이지 재진입 시에도 카운트다운을
      바로 보여주기 위해 sessionStorage 캐시로 보완했지만(같은 브라우저 탭 한정), 다른 기기·탭·
      시크릿 모드에서는 첫 진입 시 잠금 표시가 뜨지 않고 제출을 시도해야 서버가 다시 막아준다.
      실제 집행(enforcement)은 항상 서버가 하므로 우회는 불가능하고, UX상 프리뷰가 늦게 뜨는
      정도의 제약이다.
- [ ] 무변경 제출(폼 값이 원본과 동일한 제출 시도)에 대한 서버 처리 방침 확인 — 현재 `canSubmit`은
      값 존재 여부만 검증하고 원본과의 diff는 보지 않음 (이번 구현 범위에서는 다루지 않음)

## 구현 체크리스트

### 1. 타입/API 훅

- [x] 제한 상태 타입 추가 — `PostDetailType.ts`에 `PostEditRestriction`/`editRestriction`(optional,
      백엔드가 상세 조회 시 잠금 상태를 내려줄 경우를 대비), 신규 `PostEditLimitType.ts`에
      `PostEditLimitErrorResult`(`retryAfterSeconds`), `POST_EDIT_RATE_LIMIT_CODE`,
      `POST_EDIT_LIMIT_COUNT` 상수
- [x] `usePutPost.ts`의 `onError`에서 `error.response?.data.code === POST_EDIT_RATE_LIMIT_CODE`로
      분기, `retryAfterSeconds`를 절대 시각으로 변환해 콜백에 전달 (`usePatchProfile.ts`의 code 분기
      컨벤션 따름)
- [x] 제한 상태 콜백(`onEditLimitExceeded: (unlockAt: string) => void`)을 `usePutPost` →
      `usePostEditSubmit` → `PostEditPage`로 전달

### 2. 제한 상태 관리 훅 신설

- [x] `[id]/_hooks/usePostEditRateLimit/` 신설 — 서버가 내려준 절대 시각(`unlockAt`) 기준으로 남은
      초를 계산하는 카운트다운 (절대 시각 비교 방식, `useSignUpBtnClick.ts`의 로컬 `setInterval`
      방식과 달리 페이지 재마운트 시에도 유지 가능)
- [x] `postId` 기준 sessionStorage 캐시 추가 — 같은 브라우저 탭에서 페이지 이탈 후 재진입해도
      GET 응답 없이 카운트다운을 복원. 제한이 풀리면 캐시도 함께 정리
- [x] 페이지 최초 진입 시 상세 조회 응답의 제한 상태(`editRestriction`, 아직 백엔드 미확인)로 초기화
- [x] 제출 시 429 응답 수신하면 `activateLimit`으로 전환
- [x] 카운트다운 종료 시 자동으로 Active 상태 복귀

### 3. UI 반영

- [x] `src/components/domain/WriteActionSection/WriteActionSection.tsx`에 `label` prop 추가
      (기본값 `t("submit")` 유지, 다른 3개 사용처(write/post 작성, admin notice 작성/수정)는
      영향 없음)
- [x] `PostEditPage.tsx`의 `isSubmitDisabled` 조건에 `isRateLimited` 추가 — 폼 필드 disabled와는
      분리, 제한 상태에서도 입력은 계속 가능
- [x] 제한 도달 시 Toast 연동 (`usePutPost.ts`의 `onError`에서 `addToast(..., "warning")` 호출 —
      `ToastType`의 `success/error/warning` 중 정책 문구 성격에 맞춰 warning으로 지정)
- [x] Figma(node-id 15428-316068, "Brand - Solid" 카운트다운 버튼) 참고해 잠금 상태 버튼 배경색 반영
      — `WriteActionSection`에 `isRateLimited` prop 추가, true면
      `disabled:!bg-fill-neutralInversed-normal-disabled disabled:!text-neutralInversed-strong-disabled`
      로 회색 톤 오버라이드(기존 `Button` solid variant의 브랜드색 disabled 스타일과 구분).
      `!important`를 쓴 이유: 프로젝트의 `cn()`은 clsx 기반이라 tailwind-merge처럼 충돌 클래스를
      정리해주지 않아, 같은 `disabled:bg-fill-*` 유틸 두 개가 동시에 있으면 승자가 Tailwind 생성
      순서에 좌우되므로 명시적으로 override

### 4. i18n

- [x] 네임스페이스 `usePostEditRateLimit`(버튼 카운트다운), 기존 `usePutPost`에 `limitExceededToast`
      추가
- [x] 하드코딩 대신 `t()`/`useTranslations`로 구현
- [x] `ko.json`, `en.json`에 키 동시 추가
- [x] `npm run lint:i18n-literal`, `npm run check:i18n-keys` 로컬 통과 확인 (기존 경고 132건은
      이번 변경과 무관, 신규 파일에서 발생한 경고 없음)

### 5. 테스트/검증

- [x] `usePostEditRateLimit` 단위 테스트 (초기화, 카운트다운 감소, 만료, `activateLimit` 전환)
- [x] `WriteActionSection` prop 확장에 따른 Storybook 스토리(`RateLimitCountdown`) 및 테스트 추가
- [x] `npm run test` (260 suites / 1470 tests 통과) + `npm run build` (성공)
- [ ] 5회 제한 시나리오의 e2e 커버리지 필요 여부 판단 (mock 서버 구성 필요 — 백엔드 API 확정 후 판단)
- [ ] 백엔드 API 확정 후 실제 응답으로 통합 테스트 재검증
