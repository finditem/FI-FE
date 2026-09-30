# 카카오 지도에서 네이버 지도로 마이그레이션

이 문서는 마이그레이션 작업이 끝나면 삭제한다. API 사용법 자체는 [web-dynamic-map.md](./web-dynamic-map.md)와 [rest-api.md](./rest-api.md)에 있다.

## 카카오 로그인은 건드리지 않는다

이 레포에서 카카오는 지도와 소셜 로그인 두 곳에 쓰인다. 마이그레이션 대상은 지도뿐이다.

| 환경 변수                          | 용도               | 처리     |
| ---------------------------------- | ------------------ | -------- |
| `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` | 지도 SDK           | 제거     |
| `NEXT_PUBLIC_KAKAO_REST_API_KEY`   | 로컬 API(지오코딩) | 제거     |
| `NEXT_PUBLIC_KAKAO_REDIRECT_URI`   | 카카오 로그인      | **유지** |

`src/app/[locale]/(route)/auth/kakao/callback/`은 로그인 콜백이므로 그대로 둔다.

## 작업 표면적

`react-kakao-maps-sdk`를 직접 import하는 프로덕션 파일은 두 개뿐이다. SDK 의존이 `BaseKakaoMap`에 잘 갇혀 있어서 생각보다 범위가 좁다.

### 지도 SDK를 직접 쓰는 파일

| 파일                                                                           | 내용                                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `src/components/domain/BaseKakaoMap/BaseKakaoMap.tsx`                          | `Map`, `MapMarker`, `Circle`, `CustomOverlayMap`, `useKakaoLoader` |
| `src/components/domain/BaseKakaoMap/_internal/MapCameraSync/MapCameraSync.tsx` | `useMap`, 전역 `kakao.maps.LatLng`, `kakao.maps.event`             |

### 프리셋 래퍼 (props만 바뀐다)

| 파일                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------ |
| `src/app/[locale]/(home)/_components/MainKakaoMap/MainKakaoMap.tsx`                                                |
| `src/app/[locale]/(route)/write/post/location/_components/_internal/PostWriteKakaoMap/PostWriteKakaoMap.tsx`       |
| `src/app/[locale]/(route)/list/[id]/map/_components/PostDetailKakaoMap/PostDetailKakaoMap.tsx`                     |
| `src/app/[locale]/(route)/list/[id]/_components/_internal/PostDetailPreviewKakaoMap/PostDetailPreviewKakaoMap.tsx` |

### 지오코딩

| 파일                                                                                                     | 내용                                                                        |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/api/fetch/kakao/api/getKakaoLocalAddress.ts`                                                        | 주소를 좌표로. 현재 호출하는 곳이 없으므로 옮기지 않고 삭제한다             |
| `src/api/fetch/kakao/api/getKakaoLocalCoord2Address.ts`                                                  | 좌표를 주소로                                                               |
| `src/api/fetch/kakao/types/`                                                                             | 응답 타입 두 개                                                             |
| `src/store/useMainKakaoMapStore/getAddressFromLatLng.ts`                                                 | 위 API를 감싸 표시용 주소 한 줄을 만든다                                    |
| `src/utils/extractDongAddress/`                                                                          | 카카오 응답에서 동 단위를 뽑는다. 네이버 응답 구조가 달라 다시 써야 한다    |
| `src/app/[locale]/(route)/write/post/location/_components/LocationRangeSection/LocationRangeSection.tsx` | `getKakaoLocalCoord2Address` 직접 호출. 저장할 전체 주소와 동 이름을 만든다 |

### 줌 레벨이 박혀 있는 곳

| 파일                                                        | 값                                                                                              |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/constants/DEFAULT_MAP_DATA.ts`                         | `DEFAULT_MAP_LEVEL = 5`                                                                         |
| `src/utils/getMapLevelByRadius/getMapLevelByRadius.ts`      | 반경 1000/3000/5000m를 레벨 6/7/8로                                                             |
| `src/api/fetch/mapController/api/isMapZoomFetchDisabled.ts` | 레벨 9에서 13 사이면 조회를 끈다                                                                |
| `src/api/fetch/mapController/api/*.ts`                      | `Math.min(mapLevel, 11)`로 상한을 걸어 서버로 보낸다. 서버가 실제로 처리하는 범위는 1에서 8이다 |
| `BaseKakaoMap.tsx`                                          | `level = 6`, `minLevel = 13` 기본값                                                             |
| `MapCameraSync.tsx`                                         | `maxLevel = 6`                                                                                  |

