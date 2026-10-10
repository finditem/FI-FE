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

## 프로필 이미지 방어 코드

서버가 `profileImg`로 올바른 이미지 값이 아닌 값(예: 숫자 `0`, 문자열 `"0"` 등 URL/경로가 아닌 값)을 보내는 경우 기본 프로필 이미지가 나오도록 방어한다. `ProfileAvatar`는 빈 문자열과 깨진 URL(onError)만 방어하고 `"0"` 같은 비-URL 문자열은 로드 시도 후에야 fallback되므로, 마이페이지 쪽에서 유효한 이미지 값만 넘기도록 정제한다.

- [x] `MyPageProfile`에서 `profileImg`가 유효한 이미지 값(http/https URL 또는 `/`로 시작하는 경로)일 때만 `src`로 넘기고, 그 외에는 `null`을 넘겨 `ProfileAvatar` 기본 이미지로 대체 (`resolveProfileImgSrc` 모듈 헬퍼 추가)
- [x] `MyPageProfile.test.tsx`에 방어 케이스 테스트 추가 (`"0"` 등 잘못된 값이 와도 `ProfileAvatar`에 유효 src가 넘어가지 않음) — 유효 URL 전달 + `it.each`로 `"0"`/`""`/`"abc"`/`"123"` 무효 케이스, 총 9 tests 통과
- [x] `npm run test` + `npm run build`로 검증 (MyPageProfile 9 tests 통과, `npm run build` 성공)

## v2.0 마이페이지 시안 반영

Figma `마이페이지_M`(노드 `16948:136208`) 기준으로 메인 마이페이지를 리디자인한다. 비교 보고서는 https://claude.ai/artifact/EcRNnJ9qqXEtSHgy1GofUU 에 있다. 레이아웃 골격을 먼저 바꾸고, 메뉴 데이터 구성, 아이콘, 찾길 온도 카드 순서로 진행한다. 앞 단계일수록 외부 의존(에셋, API, 다른 담당자 화면)이 없어서 바로 착수할 수 있고, 뒤 단계는 앞 단계의 카드 구조 위에 얹기만 하면 되도록 순서를 잡았다.

확정된 결정 사항은 다음과 같다.

- 시안의 상단 뒤로가기 네비게이션 바는 반영하지 않는다. 하단 탭 진입 화면이므로 지금처럼 헤더 없이 두고 프로필 영역의 상단 safe-area 여백을 유지한다.
- 찾길 온도 값은 추후 백엔드가 유저 정보(`/users/me` 예상)에 넣어 줄 예정이다. UI를 먼저 만들고 기본값 36.5와 TODO 주석으로 표시한다.
- 찾길 후기 상세 화면은 다른 담당자 작업이다. 마이페이지에서는 아이콘 탭의 진입 링크만 연결한다.
- 비로그인 상태에서는 서비스 정책 섹션에 공지사항만 노출하고, 나머지 정책 항목과 로그아웃은 로그인 시에만 노출한다. 공지사항이 아이콘 탭에서 서비스 정책으로 옮겨져도 비로그인 사용자의 공지사항 진입 경로가 유지된다.

### 1단계: 카드 레이아웃 골격 (design 브랜치)

