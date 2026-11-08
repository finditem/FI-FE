# manual 작업 계획

로드맵 6단계(부가 정적 페이지) 첫 페이지: manual(분실/발견/도난 매뉴얼) 영어 번역.

## 커밋 1 — manual 페이지 번역

- [x] `MANUAL_CONST.tsx`(JSX 포함) → `MANUAL_CONST.ts`로 리네임, `title`/`content`/`btnText` 제거하고 항목별 안정적인 `id`(`policeRecord`/`lostPost`/`creditCard` 등)만 남김
- [x] `_hooks/useManualTabs/useManualTabs.ts` 신설 — `useTranslations("ManualTabs")`로 `MANUAL_LIST` 라벨 병합
- [x] `_hooks/useManualData/useManualData.tsx` 신설 — `useTranslations("ManualData")`로 선택된 그룹만 빌드(`useManualData(group)`), `content`는 `t.rich`로 `<br></br>` 처리
- [x] `page.tsx`에서 `MANUAL_LIST` 직접 import 제거, `useManualTabs()` 사용
- [x] `ManualList.tsx`에서 `MANUAL_DATA` 직접 import 제거, `useManualData(selected)` 사용, React key를 `item.title` → `item.id`로 변경
- [x] `layout.tsx`의 정적 `metadata` → `generateMetadata()` + `getTranslations("ManualLayout")` 전환, `DetailHeader title`/sr-only `h1` 번역
- [x] `ManualPopup.tsx`에 `useTranslations("ManualPopup")` 적용
- [x] `messages/ko.json`/`messages/en.json`에 `ManualLayout`/`ManualTabs`/`ManualData`/`ManualPopup` 네임스페이스 추가. `ManualData`는 배열 인덱스가 아닌 `id` 키로 중첩(위치 기반 매핑은 항목 추가/삭제/순서 변경 시 조용히 깨질 수 있어 회피 — `support` 라우트의 `question${id}` 패턴과 같은 취지)
- [x] `ManualList.test.tsx`의 `MANUAL_CONST` mock을 `useManualData` mock(그룹 인자를 받는 시그니처, `id` 필드 포함)으로 교체
- [x] `ManualPopup.test.tsx`/`ManualList.stories.tsx`/`ManualPopup.stories.tsx`는 기존 그대로 통과 확인(전역 next-intl mock/Storybook 데코레이터로 커버)
- [x] `npx jest`(246 스위트/1385 테스트) / `npx tsc --noEmit`(baseline 대비 신규 에러 없음) / `npm run build`(`/manual` ko·en 정적 생성 확인) 검증
- [x] `'찾아줘'`(LOST.lostPost)/`‘찾아줘'`(FOUND.foundPost) 따옴표 혼재 문자열이 ICU 파싱에서 깨지지 않는지 build로 실측 — 정상 통과, 이스케이프 불필요

## 스코프 제외 (참고, 수정 안 함)

- 로드맵 6단계의 다른 페이지(notice, support, terms, change-password, user, not-found)는 별도 브랜치/PR로 분리