### 에셋

`public/kakao-map/marker.svg`, `public/kakao-map/user-location.svg`. 폴더 이름만 바꾸면 된다. 다만 `user-location.svg`는 `BaseKakaoMap`이 48x48 viewBox와 점 중심 좌표 `(23.625, 16.625)`를 하드코딩해 정렬을 보정하고 있다. 네이버 마커의 `anchor` 개념으로 옮길 때 이 보정 로직을 다시 계산해야 한다.

### 패키지

`react-kakao-maps-sdk`를 제거하고 `react-naver-maps`를 추가한다.

## 줌 레벨 변환

가장 위험한 부분이다. 카카오 `level`은 작을수록 확대되고 네이버 `zoom`은 클수록 확대된다. 부호가 반대라서 값을 그대로 옮기면 지도가 엉뚱한 배율로 뜬다.

### 변환 공식

`DEFAULT_MAP_DATA.ts`의 주석에 카카오 레벨 5가 4 m/px이라고 기록되어 있다. 여기서 카카오 레벨의 해상도는 `2^(level - 3)` m/px이다.

네이버는 웹 메르카토르를 쓰므로 해상도가 `156543.03 * cos(위도) / 2^zoom` m/px이다. 성수동(위도 37.54)에서 `cos(37.54) = 0.793`이므로 약 `124124 / 2^zoom`이다.

두 해상도를 같게 두면 다음과 같다.

```
2^(level - 3) = 124124 / 2^zoom
level - 3 + zoom = log2(124124) = 16.92
zoom = 19.92 - level
```

따라서 **`zoom = 20 - level`** 로 근사한다. 이 값은 성수동 위도에서 유도한 것이고, 위도가 크게 다른 지역에서는 어긋난다. 서비스 지역이 성수동 일대로 한정되어 있으므로 실용상 문제없다.

이 공식은 위 계산으로 유도한 값이며 네이버 공식 문서에 명시된 대응표가 아니다. 실제 적용 후 화면을 눈으로 비교해 검증한다.

### 대응표

| 카카오 `level` | 네이버 `zoom` | 대략 해상도 | 이 프로젝트에서의 의미                                   |
| -------------- | ------------- | ----------- | -------------------------------------------------------- |
| 3              | 17            | 1 m/px      | 건물 단위                                                |
| 4              | 16            | 2 m/px      |                                                          |
| 5              | 15            | 4 m/px      | `DEFAULT_MAP_LEVEL`. 성수동 일대가 한 화면에 들어온다    |
| 6              | 14            | 8 m/px      | 반경 1000m, `BaseKakaoMap`과 `MapCameraSync` 기본값      |
| 7              | 13            | 16 m/px     | 반경 3000m                                               |
| 8              | 12            | 32 m/px     | 반경 5000m. 서버가 처리하는 레벨 상한                    |
| 9              | 11            | 64 m/px     | 마커 조회를 끄기 시작하는 지점                           |
| 11             | 9             | 256 m/px    | 현재 프론트 코드의 상한. 서버는 9 이상을 처리하지 못한다 |
| 13             | 7             | 1024 m/px   | `minLevel`, 즉 최대 축소 한계                            |

네이버 국내 서비스의 최소 `zoom`은 6이고 이는 카카오 레벨 14에 해당한다. 현재 쓰는 범위(레벨 3에서 13, 즉 `zoom` 7에서 17)는 모두 네이버 지원 범위 안에 들어온다.

**최소와 최대가 뒤바뀐다는 점을 놓치기 쉽다.** 카카오의 `minLevel = 13`(가장 축소된 한계)은 네이버의 `minZoom = 7`이 된다. `min`이 `min`으로 대응하지만 의미가 축소 한계에서 축소 한계로 유지되는지 확인해야 한다. 카카오 `minLevel`은 축소 한계이고 네이버 `minZoom`도 축소 한계이므로 이름은 맞아떨어지지만, 값은 `20 - level`로 반드시 변환한다.

