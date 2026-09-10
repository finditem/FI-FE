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
- [x] 지도 기본 좌표를 서울시청 → 성수역(위키백과 값 `37.544583, 127.055972`)으로 교체하고
      기본 줌 레벨을 6 → 3(카카오 축척 약 50m, 건물 단위)으로 조정. `src/constants/DEFAULT_MAP_DATA.ts`의
      `DEFAULT_LAT_LNG`·`DEFAULT_ADDRESS` 교체 + `DEFAULT_MAP_LEVEL = 3` 신설, `useMainKakaoMapStore`의
      초기값·`clearLatLng` 리셋값이 이 상수를 참조하도록 변경. 위치 권한이 없거나 거부/미확인인
      사용자도 빈 지도 대신 실제 서비스 데이터가 있는 성수동 일대를 보게 된다. 권한 허용 사용자는
      기존대로 실제 GPS로 센터 이동. 참고: `useMainKakaoMap`의 "내 위치" 리셋은 여전히
      `Math.min(현재레벨, 6)`으로 상한만 걸어 기본 레벨로 되돌리지는 않음 — 필요하면 후속 조정

## 미완료 항목

- [ ] **서비스 지역(성수동) 밖 사용자 안내 토스트**: 지도 기본값이 성수역이 됐으므로, 권한을 허용한
      사용자가 성수동 밖에 있을 때 GPS로 센터를 옮기지 않고 성수역에 머무르게 한 뒤 "지금은 성수동만
      서비스해요" 토스트를 세션당 1회 노출한다. 필요한 것: (1) 서비스 지역 경계 상수 `SERVICE_AREA`
      = `{ lat, lng, radiusM }`(폴리곤 말고 중심+반경 원 하나) + 두 점 거리 판정 한 줄, (2)
      `useMainKakaoMap`의 `applyGpsToMap` 호출 전 "GPS가 지역 안인가" 체크 → 밖이면 `setLatLng`
      생략 + 토스트, (3) `sessionStorage` 플래그로 세션당 1회. 지도 드래그로 벗어나는 경우 토스트는
      후순위. `RecentFoundItem` DTO에 좌표가 없어 아이템 단위 프론트 필터는 불가하고, 서버가
      `latitude/longitude/level`로 이미 반경 필터링 중이라 별도 필터는 불필요
- [ ] **경찰청 습득물 리스트 제거 잔재 정리**: `9abd9297`에서 `PoliceSection`이 단일 배너로 바뀌며
      리스트 UI가 빠졌으나 죽은 코드가 남음 — `MainCardList`의 `mode`/`isPublicMode` 분기와
      `policeChipLabel` 칩, `PublicMoreViewCard` 컴포넌트, `PublicMoreViewCard` i18n
      네임스페이스(`policeLostItemLabel`/`moreLabel`), `usePublicRecentFound` 훅(`(home)` 밖).
      `policeChipLabel` 키 자체는 `public-data` 라우트에서 쓰이므로 유지

### 지도 장소 필터 기능

- [ ] **사용자 위치 마커**: 지도에 현재 사용자 위치를 나타내는 마커 표시. GPS 좌표는
      `useMainKakaoMapStore.userGpsLatLng`. `BaseKakaoMap`의 `showCenterMarker`는 지도 중심용이므로
      사용자 위치 마커는 별도로 추가 필요. 디자인 TBD
