# FI-FE

[찾아줘!](https://www.finditem.kr/) 서비스의 프론트엔드. Next.js 15(App Router) 기반 단일 앱.

## 스택

- Next.js 15 / React 19 / TypeScript 5
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

## 검증 커맨드

CI(`jest.yml`: PR→develop, `playwright.yml`: PR→main/develop)가 PR 시점에 자동으로 jest/e2e를 돌린다. 로컬 검증은 이를 보완하는 용도로 가볍게 유지한다.

- 기본: `npm run test` + `npm run build` (타입체크 포함). 대부분의 회귀를 이 둘로 잡는다.
- `npm run check:fast`(test/e2e/storybook 병렬) 또는 `npm run check:all`(순차)은 변경이 e2e로 커버되는 플로우나 컴포넌트 스토리를 직접 건드릴 때, 또는 사용자가 요청할 때만 실행한다. 매 응답마다 기본으로 돌리지 않는다.

## 텍스트 작성 원칙

커밋 메시지, PR 본문, 코드 주석 등 Claude가 작성하는 모든 텍스트 산출물은 온전한 문장으로만 작성하고 이모티콘을 사용하지 않는다.

## 표준 작업 흐름

1. 기존 코드 패턴과 디렉토리 구조를 그대로 따른다. 새 추상화나 새로운 디렉토리 규칙을 임의로 만들지 않는다.
2. `npm run dev`는 사용자가 이미 띄워서 켜둔 상태라고 가정한다. Claude가 직접 실행하지 않는다 — 장기 실행 프로세스라 포트 충돌이나 좀비 프로세스를 남길 수 있다.
3. 로컬 `git commit`은 응답 흐름에 맞춰 자율적으로 수행할 수 있다. 단, 이번 응답에서 Claude가 Edit/Write로 직접 건드린 파일만 `git add`한다 (`git add -A`/`git add .` 금지). 커밋 직전 `git status`로 staging 대상이 의도한 파일과 정확히 일치하는지 확인한다.
4. `git push`, PR 생성 등 원격 저장소에 영향을 주는 작업은 사용자가 명시적으로 요청하기 전에는 수행하지 않는다. force-push는 요청 여부와 관계없이 수행하지 않는다.

## PR 생성

사용자가 PR 생성을 요청하면 `create-pr` 스킬을 실행한다. `gh pr create` 실행 자체는 항상 사용자 확인 후 진행한다 (위 4번 규칙).

## 라우트 작업 계획

특정 라우트(`page.tsx`가 있는 디렉토리) 하나에 국한된 작업을 시작하기 전에 `plan-route` 스킬을 실행한다. 해당 라우트 폴더의 `_docs/plan.md`에 작업 항목을 todo 체크리스트로 기록하고 진행에 따라 갱신해, 세션이 끊겨도 다음 세션이나 다른 팀원이 이어받을 수 있게 한다. 여러 라우트에 걸친 작업이나 전역 공통 코드(`src/components`, `src/hooks` 등) 작업에는 적용하지 않는다.