### 변환 시 반드시 clamp 한다

네이버 `zoom`은 21까지 올라간다. `level = 20 - zoom`을 그대로 쓰면 `zoom` 20에서 `level`이 0, 21에서 -1이 된다. 서버로 보내는 값에 하한을 걸지 않으면 두 가지가 조용히 깨진다.

- `useSearchLocation`의 `enabled: isValidCoordinates && level > 0` 조건이 false가 되어 게시글 조회가 멈춘다. 오류는 나지 않고 결과만 비어 있다.
- `Math.min(mapLevel, 11)`은 상한만 거는 코드이므로 음수를 그대로 통과시켜 서버에 `level=-1`을 보낸다.

상한은 11이 아니라 8로 건다. 이유는 아래 서버 계약 항목에 있다.

```ts
const level = Math.max(1, Math.min(20 - zoom, 8));
```

또한 `minZoom`과 `maxZoom`을 반드시 명시한다. `minZoom`을 지정하지 않으면 네이버 국내 최소값인 6까지 축소되고, 이때 `level`이 14가 되어 `isMapZoomFetchDisabled`의 범위(9에서 13)를 벗어난다. 지금은 `minLevel = 13` 덕분에 최대 축소 상태에서 마커 조회가 항상 꺼지지만, 마이그레이션 후에는 최대 축소에서 조회가 되살아나 전국 단위 질의가 나간다. `minZoom = 7`, `maxZoom = 19`로 현재 범위(레벨 1에서 13)를 유지한다.

카카오 래퍼의 prop 이름은 동작과 반대로 읽힌다. `react-kakao-maps-sdk`는 `minLevel` prop을 카카오의 `setMaxLevel`(축소 한계)로, `maxLevel` prop을 `setMinLevel`(확대 한계)로 넘긴다. 따라서 `BaseKakaoMap`의 `minLevel = 13`은 "레벨 13보다 더 축소할 수 없다"는 뜻이고 네이버 `minZoom = 7`에 대응한다. 확대 한계는 걸려 있지 않아 카카오 최대 확대인 레벨 1(`zoom` 19)까지 확대되므로 `maxZoom`은 19로 둔다.

### 서버 계약

백엔드 API가 카카오 레벨을 그대로 받는다. `level`을 받는 엔드포인트는 다섯 개다.

| 엔드포인트                         | 훅                        | 보내는 값                |
| ---------------------------------- | ------------------------- | ------------------------ |
| `GET /main/posts/marker`           | `useGetMarker`            | `Math.min(mapLevel, 11)` |
| `GET /main/posts/recent-found`     | `useRecentFound`          | `Math.min(mapLevel, 11)` |
| `GET /main/posts/search-location`  | `useSearchLocation`       | `Math.min(mapLevel, 11)` |
| `GET /main/posts/{postId}/summary` | `useMapPostSummary`       | `Math.min(mapLevel, 11)` |
| `GET /main/places/search-location` | `useSearchLocationPlaces` | `Math.min(mapLevel, 8)`  |

백엔드 코드(`FI-BE`의 `origin/develop`)를 확인한 결과는 다음과 같다.

- 서버는 `level`을 `MapLevel` enum(`domain/map/enums/MapLevel.java`)의 키로만 쓴다. 레벨마다 조회 사각형의 가로·세로 반폭(m)이 고정되어 있고, 카카오 픽셀 해상도와는 관계가 없다.
- `MapLevel`에는 `LEVEL_1`부터 `LEVEL_8`까지만 있다. 게시글 쪽 DTO 네 개(`PostMarkerRequest`, `RecentFoundPostRequest`, `MapPostRequest`, `LocationMapPostRequest`)는 `@Max(11)`로 검증하지만, 9에서 11은 `MapLevel.from`에서 `_MAP_LEVEL_INVALID` 예외가 난다. 장소 쪽 `PlaceMapSearchRequest`는 `@Max(8)`이라 enum과 맞다.
- 지금은 `isMapZoomFetchDisabled`가 레벨 9 이상에서 조회를 꺼서 이 불일치가 드러나지 않는다. 프론트의 `Math.min(mapLevel, 11)`은 Swagger의 `(1~11)` 설명을 따른 것으로 보이지만 실제로 의미 있는 상한은 8이다.