- [ ] **장소 카테고리 마커 표시** (코드 완료, 런타임 확인 대기): 헤더 칩(`MainSearchChipList`)의
      팝업/카페/맛집 클릭 시 해당 카테고리 장소 마커만 지도에 표시. 칩 없으면 장소 마커 없음. 장소
      칩 활성 동안 게시글 마커는 숨김. 카드/바텀시트/반경 원/선택 상태는 별도 기능으로 분리.
  - [x] `types/SearchLocationPlacesType.ts` — `PlaceMarker`, `PlaceSummary`, `PlaceTimeRange`,
        `SearchLocationPlacesResponse`
  - [x] `api/useSearchLocationPlaces.ts` — `GET /main/places/search-location`, `type` 인자
        (`null`이면 `enabled:false`), `level = min(mapLevel, 8)`, `useRecentFound`와 동일한 500ms
        좌표 디바운스, `keepPreviousData`. `index.ts`에 export
  - [x] `BaseKakaoMap`에 `placeMarkerData` prop 추가 → `CustomOverlayMap`으로 40px 원형 사진 마커
        (흰 테두리 3px, `shadow 0 3px 4px rgba(0,0,0,.17)`, `#D9D9D9` 배경, `object-cover`).
        렌더 테스트 1건 추가
  - [x] `MainKakaoMap` — `?place=` → `PLACE_FILTER_TO_CATEGORY`로 `type` 도출 → 훅 호출,
        `placeMarkerData` 전달, 장소 모드일 때 `markerData`(게시글)·`showPostMarkers` 숨김
  - [ ] `npm run dev`에서 칩 클릭 → `/main/places/search-location` 응답 확인. 200이면 마커 렌더
        확인, 실패(미배포 등)면 `useSearchLocationPlaces`를 목업 `queryFn`으로 임시 전환
- [ ] **장소 마커 클릭 시 반경 원 UI**: 팝업/카페/맛집 마커 클릭 시 500m·250m 두 개의 원이 겹친
      형태로 표시되고 두 원의 색상이 다름. `BaseKakaoMap`에 `Circle`/`radius`/`showCircle`이 있으나
      단일 원이라 이중 원 지원 필요. 반경 값은 순수 UI(API 무관). 디자인 TBD
- [ ] **장소 마커 클릭 시 바텀시트**: 위 반경 원과 동시에 해당 장소의 바텀시트가 아래에서 올라옴.
      데이터는 `GET /main/places/{placeId}/summary`(장소 정보) + `GET
/main/places/{placeId}/nearby-posts`(주변 게시글 목록, 무한스크롤). 시트 내부 섹션/레이아웃 TBD
- [ ] **`NeighborhoodPlace` 타입을 API `PlaceSummary`에 맞춰 재정의**: 운영 상태가 API에선
      `operationStatus` enum `OPEN | BREAK_TIME | UPCOMING | CLOSED` 4가지 (지금 우리
      `NeighborhoodPlaceStatus`는 `status: OPEN | UPCOMING` 2가지). 반영 범위 —
      `_types/NeighborhoodPlace.ts`(필드명 `status`→`operationStatus`, 값 4개, `distanceM`→
      `stationDistanceMeters`, `PlaceSummary`의 `placeId`/`todayBusinessHours`/`operationPeriod`/
      `isFavorite` 추가 검토), `PlaceStatusBadge`의 `STATUS_STYLE`·라벨 분기를 4-way로,
      `PlaceStatusBadge` i18n 키(`statusOpen`/`statusUpcoming` + `BREAK_TIME`/`CLOSED` 키 ko/en
      동시 추가), 목업 데이터. 디자인(뱃지 색/문구) TBD

### 실 API 연동

- [ ] **목업 데이터 실 API 연동 및 재테스트**: 목업으로 작성한 부분을 실제 API로 교체한 뒤 테스트
      진행 — `usePostTypeFeed`(`homeFeedPosts.mock.ts`), `useNeighborhoodPlaces`
      (`neighborhoodPlaces.mock.ts` → `GET /places`), 그리고 위 지도 장소 마커/반경/바텀시트 기능에서
      새로 만들 목업. 각 훅의 `queryFn`을 `useAppQuery` 등 실제 호출로 바꾸고 목업 파일 제거, 관련
      테스트가 실제 응답 형태 기준으로 통과하는지 확인

## API 참고 (성수 콘텐츠, 2차 MVP)

