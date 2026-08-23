# mypage 작업 계획

- [x] 마이페이지 메뉴와 아이콘 탐색 설정을 번역 키 기반 구조로 전환한다.
- [x] 마이페이지 프로필과 오류 안내 문구에 다국어 처리를 적용한다.
- [x] 마이페이지 메타데이터에 다국어 처리를 적용한다.
- [x] 한국어 및 영어 번역 메시지와 관련 타입을 정리한다.
- [x] 마이페이지 관련 테스트와 빌드로 변경 사항을 검증한다.

## 언어 변경 옵션 추가

디자인이 로그인 페이지의 `LanguageDropdown`(인라인 팝오버)과 달리 별도 페이지(라디오 선택 + 하단 확정 버튼)라, 컴포넌트를 공통화하지 않고 `mypage/language` 라우트 전용으로 새로 작성한다. 로케일 전환 로직만 `LanguageDropdown`(`src/app/[locale]/(route)/login/_components/LanguageDropdown`, feat/lag-login 브랜치) 구현 참고.

- [x] `mypage/language/layout.tsx` 작성 — `generateMetadata`로 title/description 설정 (`notifications/layout.tsx` 패턴 참고)
- [x] `mypage/language/page.tsx` 작성 — `DetailHeader` + `h1 sr-only` + 컨테이너 컴포넌트 (`notifications/page.tsx` 패턴 참고)
- [x] Figma 플래그 아이콘 에셋 다운로드 후 커밋 — `public/mypage/language/flag-kr.svg`, `flag-us.svg`(최초 png로 받았다가 svg로 교체). `src/assets`(svgr 대상)와 jest png 트랜스폼 미설정 문제를 피하려 `public/` 경로 문자열로 참조 (`ProfileAvatar`의 `/user/default-profile.svg` 패턴과 동일). `next/image`가 로컬 svg 최적화를 기본 차단하므로 `unoptimized` 지정
- [x] `_components/LanguageSettingsContainer/_internal/LanguageOption` 작성 — `routing.locales`(`@/i18n/routing`) 기반 라디오 옵션, 플래그 아이콘 + 라벨(`useTranslations("LanguageSwitcher")` 재사용) + 우측 라디오, 선택 행 배경 강조. 기존 `RadioOptionItem`(`src/components/common/RadioOptionItem`)은 아이콘 슬롯이 없고 라디오가 좌측이라 레이아웃이 달라 그대로 재사용하지 않음. 별도 리스트 컴포넌트로 분리하지 않고 `LanguageSettingsContainer`에서 직접 map
- [x] `_components/LanguageSettingsContainer` 작성 — 로컬 선택 상태 관리, 현재 `useLocale()` 값과 같으면 하단 `FooterButton`(`@/components`) disabled 처리, 다른 값 선택 후 클릭 시 `useRouter`(`@/i18n/navigation`)로 `router.replace("/mypage", { locale: selected })` 후 `router.refresh()` (`LanguageDropdown`의 로케일 전환 로직 참고, 단 전환 후 이동 대상은 언어 설정 페이지가 아니라 마이페이지 메인으로 지정 — 사용자 피드백 반영)
- [x] `FooterButton`(`sticky bottom-0`)이 리스트를 따라 내려가던 버그 수정 — 옵션이 2개뿐이라 콘텐츠가 뷰포트보다 짧을 때 sticky만으로는 하단에 고정되지 않음. `page.tsx`의 래퍼를 `h-base`(헤더만) 유지한 채 `flex flex-col` 추가, `LanguageSettingsContainer`의 리스트 div에 `flex-1` 추가해 리스트가 남는 공간을 채우고 `FooterButton`이 실제 하단에 붙도록 함 (`change-password` 라우트의 `flex flex-col h-base` + `flex-1` 패턴 참고)
- [x] `MYPAGE_ROUTE_CONFIG.ts`의 `accountManagement.pages`에 `{ key: "languageSettings", pageLink: "/mypage/language" }`를 `accountSettings` 앞에 추가
- [x] 번역 키 추가 (`src/messages/ko.json`, `src/messages/en.json`) — `LanguageSettingsLayout`(title/description), `LanguageSettingsPage`(title/srOnlyTitle/changeButton), `MyPageMenu.languageSettings`. 옵션 라벨은 기존 `LanguageSwitcher.ko`/`LanguageSwitcher.en` 재사용
- [x] Storybook 스토리 작성
- [x] Jest 테스트 작성 — 옵션 선택 시 라디오 토글, 현재 로케일과 동일할 때 버튼 disabled, 다른 로케일 선택 후 확정 시 `/mypage`로 라우터 전환 호출
- [x] 마이페이지 관련 테스트와 빌드로 변경 사항을 검증한다. (`npx jest` 248 suites / 1403 tests 통과, `npm run build` 성공 — `/mypage/language` ko/en 라우트 생성 확인)