- [x] `MyPageContainer` 배경을 시안의 `[Bg]/Layout 2depth`(#F5F5F5)에 대응하는 토큰(`bg-flatGray-25` 후보, `src/utils/tokens/tailwind.config.js`에서 시맨틱 토큰 우선 확인)으로 지정하고, 섹션 사이 간격을 12px, 좌우 여백을 16px로 맞춘다.
- [x] `MyPageProfile`을 흰 카드(radius 16, 상하 20px, 좌우 16px 패딩)로 감싼다. 상단 safe-area 여백은 카드 바깥 컨테이너로 옮겨 유지한다.
- [ ] `MyPageIconNav`를 흰 카드(높이 84px)로 감싸고 구분선 높이를 46px에서 36px로 줄인다.
- [x] `MyPageMenuSection`의 섹션 사이 `hr`을 제거하고 섹션마다 흰 카드로 감싼다.
- [x] 섹션 제목을 `text-body2-regular text-layout-body-default`에서 H3 SemiBold 18px, `[Fg]/Layout/Header/Default` 토큰으로 바꾸고 터치 영역 높이를 57px로 맞춘다.
- [x] 메뉴 행을 높이 44px, 행 간격 2px, 우측 chevron 24px 구조로 바꾼다. 리딩 아이콘 자리는 3단계에서 채운다.
- [x] 로그아웃 버튼을 다른 행과 같은 모양(텍스트 + chevron)의 행으로 통일한다. 동작은 기존 `useLogout`을 유지한다.
- [ ] 화면 확인 후 `npm run test` + `npm run build`로 검증한다. 기존 스냅샷이나 클래스 기반 테스트가 깨지면 수정은 5단계 test 브랜치에서 한다.

### 2단계: 메뉴 구성과 노출 규칙 (1단계와 같은 PR 또는 후속 design PR)

- [ ] `MYPAGE_TAP_CONFIG`를 찾길 후기, 찜한 장소, 채팅 목록 3개로 교체한다. 찾길 후기와 찜한 장소 링크는 경로가 정해질 때까지 TODO 주석으로 표시한다.
- [x] `MYPAGE_MENU_LIST`의 `servicePolicy.pages` 첫 항목으로 공지사항(`/notice`)을 추가한다.
- [x] `MyPageMenuSection`의 비로그인 필터를 섹션 전체 제외에서 "서비스 정책은 공지사항만 남김"으로 바꾼다.
- [ ] 번역 수정: `MyPageMenu.accountManagement`를 "계정 설정"으로, `MyPageMenu.chatList`를 "채팅 목록"으로 바꾸고, 찾길 후기와 찜한 장소 키를 추가한다.
- [ ] 번역 키는 `src/messages/ko.json`, `en.json`에 동시에 추가하고 `npm run lint:i18n-literal`, `npm run check:i18n-keys`를 통과시킨다.

### 3단계: 메뉴 아이콘 (asset 브랜치)

- [x] Figma에서 메뉴 행 아이콘 18종과 아이콘 탭 아이콘(`message-square-typing`)을 SVG로 받는다. 기존 매니페스트의 `Heart`, `MessageTyping`, `Logout`은 모양이 같은지 확인 후 재사용한다. (확인 결과 `Heart`는 모양이 다르고 `MessageTyping`과 `Logout`은 색상이 고정되어 있어 모두 새로 추가했다. Figma MCP 호출 한도 때문에 사용자가 직접 export한 파일을 사용했다.)
- [x] `src/assets`에 SVG를 추가하고 `icon-manifest.json`에 등록한 뒤 `npm run generate:icon-sprite`로 스프라이트를 생성한다.
- [ ] `MYPAGE_MENU_LIST` 각 페이지에 `iconName`을 추가하고 `useMypageMenuList`와 `MyPageMenuSection`에서 20px 리딩 아이콘을 렌더링한다. 언어 설정 아이콘은 시안의 16px 대신 20px로 통일한다(디자이너 확인 필요).

### 4단계: 찾길 온도 카드 (feature 브랜치)

- [ ] 번역 네임스페이스 `MyPageTemperatureCard`를 정하고 제목, 안내 문구, 눈금 라벨(0℃, 첫 온도 36.5℃, 99℃) 키를 ko/en에 동시에 추가한다.
- [ ] `_components/MyPageTemperatureCard` 컴포넌트를 만든다. 제목과 정보 아이콘, 온도 수치(Title 3 Bold 28px, 브랜드 그린), 안내 문구, 캐릭터 이미지, 0~99℃ 진행 바(트랙 8px, 16px 썸, `shodow6(ondo)` 그림자)로 구성한다.
- [ ] 온도 값은 prop으로 받고 `MyPageContainer`에서 기본값 36.5를 넘긴다. `UsersMeType`에 필드가 생기면 교체하도록 `TODO(담당자)` 주석을 남긴다.
- [ ] `MyPageContainer`에서 프로필 카드와 아이콘 탭 사이에 배치한다. 비로그인 상태 노출 여부가 정해질 때까지는 로그인 시에만 렌더링한다.
- [ ] 캐릭터 이미지를 Figma에서 받아 `public/mypage/` 아래에 추가한다.
- [ ] 이번 단계 범위에서도 `lint:i18n-literal`, `check:i18n-keys`를 통과시킨다.

### 5단계: 테스트와 스토리북 (test 브랜치, 별도 PR)

- [ ] `MyPageMenuSection.test.tsx`: 비로그인 시 서비스 정책에 공지사항만 노출되는지, 로그인 시 로그아웃 행이 노출되는지 검증한다.
- [ ] `MyPageIconNav.test.tsx`: 아이콘 탭 3개 항목과 링크를 검증한다.
- [ ] `MyPageTemperatureCard` 테스트와 스토리를 추가한다. 온도 값에 따른 진행 바 위치를 검증한다.
- [ ] 기존 `MyPageProfile`, `MyPageMenuSection`, `MyPageIconNav`, `MyPageContainer` 스토리를 새 카드 레이아웃에 맞게 갱신한다.

### 미결 사항

- [ ] 찜한 장소 이동 경로: 목록 화면과 조회 API가 없다. 새 화면을 만들지 기존 화면으로 보낼지 정해야 한다.
- [ ] 찾길 후기 진입 링크: 담당자에게 경로를 받는다.
- [ ] 찾길 온도 정보 아이콘 동작(툴팁 또는 모달)과 숨김 상태인 "더보기" 레이어의 이번 범위 포함 여부를 디자이너에게 확인한다.
- [ ] 비로그인 상태의 찾길 온도 카드 노출 방식(숨김 또는 로그인 유도 상태)을 디자이너에게 확인한다.
- [ ] 개인정보처리방침을 비로그인에게 숨겨도 출시 심사에 문제가 없는지 확인한다.
