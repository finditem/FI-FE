# (home) 메인 홈 작업 계획

## 완료 항목

- [x] `RecentFoundItemSection`: 데이터 없음 판정을 `undefined`/비배열까지 포함하도록 수정
      (`!Array.isArray(result) || result.length === 0`) — API가 빈 배열이 아니라 에러/`undefined`를
      줘도 `RecentFoundItemEmpty`가 뜨도록
- [x] `RecentFoundItemSection`: `{address} 최근 발견된 분실물` 헤더(`<h2>`) 제거,
      `ownerWanted`("이 물건들, 주인 찾습니다!")만 유지
- [x] 헤더 제거로 죽은 `useMainKakaoMapStore`(`address`/`latLng`/`syncAddressFromLatLng`) 사용과
      `useEffect` 정리
- [x] 미사용이 된 `RecentFoundItemSection.sectionTitle` i18n 키를 `ko.json`/`en.json`에서 제거
- [x] 분실물/발견물 피드 시트에서 메인 시트로 돌아갈 수 없던 문제 수정 (`useHomeFilterQuery`만
      수정). "모두보기" 첫 클릭은 `post-type`만 지워 통합 피드로 두고(라벨과 일치), 통합 피드에서
      "모두보기"를 재클릭하면(`post-type`·`category` 없음) `feed`도 지워 피드 시트가 닫히고 메인
      시트로 복귀한다. 카테고리 필터가 남아 있으면 시트를 유지한다. `HomeFilterSection`은 안
      건드렸고, 이 훅을 함께 쓰는 검색/마커 시트는 `feed`가 없어 `feed` 삭제 가드에 걸리지 않아
      영향 없음. `HOME_CONST`·`MainSearchChipList` 주석 갱신, 테스트 3건 추가.
      (`PlaceFilterSheetContent`는 헤더 칩 재클릭으로 정상적으로 닫혀 동일 이슈 아님. "지도" 버튼은
      시트 높이만 접는 의도된 동작.)

## 미완료 항목

- [ ] **성수동 범위 지역 필터링**: `RecentFoundItem` DTO에 좌표가 없어 프론트에서 아이템 단위 필터
      불가. `/main/posts/recent-found`가 `latitude/longitude/level`로 이미 서버 반경 필터링 중이므로,
      실제로 필요한 건 위치 권한 없을 때의 기본 좌표 `DEFAULT_LAT_LNG`(현재 서울시청,
      `src/constants/DEFAULT_MAP_DATA.ts`)와 `DEFAULT_ADDRESS`를 성수동으로 교체하는 것. 전역 상수라
      라우트 범위 밖 + 서비스 지역 확정 필요
- [ ] **경찰청 습득물 리스트 제거 잔재 정리**: `9abd9297`에서 `PoliceSection`이 단일 배너로 바뀌며
      리스트 UI가 빠졌으나 죽은 코드가 남음 — `MainCardList`의 `mode`/`isPublicMode` 분기와
      `policeChipLabel` 칩, `PublicMoreViewCard` 컴포넌트, `PublicMoreViewCard` i18n
      네임스페이스(`policeLostItemLabel`/`moreLabel`), `usePublicRecentFound` 훅(`(home)` 밖).
      `policeChipLabel` 키 자체는 `public-data` 라우트에서 쓰이므로 유지