출처: Confluence "성수 콘텐츠 API 스펙"(finditem.atlassian.net, `pages/145784836`). **경로/구조는 Swagger가
최종 기준** — 차이 나면 Swagger 우선. 응답은 공통 `ApiResponse<T>`(`isSuccess`/`code`/`message`/`result`).
전부 "선택 인증"(비로그인 가능, 로그인 시 `isFavorite` 반영).

### 공통 모델

- **`PlaceSummary`** (홈 목록·지도 목록·가보고 싶은 목록 공용): `placeId`(Long), `name`, `address`,
  `latitude`, `longitude`, `station`, `stationDistanceMeters`(Integer, m), `type`(`CAFE|RESTAURANT|POPUP`),
  `thumbnailUrl`, `operationStatus`(`OPEN|BREAK_TIME|UPCOMING|CLOSED`), `operationPeriod`(`{startDate,
endDate}`, `type=POPUP`만), `todayBusinessHours`(`TimeRange[]`, 정기휴무일이면 `null`), `isFavorite`(Boolean)
- **`PlaceMarker`**: `placeId`, `latitude`, `longitude`, `type`, `thumbnailUrl`
- **`TimeRange`**: `type`(`BUSINESS|BREAK_TIME`), `startTime`, `endTime`(`HH:mm`). 자정 넘김은 `endTime <
startTime`, 시작==종료면 24시간 운영

### 엔드포인트

- **홈 동네 구경 (카테고리 미선택)** — `GET /places`
  - 요청: 쿼리 명세 미확인 (카테고리 optional 추정)
  - 응답: `PlaceSummary[]` 최대 5개, 접기/펼치기는 클라
- **지도 카테고리 마커** — `GET /main/places/search-location`
  - 요청: `latitude`·`longitude` (필수), `level` (1~8, 기본 6), `type` (필수, CAFE/RESTAURANT/POPUP)
  - 응답: `{ placeMarkers: PlaceMarker[], places: PlaceSummary[], totalCount }` — 각 최대 10, 지도중심 거리순
- **장소 동네 정보** — `GET /main/places/{placeId}/summary`
  - 요청: path `placeId` / 응답: `PlaceSummary` 1건
- **주변 게시글 목록** — `GET /main/places/{placeId}/nearby-posts`
  - 요청: 무한스크롤 커서 `nextDistance`+`nextPostId`, 응답에 `hasNext`
  - 응답: `NearbyPostSummary[]` (postId·title·summary·thumbnailImageUrl·address·postStatus·postType·category)
- **주변 게시글 마커** — `GET /main/places/{placeId}/nearby-post-markers`
  - 요청: path `placeId` / 응답: 마커[] (postId·latitude·longitude·postType·postStatus·category)
- **가보고 싶은 장소 추가/취소** — `POST` / `DELETE /places/{placeId}/favorites` (로그인 필수)
  - 응답: `{ placeId, isFavorite }`

### 유의점 (문서 "클라이언트 연동 참고")

- `search-location`은 `type` **필수** → 카테고리 칩 미선택이면 호출 안 함. "전체 카테고리 마커" 모드
  없음. 현재 `?place=` 단일선택 구조와 일치.
- `level`은 **1~8** (벗어나면 `MAP400-LEVEL_INVALID`). 우리 지도 기본 레벨 3은 OK. 게시글 마커
  `useGetMarker`는 11 캡이므로 장소 마커용은 별도로 8 캡 필요.
- 지도 조작 종료 후 **500ms 디바운스**. 지도 범위·카테고리 바뀌면 목록·커서 초기화.
- **경합 처리**: 나중에 시작한 요청의 응답만 화면에 반영.
- 장소 마커 클릭 → `summary`와 `nearby-post-markers`를 각각 조회 (반경 원/바텀시트 항목).
- 반경 원(250m/500m)은 API가 규정하지 않음 — 순수 UI. 디자인 대기.