`placeId`를 받는 엔드포인트는 `level`을 쓰지 않으므로 영향이 없다. 서버가 반경을 고정해 두고 있다.

- `GET /main/places/{placeId}/nearby-post-markers`
- `GET /main/places/{placeId}/nearby-posts`
- `GET /main/places/{placeId}/summary`

**결정: 프론트에서 역변환해 보낸다.** 서버로 보내기 직전에 `level = clamp(20 - zoom, 1, 8)`로 되돌린다. 서버가 받는 값은 지금과 같으므로 백엔드 변경 없이 마이그레이션을 끝낼 수 있다. 변환은 `src/utils/`의 함수 한 곳에 격리한다. 파라미터를 반경(m)으로 바꾸는 것이 근본적으로 옳지만 백엔드 작업이 필요하므로 마이그레이션 이후 별도로 논의한다.

DTO의 `@Max(11)`과 `MapLevel`의 불일치는 마이그레이션과 관계없는 백엔드 버그이므로, 마이그레이션을 마친 뒤 백엔드에 알린다.

### 저장되는 주소 문자열

게시글 작성 시 프론트가 카카오로 역지오코딩한 주소를 서버에 보낸다. `LocationRangeSection`은 값 두 개를 만든다.

| 값            | 카카오 출처                                  | 쓰이는 곳                                                                  |
| ------------- | -------------------------------------------- | -------------------------------------------------------------------------- |
| `address`     | `region_3depth_name \|\| region_2depth_name` | 위치 선택 화면 제목("성수동2가 근처")에만 쓴다. 서버로 가지 않는다         |
| `fullAddress` | `(road_address \|\| address).address_name`   | `usePostWriteSubmit`에서 서버의 `address`로 저장된다. 목록과 상세에 보인다 |

서버에 저장되는 것은 동 이름이 아니라 전체 주소(`fullAddress`)다. `address` 필드는 `PostItemType`, `PostDetailType`, `SimilarType`, `MypagePostListType`에 모두 있으므로, 표기가 달라지면 목록 화면에서 카카오 시절 게시글과 새 게시글의 주소가 다른 모양으로 나란히 보인다.

백엔드 코드로 확인한 사실은 다음과 같다.

- `GET /main/posts/search-location`은 `keyword`가 있으면 반경 조건과 OR로 `post.address.containsIgnoreCase(keyword)`를 건다(`PostMapCustomImpl.searchMapPostsByLocation`). 저장된 주소 문자열이 검색 대상이다. 다른 엔드포인트의 `keyword`는 제목과 본문만 매칭한다.
- 백엔드에서 카카오를 쓰는 곳은 OAuth 로그인뿐이다. 장소(`Place`)의 `address`, 좌표, `station`은 관리자가 `AdminPlaceController`로 등록할 때 직접 입력한 값이므로 이번 마이그레이션과 관계없다.

