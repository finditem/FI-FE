# FI-FE

[찾아줘!](https://www.finditem.kr/) 서비스의 프론트엔드. Next.js 15(App Router) 기반 단일 앱.

## 스택

- Next.js 15 / React 19 / TypeScript 5 (`next.config.ts`에서 `reactCompiler: true` — React Compiler 활성화)
- Tailwind CSS 3, Framer Motion
- Zustand(상태), TanStack Query v5(서버 상태)
- 실시간: 채팅은 STOMP(`@stomp/stompjs`), 알림은 SSE
- 테스트: Jest(단위), Playwright(e2e, `tests/e2e`), Storybook + Chromatic
- 기타: Sentry, PWA, Web Push, MSW(mock)

## 구조

```
src/
  app/
    (home)/ (route)/ (admin)/   # App Router route group
    (route)/*/                 # 라우트별 _components _hooks _types _utils (private 폴더)
  components/     # 전역 공통 — common / domain / layout / state
  hooks/ store/ utils/ types/  # 도메인 구분 없이 종류별 최상위에 분산
  mock/           # MSW handlers
tests/e2e/        # Playwright 스펙 (기능별 1파일)
.storybook/
```

- 라우트 전용 코드는 해당 라우트 폴더 하위 `_components`/`_hooks`/`_types`/`_utils`(private 폴더)에 둔다. 여러 라우트에서 재사용되면 그때 `src/components`, `src/hooks` 등 전역 폴더로 올린다.
- `hooks/`, `store/`, `utils/`는 도메인별로 묶지 않고, 함수/훅 하나당 폴더 하나(`utils/formatDate/`, `hooks/useLogout/` 등)로 세분화하는 컨벤션이다. 새 유틸/훅을 추가할 때도 이 패턴을 따른다.
- `_components` 하위 컴포넌트도 동일하게 컴포넌트 하나당 폴더 하나. 그 컴포넌트 내부에서만 쓰는 하위 조각은 `_internal` 폴더에 둔다.

## 커밋 컨벤션 (commitlint 강제)

- type: `feat`, `fix`, `docs`, `hotfix`, `refactor`, `test`, `chore`, `rename`, `asset`, `design`, `a11y` 중 하나
- scope 필수 (비워두면 커밋 실패)
- 예: `feat(chat): 채팅방 목록 무한 스크롤 추가`

## 브랜치 전략

Git Flow 변형. 상시 브랜치 3개와 작업별 임시 브랜치로 나눈다.

- 상시 브랜치: `develop`(모든 작업이 모이는 개발 통합) → `release`(출시 전 테스트 서버/QA 점검, 배포 준비) → `main`(운영/출시, 최종 릴리즈).
- 임시 브랜치: `develop`에서 분기해 작업 후 `develop`으로 머지한다. 접두어는 커밋 type에 맞춘다 — `feature/*`, `fix/*`, `docs/*`, `design/*`, `refactor/*`, `test/*`, `chore/*`, `rename/*`, `asset/*`. (커밋 type `feat`에 대응하는 브랜치 접두어는 `feature/*`임에 주의)
- `hotfix/*`만 예외로 `main`에서 분기해 운영 중 긴급 수정에 쓰고 `main`으로 머지한다.
- 일반 작업 PR의 base는 항상 `develop`이다.

## 검증 커맨드

CI(`jest.yml`: PR→develop, `playwright.yml`: PR→main/develop)가 PR 시점에 자동으로 jest/e2e를 돌린다. 로컬 검증은 이를 보완하는 용도로 가볍게 유지한다.

- 기본: `npm run test` + `npm run build` (타입체크 포함). 대부분의 회귀를 이 둘로 잡는다.
- `npm run check:fast`(test/e2e/storybook 병렬) 또는 `npm run check:all`(순차)은 변경이 e2e로 커버되는 플로우나 컴포넌트 스토리를 직접 건드릴 때, 또는 사용자가 요청할 때만 실행한다. 매 응답마다 기본으로 돌리지 않는다.

## 텍스트 작성 원칙

커밋 메시지, PR 본문, 코드 주석 등 Claude가 작성하는 모든 텍스트 산출물은 온전한 문장으로만 작성하고 이모티콘을 사용하지 않는다.

## React Compiler와 메모이제이션

이 프로젝트는 React Compiler가 켜져 있다(`next.config.ts`의 `reactCompiler: true`). 컴포넌트/훅 내부에서 `useMemo`, `useCallback`을 수동으로 작성하지 않는다 — 컴파일러가 자동으로 처리한다. 새 훅이나 컴포넌트를 작성할 때도, 기존 코드를 참고해 복사할 때도 이 패턴을 넣지 않는다. 외부 라이브러리 API가 메모이즈된 함수/값을 명시적으로 요구하는 경우처럼 컴파일러가 커버하지 못하는 예외적 상황에서만 사용하고, 그 경우 왜 필요한지 주석으로 남긴다.

## 데이터 패칭 (Axios + TanStack Query)

상세 가이드는 [`docs/data-fetching-guide.md`](docs/data-fetching-guide.md)에 있다. 새 API 훅을 작성할 때 참고하고, 아래 핵심 규칙은 항상 지킨다.

- 서버 상태는 `src/api/_base/query`의 베이스 훅으로만 접근한다: 단건·목록 조회 `useAppQuery`, 생성·수정·삭제 `useAppMutation`(method·동적 url·`sendDeleteBody` 규칙 준수), cursor 무한 스크롤 `useAppInfiniteQuery`, 복합 pageParam·URL 제어 `useAppCompositeInfiniteQuery`, SSR/SSG/ISR 프리패치 `useServerPrefetchQuery`(네이티브 fetch + 필요 시 `next.revalidate`/쿠키).
- 도메인별 API 훅은 `src/api/fetch/{domain}/api/`에 두고 위 베이스 훅만 조합한다.
- `axios` 인스턴스(`authApi`/`publicApi`)나 `useAxios`를 직접 쓰지 않는다. 인터셉터·WebSocket 등 꼭 필요한 예외만 해당 모듈 한정으로 쓰고 리뷰에 근거를 남긴다.
- 서버 프리패치와 클라이언트 훅의 query key를 일치시켜 hydration 후 캐시를 재사용한다. 공통 응답 래퍼는 `ApiBaseResponseType<T>`.

## 코드 컨벤션

- 상수 분리: 여러 곳에서 참조하도록 export하는 대문자 상수는 컴포넌트·훅 안에 인라인하지 않고 별도 상수 파일 또는 타입 파일로 분리한다.
- 주석(TSDoc):
  - 타입으로 알 수 있는 정보(string, number 등)는 주석에 중복해 적지 않는다.
  - "무엇을 하는지"를 넘어 "어떻게 쓰는지"와 "주의할 점"에 집중한다.
  - 3단 구조로 쓴다: `[요약/상세]` → `[인터페이스/파라미터]` → `[예시]`. props가 없으면 `[요약/상세]` → `[예시]` 2단으로 줄인다.

## 표준 작업 흐름

1. 기존 코드 패턴과 디렉토리 구조를 그대로 따른다. 새 추상화나 새로운 디렉토리 규칙을 임의로 만들지 않는다.
2. `npm run dev`는 사용자가 이미 띄워서 켜둔 상태라고 가정한다. Claude가 직접 실행하지 않는다 — 장기 실행 프로세스라 포트 충돌이나 좀비 프로세스를 남길 수 있다.
3. 로컬 `git commit`은 응답 흐름에 맞춰 자율적으로 수행할 수 있다. 단, 이번 응답에서 Claude가 Edit/Write로 직접 건드린 파일만 `git add`한다 (`git add -A`/`git add .` 금지). 커밋 직전 `git status`로 staging 대상이 의도한 파일과 정확히 일치하는지 확인한다.
4. `git push`, PR 생성 등 원격 저장소에 영향을 주는 작업은 사용자가 명시적으로 요청하기 전에는 수행하지 않는다. force-push는 요청 여부와 관계없이 수행하지 않는다.

## PR 생성

PR은 작업 단위로 쪼개 올리고, 작업 성격이 다르면 PR을 나눈다.

- 기능 코드와 스토리북/테스트 코드를 같은 PR(브랜치)에 올리지 않는다. 기능은 `feature`/`fix`/`design` 등 해당 브랜치로, 스토리북·테스트는 `test/*` 브랜치로 분리해 별도 PR로 올린다. (팀에서 가장 중요하게 보는 규칙)
- 따라서 기능 작업 중 `*.test.tsx`/`*.stories.tsx`를 함께 수정했더라도 기능 PR에는 포함하지 않는다. 커밋·스테이징 단계에서 테스트/스토리 변경을 분리한다.
- 사용자가 PR 생성을 요청하면 `create-pr` 스킬을 실행한다. `gh pr create` 실행 자체는 항상 사용자 확인 후 진행한다 (표준 작업 흐름 4번 규칙).

## 라우트 작업 계획

특정 라우트(`page.tsx`가 있는 디렉토리) 하나에 국한된 작업을 시작하기 전에 `plan-route` 스킬을 실행한다. 해당 라우트 폴더의 `_docs/plan.md`에 작업 항목을 todo 체크리스트로 기록하고 진행에 따라 갱신해, 세션이 끊겨도 다음 세션이나 다른 팀원이 이어받을 수 있게 한다. 여러 라우트에 걸친 작업이나 전역 공통 코드(`src/components`, `src/hooks` 등) 작업에는 적용하지 않는다.

## 지도 작업

네이버 지도 관련 작업(지도 화면, 마커, 줌, 지오코딩, 카카오에서 네이버로의 마이그레이션)을 시작하기 전에 `naver-map` 스킬을 실행한다. 컨텍스트가 되는 문서는 `docs/naver-map/`에 있다. 카카오 로그인은 지도와 무관하므로 이 대상에 포함하지 않는다.
