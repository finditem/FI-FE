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
- [x] **장소 카테고리 마커 표시**: 헤더 칩(`MainSearchChipList`)의 팝업/카페/맛집 클릭 시 해당
      카테고리 장소 마커만 지도에 표시. 칩 없으면 장소 마커 없음. 장소 칩 활성 동안 게시글 마커는
      숨김. 카드/바텀시트/반경 원/선택 상태는 별도 기능으로 분리.
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
  - [x] 임시 dev 목업으로 원형 마커 렌더가 디자인대로 나오는 것 확인 후 목업 제거. **DB에 `place`
        /`placeMarker` 데이터가 생성되면 `/main/places/search-location` 응답으로 마커가 렌더된다.**
        (현재 엔드포인트는 200이지만 성수동 장소 데이터가 없어 `placeMarkers: []`)

### 장소 마커 클릭 (반경 원 + 탭 바텀시트)

Figma: [동네 정보 탭](https://www.figma.com/design/BnMhrCOz7goLFef2jr8Zpf/?node-id=12752-98789),
[근처 분실물 탭](https://www.figma.com/design/BnMhrCOz7goLFef2jr8Zpf/?node-id=12720-121960)

반경은 **500m로 확정**. Swagger 설명문 근거 — `nearby-posts`/`nearby-post-markers` 둘 다 "장소 반경
500m"로 서버가 자른다. 즉 화면 고정 크기가 아니라 지리적 반경이므로 줌에 따라 원 크기가 변해야 한다.
안쪽 250m 원은 데이터와 무관한 장식이다.

- [x] `HOME_CONST`에 선택 장소 파라미터(`?place-id`) 추가. 기존 `MARKER_ID`(게시글 마커)와 별개이며,
      `BottomSheet`의 콘텐츠 분기에 한 갈래를 더한다
- [x] `mapController`에 API 훅 3개와 타입 추가
  - [x] `usePlaceSummary` — `GET /main/places/{placeId}/summary`, `PlaceSummary` 1건
  - [x] `useNearbyPosts` — `GET /main/places/{placeId}/nearby-posts`. 서버가 `postType`·`postStatus`
        ·`category` 필터와 `lastDistance`+`lastPostId` 커서를 받으므로 클라 필터링은 하지 않는다.
        무한스크롤은 `useAppInfiniteQuery` 사용
  - [x] `useNearbyPostMarkers` — `GET /main/places/{placeId}/nearby-post-markers`, 최대 10개
- [x] `BaseKakaoMap` 반경 원 확장: 현재 `Circle`이 `center={mapCenter}` 하드코딩이고 색상도
      `#1EB87B` 고정이라 그대로 못 쓴다. 중심 좌표를 받는 prop을 추가하고 250m/500m 이중 원을
      지원한다. 기존 호출부 두 곳(`PostWriteKakaoMap`, `PostDetailKakaoMap`)의 동작은 유지할 것
- [x] `MainKakaoMap`: 장소 마커 클릭 → `?place-id` 설정, 반경 원과 `nearby-post-markers` 렌더.
      장소 선택 상태에서는 기존 게시글 마커(`useGetMarker`)를 계속 숨긴다
- [x] `PlaceDetailSheetContent` 신규 — 동네 정보 / 근처 분실물 탭 컨테이너
- [x] 동네 정보 탭: 클릭한 장소 **하나가 아니라 반경 안의 같은 카테고리 장소 목록**을 보여준다.
      전용 엔드포인트가 없으므로(장소에는 `nearby-posts`에 대응하는 `nearby-places`가 없음)
      `search-location`을 클릭한 장소 좌표를 중심으로 재호출하고 500m 넘는 항목은 클라에서 잘라낸다.
      목록 UI는 `NeighborhoodPlaceList`/`NeighborhoodPlaceCard` 재사용.
      **한계**: `search-location`은 최대 10개라 반경 안에 그보다 많으면 누락된다. 어색하면 백엔드에
      `nearby-places` 신설을 요청한다 (좌표만 바꿔 넘기는 구조라 교체 비용은 작다)
- [x] 근처 분실물 탭: 필터 칩(모두보기/분실물/발견물/카테고리) + `NearbyPostSummary` 목록.
      칩 상태는 헤더 칩과 공유하는 `?post-type`/`?category`가 아니라 **탭 로컬 상태**로 둔다.
      공유하면 시트를 닫은 뒤에도 헤더 칩 선택이 남는다. 목록 행은 `PostListItem` 재사용 검토 —
      `NearbyPostSummary`는 `postId`·`title`·`summary`·`thumbnailImageUrl`·`address`·`postStatus`
      ·`postType`·`category`·`favoriteCount`로 `PostItem`과 필드가 달라 매핑이 필요하다
- [ ] 즐겨찾기 하트: `POST`/`DELETE /places/{placeId}/favorites`(로그인 필수) 연동.
      `NeighborhoodPlaceCard`는 지금 서버의 `isFavorite`를 초기값으로 받아 `useState`로만 토글하므로
      새로고침하면 되돌아간다. `useMutation` + `onMutate` 낙관적 업데이트로 교체할 것
- [x] i18n: 새 네임스페이스(`PlaceDetailSheet`) 키를 `ko.json`/`en.json`에 동시 추가하고
      `npm run lint:i18n-literal`, `npm run check:i18n-keys` 통과 확인
- [x] **`NeighborhoodPlace` 타입을 API `PlaceSummary`에 맞춰 재정의**: 운영 상태가 API에선
      `operationStatus` enum `OPEN | BREAK_TIME | UPCOMING | CLOSED` 4가지 (지금 우리
      `NeighborhoodPlaceStatus`는 `status: OPEN | UPCOMING` 2가지). 반영 범위 —
      `_types/NeighborhoodPlace.ts`(필드명 `status`→`operationStatus`, 값 4개, `distanceM`→
      `stationDistanceMeters`, `PlaceSummary`의 `placeId`/`todayBusinessHours`/`operationPeriod`/
      `isFavorite` 추가 검토), `PlaceStatusBadge`의 `STATUS_STYLE`·라벨 분기를 4-way로,
      `PlaceStatusBadge` i18n 키(`statusOpen`/`statusUpcoming` + `BREAK_TIME`/`CLOSED` 키 ko/en
      동시 추가), 목업 데이터. 디자인(뱃지 색/문구) TBD

### 실 API 연동

- [x] `useNeighborhoodPlaces`를 `GET /places`로 교체하고 `neighborhoodPlaces.mock.ts` 제거
- [x] `usePostTypeFeed`(`homeFeedPosts.mock.ts`) 제거 — 피드 시트를 `useSearchLocation`
      (`/main/posts/search-location`)으로 교체했다. 검색 시트(`PostSheetContent`)가 쓰던 훅과 같아
      새로 만들 API 코드가 없었다. 이로써 `(home)` 라우트의 목업은 모두 사라졌다

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
- **`TimeRange`**: `type`(`BUSINESS|BREAK_TIME`), `startTime`, `endTime`(문서는 `HH:mm`이지만 dev
  실제 응답은 `HH:mm:ss`). 자정 넘김은 `endTime <
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
- 반경 원: 바깥 500m는 Swagger의 `nearby-posts`/`nearby-post-markers` 설명문("장소 반경 500m")
  기준이고, 안쪽 250m는 데이터와 무관한 장식이다.