**결정: 새 게시글의 전체 주소를 카카오 출력과 같은 모양으로 조립한다.** 기존 데이터는 변환하지 않고 백엔드 변경도 없다. 조립 규칙(도로명 우선, 지번일 때 시도를 `서울`로 줄임)과 표본 비교 결과는 [rest-api.md](./rest-api.md#게시글-주소-조립-규칙)에 있다.

### 영향이 없는 것

- 좌표계. 카카오와 네이버 모두 WGS84(`EPSG:4326`)를 쓴다. `latitude`와 `longitude`를 그대로 주고받으면 된다.
- `radius: Radius`(1000, 3000, 5000). 미터 단위 실수치이므로 지도 SDK와 무관하다. `getMapLevelByRadius`는 표시용 줌을 고르는 데만 쓰이고 서버로 가지 않는다.

## API 대응표

### 컴포넌트와 훅

| `react-kakao-maps-sdk`                  | 네이버                                                                    | 비고                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `useKakaoLoader({ appkey, libraries })` | `NavermapsProvider ncpKeyId` 또는 스크립트 직접 로딩                      | 카카오의 `libraries: ["services"]`는 네이버의 `submodules=geocoder`에 해당 |
| `Map`                                   | `NaverMap` 또는 `naver.maps.Map`                                          |                                                                            |
| `useMap()`                              | `react-naver-maps`의 map 인스턴스 접근                                    | `MapCameraSync`가 이걸 쓴다                                                |
| `MapMarker`                             | `Marker` / `naver.maps.Marker`                                            |                                                                            |
| `Circle`                                | `Circle` / `naver.maps.Circle`                                            | 옵션이 거의 같다                                                           |
| `CustomOverlayMap`                      | `naver.maps.Marker`의 `icon.content`(HTML 문자열) 또는 `OverlayView` 상속 | React 엘리먼트를 직접 못 넣는다. 가장 손이 많이 가는 부분                  |

### 속성

| 카카오                   | 네이버                         | 비고                           |
| ------------------------ | ------------------------------ | ------------------------------ |
| `level`                  | `zoom`                         | 방향 반대. `zoom = 20 - level` |
| `minLevel` / `maxLevel`  | `minZoom` / `maxZoom`          | 값 변환 필요                   |
| `draggable` (기본 false) | `draggable` (기본 true)        | 기본값이 반대다                |
| `isPanto: true`          | `map.panTo(coord)`             | 옵션이 아니라 메서드다         |
| `onZoomChanged`          | `zoom_changed` 이벤트          |                                |
| `onDragEnd`              | `dragend` 이벤트               |                                |
| `image.size`             | `icon.size`, `icon.scaledSize` |                                |
| `image.options.offset`   | `icon.anchor`                  | 기준점 계산 방식이 다르다      |

### 좌표 객체

| 카카오                            | 네이버                            |
| --------------------------------- | --------------------------------- |
| `new kakao.maps.LatLng(lat, lng)` | `new naver.maps.LatLng(lat, lng)` |
| `latlng.getLat()` / `getLng()`    | `latlng.lat()` / `lng()`          |

### 이벤트 해제

카카오는 등록할 때와 같은 인자를 넘겨 해제하지만, 네이버는 `addListener`가 반환한 핸들을 넘긴다.

```ts
// 카카오
kakao.maps.event.addListener(map, "idle", handleIdle);
kakao.maps.event.removeListener(map, "idle", handleIdle);

// 네이버
const listener = naver.maps.Event.addListener(map, "idle", handleIdle);
naver.maps.Event.removeListener(listener);
```

`MapCameraSync`는 이 방식으로 리스너를 해제하지만, 확인해 보니 사용하는 곳이 없는 코드다. 네이버로 옮기지 않고 7번 PR에서 삭제한다. 앞으로 네이버 지도에서 이벤트를 직접 등록할 때는 반환된 핸들로 해제해야 한다. 등록할 때와 같은 인자로 해제하는 카카오 방식을 그대로 옮기면 지도를 이동할 때마다 리스너가 쌓인다.

### 지오코딩

| 카카오                                                               | 네이버                                                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `GET https://dapi.kakao.com/v2/local/search/address.json`            | `naver.maps.Service.geocode` 또는 `GET .../map-geocode/v2/geocode`          |
| `GET https://dapi.kakao.com/v2/local/geo/coord2address.json`         | `naver.maps.Service.reverseGeocode` 또는 `GET .../map-reversegeocode/v2/gc` |
| `Authorization: KakaoAK {REST API 키}` 헤더, 브라우저 직접 호출 가능 | Key ID와 Key 헤더, 브라우저 직접 호출 불가                                  |
| `documents[].address.address_name`에 완성된 주소 문자열              | `region.area1~area4.name`을 직접 조립                                       |

**카카오 REST 키는 브라우저에 노출해도 되는 구조였지만 네이버는 아니다.** 현재 `getKakaoLocalCoord2Address`가 `NEXT_PUBLIC_KAKAO_REST_API_KEY`로 클라이언트에서 직접 호출하는데, 같은 모양으로 네이버 키를 넣으면 Secret이 클라이언트 번들에 박힌다. 클라이언트에서 필요한 역지오코딩은 JS SDK의 `naver.maps.Service.reverseGeocode`로 옮기는 것이 가장 간단하다. 자세한 판단 기준은 [rest-api.md](./rest-api.md#호출-경로-선택)에 있다.

`extractDongAddress`는 주소 문자열에서 `동`으로 끝나는 토큰을 뽑는 유틸이다. 네이버에서는 `legalcode` 결과의 `region.area3.name`을 바로 쓰면 되므로, 홈 화면을 옮길 때 이 유틸이 여전히 필요한지 판단한다.

## 네이밍

이름에 벤더가 들어간 컴포넌트, 훅, 스토어는 전부 `Kakao`를 `Naver`로 바꾼다. 이름만 보고 어느 SDK에 묶인 코드인지 알 수 있고, 지금까지 `Kakao`를 붙여 온 관례와도 맞는다.

| 현재                        | 변경 후                     | 변경하는 PR                           |
| --------------------------- | --------------------------- | ------------------------------------- |
| `BaseKakaoMap`              | `BaseNaverMap`(신규)        | 1에서 추가, 7에서 `BaseKakaoMap` 삭제 |
| `PostDetailPreviewKakaoMap` | `PostDetailPreviewNaverMap` | 2                                     |
| `PostDetailKakaoMap`        | `PostDetailNaverMap`        | 3                                     |
| `PostWriteKakaoMap`         | `PostWriteNaverMap`         | 4                                     |
| `MainKakaoMap`              | `MainNaverMap`              | 6                                     |
| `useMainKakaoMap`           | `useMainNaverMap`           | 6                                     |
| `useMainKakaoMapStore`      | `useMainNaverMapStore`      | 6                                     |

이름은 그 화면을 네이버로 옮기는 PR에서 바꾼다. 이름 변경만 먼저 머지하면 `Naver`라는 이름 안에 카카오 코드가 들어 있는 상태가 `develop`에 남기 때문이다. 각 PR 안에서 첫 커밋은 이름 변경만 담고(`rename(map)`), 실제 전환은 다음 커밋부터 한다.

카카오 로그인(`auth/kakao/`, `useApiKakaoLogin`, `usePatchKakaoTerms`)과 카카오 공유(`shareWithKakao`)는 지도와 무관하므로 이름을 바꾸지 않는다.

## 작업 순서

`develop`은 자동으로 릴리즈 PR이 되므로 어느 PR을 머지해도 서비스가 정상 동작해야 한다. 그래서 `BaseNaverMap`을 `BaseKakaoMap` 옆에 새로 만들고, 화면을 하나씩 옮긴다. 전환 기간에는 두 지도가 함께 존재하고 두 SDK가 모두 번들에 들어가며, 화면마다 지도 모양이 다르다. 위험이 낮은 화면부터 옮겨 앞 PR에서 얻은 교훈을 뒤 PR에 반영한다.

| #   | 브랜치                          | 내용                                                            |
| --- | ------------------------------- | --------------------------------------------------------------- |
| 0   | `docs/naver-map-findings`       | 사전 조사 결과 문서 반영                                        |
| 1   | `feat/naver-map-base`           | `BaseNaverMap`, 줌 변환 유틸 추가. 아직 아무 화면도 쓰지 않는다 |
| 2   | `feat/naver-map-detail-preview` | 게시글 상세 미리보기 지도 전환. 조작 없는 작은 지도라 가장 쉽다 |
| 3   | `feat/naver-map-detail`         | 게시글 상세 지도 전환. 반경 원과 마커                           |
| 4   | `feat/naver-map-write-location` | 게시글 위치 선택 지도와 주소 변환 전환                          |
| 5   | `feat/naver-map-overlay`        | `BaseNaverMap`에 장소 마커와 사용자 위치 마커 추가              |
| 6   | `feat/naver-map-home`           | 홈 지도, 스토어, 현재 위치 주소 변환 전환. 가장 크고 위험하다   |
| 7   | `chore/remove-kakao-map`        | 카카오 지도 코드, 패키지, `level` 기준 상수 제거                |

주소 변환은 따로 PR을 만들지 않는다. 4번과 6번에서는 그 화면에 네이버 SDK가 로드되므로 `naver.maps.Service.reverseGeocode`로 바로 처리한다.

`BaseNaverMap`은 SDK 로딩 실패를 `ErrorBoundary`로 잡고, `ErrorBoundary`는 토스트를 쓴다. 그래서 화면을 옮길 때 그 화면 컴포넌트의 스토리에 `ToastProvider` 데코레이터를 추가해야 한다.

2, 3, 4, 6번은 라우트 하나에 국한된 작업이므로 시작할 때 `plan-route` 스킬로 그 라우트의 `_docs/plan.md`에 체크리스트를 만든다. 아래 체크리스트는 전체 진행 상황을 보는 용도다.

## 체크리스트

### 준비

- [x] NCP 콘솔에 Application 등록, Dynamic Map과 Geocoding, Reverse Geocoding API 선택 (개발용 `finditem-dev`)
- [x] Web 서비스 URL 등록 (`http://localhost`, `http://release.finditem.kr`)
- [x] `.env.local`에 `NEXT_PUBLIC_NAVER_MAP_KEY_ID`, `NAVER_MAP_KEY` 추가 (후자에 `NEXT_PUBLIC_` 금지)
- [x] `level` 파라미터 처리 방식 결정 (프론트에서 역변환, 백엔드 변경 없음)
- [x] `keyword` 검색이 저장된 `address` 문자열을 매칭하는지 확인 (매칭한다)
- [x] 카카오와 네이버의 역지오코딩 결과 비교, 주소 조립 규칙 확정 (도로명 우선)
- [ ] 운영용 Application(`finditem`) 등록, 릴리즈와 운영 환경 변수 설정

### 공통 코드

- [x] `BaseNaverMap` 추가 (`react-naver-maps` 설치, Jest 변환 대상 추가)
- [x] `zoom`을 서버 `level`로 되돌리는 `getServerMapLevel`을 `src/utils/`에 추가 (1에서 8로 clamp)
- [x] `getMapLevelByRadius`에 대응하는 `getMapZoomByRadius` 추가
- [ ] `CustomOverlayMap`으로 그리던 장소 마커와 사용자 위치 마커를 네이버 오버레이로 이전
- [ ] `DEFAULT_MAP_LEVEL`에 대응하는 `DEFAULT_MAP_ZOOM = 15` 추가 (홈에서만 쓰므로 6번에서)
- [ ] `isMapZoomFetchDisabled`의 경계값을 `zoom` 기준으로 수정 (홈에서만 쓰므로 6번에서)
- [ ] `getAddressFromLatLng`를 네이버 응답 구조로 수정, `extractDongAddress` 필요 여부 판단
- [ ] `public/kakao-map/` 에셋 폴더 이름 변경, `user-location.svg` 정렬 보정 재계산

### 라우트

- [ ] `list/[id]` — `PostDetailPreviewKakaoMap`
- [ ] `list/[id]/map` — `PostDetailKakaoMap`
- [ ] `write/post/location` — `PostWriteKakaoMap`, `LocationRangeSection`
- [ ] `(home)` — `MainKakaoMap`, `useMainKakaoMap`, `useMainKakaoMapStore`

### 정리

- [ ] `BaseKakaoMap`, `MapCameraSync`, `src/api/fetch/kakao/`, `DEFAULT_MAP_LEVEL`, `getMapLevelByRadius` 삭제
- [ ] `MapLoadingState`, `MapErrorState`를 `BaseKakaoMap/_internal`에서 `BaseNaverMap/_internal`로 이동
- [ ] `react-kakao-maps-sdk` 제거
- [x] `.env.example`에 네이버 키 두 개 추가
- [ ] `.env.example`에서 카카오 지도 키 두 개 제거 (`NEXT_PUBLIC_KAKAO_REDIRECT_URI`는 유지)
- [ ] 릴리즈 확인 후 배포 환경에서 카카오 지도 키 삭제
- [ ] 백엔드에 DTO `@Max(11)`과 `MapLevel`(1에서 8) 불일치 알리기
- [ ] 이 문서 삭제

### 검증

- [ ] `react-kakao-maps-sdk`를 모킹하는 테스트를 네이버 기준으로 수정
- [ ] `BaseNaverMap`, `MapState` 스토리 갱신
- [ ] `npm run test`와 `npm run build` 통과
- [ ] 지도 플로우가 e2e로 커버되므로 `npm run check:fast` 실행
- [ ] 지도 위 바텀시트가 네이버 로고와 저작권 표기를 덮지 않는지 확인
- [ ] 클라이언트 번들에 `NAVER_MAP_KEY`가 포함되지 않았는지 확인 (`.next` 빌드 산출물에서 키 값을 grep)
