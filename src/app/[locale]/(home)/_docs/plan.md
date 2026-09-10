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

### 지도 장소 필터 기능

- [ ] **사용자 위치 마커**: 지도에 현재 사용자 위치를 나타내는 마커 표시. GPS 좌표는
      `useMainKakaoMapStore.userGpsLatLng`. `BaseKakaoMap`의 `showCenterMarker`는 지도 중심용이므로
      사용자 위치 마커는 별도로 추가 필요. 디자인 TBD
- [ ] **장소 카테고리 마커 표시**: 헤더 칩(`MainSearchChipList`)의 팝업/카페/맛집 클릭 시 해당
      카테고리 장소 마커들이 지도에 등장. 현재 이 칩들은 `?place=`만 세팅해 `PlaceFilterSheetContent`를
      열 뿐 지도 마커는 안 나옴(`HOME_CONST`에 "기능 미구현, UI 전용" 명시). 마커 데이터 소스(장소
      API) 필요. 디자인 TBD
- [ ] **장소 마커 클릭 시 반경 원 UI**: 팝업/카페/맛집 마커 클릭 시 500m·250m 두 개의 원이 겹친
      형태로 표시되고 두 원의 색상이 다름. `BaseKakaoMap`에 `Circle`/`radius`/`showCircle`이 있으나
      단일 원이라 이중 원 지원 필요. 디자인 TBD
- [ ] **장소 마커 클릭 시 바텀시트**: 위 반경 원과 동시에 해당 장소의 바텀시트가 아래에서 올라옴.
      시트 내부 섹션 데이터와 레이아웃은 TBD
- [ ] **장소 운영 상태에 "브레이크타임" 추가**: 현재 `NeighborhoodPlaceStatus`는 `OPEN`(운영중) /
      `UPCOMING`(오픈 예정) 2가지. 브레이크타임 상태가 추가될 예정. 영향 범위 —
      `_types/NeighborhoodPlace.ts` 타입, `PlaceStatusBadge`의 `STATUS_STYLE` 레코드와 라벨 분기
      (현재 `OPEN`/그 외 삼항이라 3-way로), `PlaceStatusBadge` i18n 키(`statusOpen`/`statusUpcoming` + 신규 키 ko/en 동시), 목업 데이터. 상태값 이름과 디자인 TBD

### 실 API 연동

- [ ] **목업 데이터 실 API 연동 및 재테스트**: 목업으로 작성한 부분을 실제 API로 교체한 뒤 테스트
      진행 — `usePostTypeFeed`(`homeFeedPosts.mock.ts`), `useNeighborhoodPlaces`
      (`neighborhoodPlaces.mock.ts`), 그리고 위 지도 장소 마커/반경/바텀시트 기능에서 새로 만들
      목업. 각 훅의 `queryFn`을 `useAppQuery` 등 실제 호출로 바꾸고 목업 파일 제거, 관련 테스트가
      실제 응답 형태 기준으로 통과하는지 확인
