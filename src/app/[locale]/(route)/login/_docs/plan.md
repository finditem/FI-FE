# login 작업 계획

## 언어 선택 드롭다운 추가

Figma: https://www.figma.com/design/BnMhrCOz7goLFef2jr8Zpf/찾아줘--v2.0?node-id=13614-132558

- [x] `_components/LanguageDropdown/LanguageDropdown.tsx` 작성 (트리거 버튼 아래로 펼쳐지는 옵션 리스트, 선택된 옵션은 브랜드 색상 강조)
  - `usePopoverOutsideClose`, `usePopoverPosition`(`@/hooks`)로 팝오버 동작 재사용 (FilterDropdown 패턴 참고)
  - 옵션 목록은 `routing.locales`(`@/i18n/routing`) 기반, 하드코딩 금지
  - 선택 시 `useRouter`/`usePathname`(`@/i18n/navigation`)으로 locale 전환 (`LanguageSwitcher` 패턴 참고)
- [x] `login/page.tsx`에 `LanguageDropdown` 배치 (이메일 로그인/회원가입 영역 하단, 가운데 정렬)
- [x] 선택한 언어가 로그인 이후 라우팅 전반에 유지되는지 확인 — `middleware.ts`의 `createIntlMiddleware(routing)`가 로케일 전환 시 `NEXT_LOCALE` 쿠키를 자동 관리하므로 `router.replace(pathname, { locale })`만으로 충분, 별도 쿠키 처리 불필요
- [x] 전역 `LanguageSwitcher` 렌더링 제거 — `[locale]/layout.tsx`에서 `<LanguageSwitcher />` 호출부만 제거 (컴포넌트 파일 자체는 보류, 삭제 여부 추후 결정)
- [x] 번역 키 추가 (`src/messages/ko.json`, `src/messages/en.json`) — `Login.languageLabel`, `Login.languageAriaLabel` 추가, 옵션 라벨은 기존 `LanguageSwitcher.ko`/`LanguageSwitcher.en` 재사용
- [x] Storybook 스토리 작성 (`LanguageDropdown.stories.tsx`)
- [x] Jest 테스트 작성 (`LanguageDropdown.test.tsx` — 옵션 렌더링, 선택 시 locale 전환 호출, 외부 클릭 시 닫힘 등, `FilterDropdown.test.tsx` 패턴 참고)
- [x] 코드 리뷰에서 확인된 버그 수정: `router.replace(pathname, { locale })`의 `pathname`(`@/i18n/navigation`의 `usePathname`)이 쿼리스트링을 포함하지 않아, 언어 전환 시 `callbackUrl`/`reason=session-expired` 등 기존 쿼리 파라미터가 소실됨. `useSearchParams`(`next/navigation`)로 현재 쿼리스트링을 읽어 `pathname`에 이어붙이도록 수정, 회귀 테스트 추가

## 후속 작업 (별도 진행, 별도 plan.md)

- [ ] 마이페이지에 언어 변경 옵션 추가 — 디자인이 달라 `LanguageDropdown`을 공통화하지 않고 마이페이지 라우트 전용으로 새로 작성 (로케일 전환 로직만 `LanguageDropdown` 구현 참고)
