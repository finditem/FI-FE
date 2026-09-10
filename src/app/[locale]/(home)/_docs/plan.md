# (home) 메인 홈 작업 계획

## 완료 항목

- [x] `RecentFoundItemSection`: 데이터 없음 판정을 `undefined`/비배열까지 포함하도록 수정 (`!Array.isArray(result) || result.length === 0`) — API가 빈 배열이 아니라 에러/`undefined`를 줘도 `RecentFoundItemEmpty`가 뜨도록
- [x] `RecentFoundItemSection`: `{address} 최근 발견된 분실물` 헤더(`<h2>`) 제거, `ownerWanted`("이 물건들, 주인 찾습니다!")만 유지
- [x] 헤더 제거로 죽은 `useMainKakaoMapStore`(`address`/`latLng`/`syncAddressFromLatLng`) 사용과 `useEffect` 정리
- [x] 미사용이 된 `RecentFoundItemSection.sectionTitle` i18n 키를 `ko.json`/`en.json`에서 제거 (`check:i18n-keys` 통과)

## 미완료 항목

- [ ] **성수동 범위 지역 필터링**: `RecentFoundItem` DTO에 좌표가 없어 프론트에서 아이템 단위 필터 불가. `/main/posts/recent-found`가 `latitude/longitude/level`로 이미 서버 반경 필터링 중이므로, 실제로 필요한 건 위치 권한 없을 때의 기본 좌표 `DEFAULT_LAT_LNG`(현재 서울시청, `src/constants/DEFAULT_MAP_DATA.ts`)와 `DEFAULT_ADDRESS`를 성수동으로 교체하는 것. 전역 상수라 라우트 범위 밖 + 서비스 지역 확정 필요
- [ ] **경찰청 습득물 리스트 제거 잔재 정리**: `9abd9297`에서 `PoliceSection`이 단일 배너로 바뀌며 리스트 UI가 빠졌으나 죽은 코드가 남음 — `MainCardList`의 `mode`/`isPublicMode` 분기와 `policeChipLabel` 칩, `PublicMoreViewCard` 컴포넌트, `PublicMoreViewCard` i18n 네임스페이스(`policeLostItemLabel`/`moreLabel`), `usePublicRecentFound` 훅(`(home)` 밖). `policeChipLabel` 키 자체는 `public-data` 라우트에서 쓰이므로 유지
- [ ] **분실물/발견물 피드 시트에서 메인 시트로 돌아갈 수 없는 문제**: 헤더 칩(`MainSearchChipList`)으로 `?feed=post&post-type=find` 세팅 → 피드 시트가 열림. 시트 안 `HomeFilterSection`에서 "모두보기"를 누르면 `setFilterQuery(POST_TYPE, "all")`이 `post-type`만 지우고 `feed=post`는 남긴다(의도된 동작 — 통합 피드 유지). 이때 헤더 칩의 `isChipSelected`는 `post-type` 매칭을 요구해서 분실물/발견물 칩이 둘 다 비활성으로 보이고, 시트를 닫을 단일 동작이 사라진다(재클릭 2번 또는 새로고침 외 방법 없음). 해결 방향(택1):
  - (A) 피드 시트 맥락의 "모두보기"가 `feed`까지 지워 시트를 닫게 한다(통합 피드 기능 포기, 변경 최소)
  - (B) `PostTypeSheetContent`에 명시적 닫기 컨트롤 추가(통합 피드 유지)
  - (C, 유력) 분실물/발견물 칩을 토글로 바꾸고 "모두보기" 칩 제거. 규칙을 하나로: **피드 시트가 열려 있음 ⇔ `post-type` 또는 `category` 필터가 활성**. 활성 필터를 모두 끄면 `useHomeFilterQuery`가 `feed`도 지워 메인 시트로 복귀. 이러면 헤더 칩(`MainSearchChipList`) 상태도 항상 동기화돼 desync 버그 자체가 사라짐. 결정 필요: (1) "모두보기" 제거가 `HomeFilterSection`을 쓰는 검색/마커 시트에도 적용됨 — 전역 적용 vs 피드 전용 prop, (2) 분실물+발견물 통합 피드 상태는 없어짐
- [ ] `PlaceFilterSheetContent`의 "지도" 버튼도 `?place`를 안 지우고 접기만 하는 유사 스멜 — 위 닫기 패턴 확정 후 일관되게 적용
