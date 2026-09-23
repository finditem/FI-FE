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

| 파일                                                                                                     | 내용                                                                     |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `src/api/fetch/kakao/api/getKakaoLocalAddress.ts`                                                        | 주소를 좌표로                                                            |
| `src/api/fetch/kakao/api/getKakaoLocalCoord2Address.ts`                                                  | 좌표를 주소로                                                            |
| `src/api/fetch/kakao/types/`                                                                             | 응답 타입 두 개                                                          |
| `src/store/useMainKakaoMapStore/getAddressFromLatLng.ts`                                                 | 위 API를 감싸 표시용 주소 한 줄을 만든다                                 |
| `src/utils/extractDongAddress/`                                                                          | 카카오 응답에서 동 단위를 뽑는다. 네이버 응답 구조가 달라 다시 써야 한다 |
| `src/app/[locale]/(route)/write/post/location/_components/LocationRangeSection/LocationRangeSection.tsx` | `getKakaoLocalAddress` 직접 호출                                         |

### 줌 레벨이 박혀 있는 곳

| 파일                                                        | 값                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `src/constants/DEFAULT_MAP_DATA.ts`                         | `DEFAULT_MAP_LEVEL = 5`                              |
| `src/utils/getMapLevelByRadius/getMapLevelByRadius.ts`      | 반경 1000/3000/5000m를 레벨 6/7/8로                  |
| `src/api/fetch/mapController/api/isMapZoomFetchDisabled.ts` | 레벨 9에서 13 사이면 조회를 끈다                     |
| `src/api/fetch/mapController/api/*.ts`                      | `Math.min(mapLevel, 11)`로 상한을 걸어 서버로 보낸다 |
| `BaseKakaoMap.tsx`                                          | `level = 6`, `minLevel = 13` 기본값                  |
| `MapCameraSync.tsx`                                         | `maxLevel = 6`                                       |

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

| 카카오 `level` | 네이버 `zoom` | 대략 해상도 | 이 프로젝트에서의 의미                                |
| -------------- | ------------- | ----------- | ----------------------------------------------------- |
| 3              | 17            | 1 m/px      | 건물 단위                                             |
| 4              | 16            | 2 m/px      |                                                       |
| 5              | 15            | 4 m/px      | `DEFAULT_MAP_LEVEL`. 성수동 일대가 한 화면에 들어온다 |
| 6              | 14            | 8 m/px      | 반경 1000m, `BaseKakaoMap`과 `MapCameraSync` 기본값   |
| 7              | 13            | 16 m/px     | 반경 3000m                                            |
| 8              | 12            | 32 m/px     | 반경 5000m                                            |
| 9              | 11            | 64 m/px     | 마커 조회를 끄기 시작하는 지점                        |
| 11             | 9             | 256 m/px    | 서버로 보내는 레벨 상한                               |
| 13             | 7             | 1024 m/px   | `minLevel`, 즉 최대 축소 한계                         |

네이버 국내 서비스의 최소 `zoom`은 6이고 이는 카카오 레벨 14에 해당한다. 현재 쓰는 범위(레벨 3에서 13, 즉 `zoom` 7에서 17)는 모두 네이버 지원 범위 안에 들어온다.

**최소와 최대가 뒤바뀐다는 점을 놓치기 쉽다.** 카카오의 `minLevel = 13`(가장 축소된 한계)은 네이버의 `minZoom = 7`이 된다. `min`이 `min`으로 대응하지만 의미가 축소 한계에서 축소 한계로 유지되는지 확인해야 한다. 카카오 `minLevel`은 축소 한계이고 네이버 `minZoom`도 축소 한계이므로 이름은 맞아떨어지지만, 값은 `20 - level`로 반드시 변환한다.

### 서버 계약 문제

이것이 마이그레이션의 최대 리스크다. 백엔드 API가 카카오 레벨을 그대로 받는다.

```
/main/posts/marker?latitude=..&longitude=..&level=..
/main/posts/recent-found?latitude=..&longitude=..&level=..
/main/places/search-location?latitude=..&longitude=..&level=..&type=..
```

`useGetMarker`, `useRecentFound`, `useSearchLocation`, `useSearchLocationPlaces`, `useMapPostSummary`가 모두 `Math.min(mapLevel, 11)`로 상한을 걸어 보낸다. 서버는 이 값으로 조회 반경을 결정한다.

프론트가 네이버 `zoom`으로 바뀌면 선택지는 둘이다.

1. **프론트에서 역변환해 보낸다.** 서버로 보내기 직전에 `level = 20 - zoom`으로 되돌린다. 백엔드 변경이 없어 가장 빠르고, 마이그레이션을 프론트에서 끝낼 수 있다. 대신 네이버로 옮긴 뒤에도 카카오 레벨 체계가 경계면에 남는다.
2. **서버 파라미터를 반경(m)으로 바꾼다.** 지도 SDK와 무관한 값이라 근본적으로 옳지만 백엔드 작업과 배포 순서 조정이 필요하다.

**어느 쪽이든 백엔드와 먼저 합의해야 한다.** 합의 없이 프론트만 바꾸면 조회 반경이 조용히 달라져서, 오류 없이 결과 개수만 어긋나는 형태로 드러난다. 가장 찾기 어려운 종류의 버그다.

권장하는 순서는 1번으로 마이그레이션을 끝내고 변환 함수 한 곳(`src/utils/`)에 격리한 다음, 별도 작업으로 2번을 진행하는 것이다.

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

`MapCameraSync`가 `useEffect` cleanup에서 리스너를 해제하고 있으므로, 핸들을 보관하도록 고쳐야 한다. 그냥 옮기면 지도를 이동할 때마다 리스너가 쌓인다.

### 지오코딩

| 카카오                                                               | 네이버                                                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `GET https://dapi.kakao.com/v2/local/search/address.json`            | `naver.maps.Service.geocode` 또는 `GET .../map-geocode/v2/geocode`          |
| `GET https://dapi.kakao.com/v2/local/geo/coord2address.json`         | `naver.maps.Service.reverseGeocode` 또는 `GET .../map-reversegeocode/v2/gc` |
| `Authorization: KakaoAK {REST API 키}` 헤더, 브라우저 직접 호출 가능 | Key ID와 Key 헤더, 브라우저 직접 호출 불가                                  |
| `documents[].address.address_name`에 완성된 주소 문자열              | `region.area1~area4.name`을 직접 조립                                       |

**카카오 REST 키는 브라우저에 노출해도 되는 구조였지만 네이버는 아니다.** 현재 `getKakaoLocalCoord2Address`가 `NEXT_PUBLIC_KAKAO_REST_API_KEY`로 클라이언트에서 직접 호출하는데, 같은 모양으로 네이버 키를 넣으면 Secret이 클라이언트 번들에 박힌다. 클라이언트에서 필요한 역지오코딩은 JS SDK의 `naver.maps.Service.reverseGeocode`로 옮기는 것이 가장 간단하다. 자세한 판단 기준은 [rest-api.md](./rest-api.md#호출-경로-선택)에 있다.

`extractDongAddress`는 카카오 응답에서 동 이름을 뽑는 유틸이므로 네이버 응답 기준으로 다시 작성한다. 네이버는 `region.area3.name`이 읍면동이라 오히려 파싱이 단순해진다.

## 네이밍

`BaseKakaoMap`, `MainKakaoMap`, `PostWriteKakaoMap`, `PostDetailKakaoMap`, `PostDetailPreviewKakaoMap`, `useMainKakaoMapStore`, `useMainKakaoMap`. 이름에 벤더가 들어가 있어 전부 바뀐다.

`BaseMap`, `MainMap`처럼 벤더를 빼는 쪽이 다음 마이그레이션 때 유리하다. 이름 변경만 따로 커밋하면 리뷰가 쉬워진다. 커밋 타입으로 `rename`을 쓴다.

```
rename(map): 지도 컴포넌트 이름에서 벤더 표기 제거
```

## 체크리스트

작업을 시작할 때 이 목록을 해당 라우트의 `_docs/plan.md`로 옮겨 쓴다. 여러 라우트와 전역 공통 코드에 걸쳐 있어 `plan-route` 스킬 대상은 아니다.

### 준비

- [ ] NCP 콘솔에 Application 등록, Web Dynamic Map과 Geocoding, Reverse Geocoding API 활성화
- [ ] Web 서비스 URL에 `http://localhost:3000`과 배포 도메인 등록
- [ ] `NEXT_PUBLIC_NAVER_MAP_KEY_ID`, `NAVER_MAP_KEY` 환경 변수 추가 (후자에 `NEXT_PUBLIC_` 금지)
- [ ] 백엔드와 `level` 파라미터 처리 방식 합의
- [ ] `react-naver-maps` 설치, `react-kakao-maps-sdk` 제거

### 공통 코드

- [ ] `BaseKakaoMap`을 네이버 기반으로 교체하고 `BaseMap`으로 이름 변경
- [ ] `CustomOverlayMap`으로 그리던 장소 마커와 사용자 위치 마커를 네이버 오버레이로 이전
- [ ] `MapCameraSync`의 이벤트 해제를 핸들 방식으로 수정
- [ ] `zoom`과 `level` 변환 함수를 `src/utils/`에 추가
- [ ] `getMapLevelByRadius`를 `zoom` 반환으로 수정 또는 `getMapZoomByRadius`로 교체
- [ ] `DEFAULT_MAP_LEVEL`을 `DEFAULT_MAP_ZOOM = 15`로 교체
- [ ] `isMapZoomFetchDisabled`의 경계값을 `zoom` 기준으로 수정
- [ ] `src/api/fetch/kakao/`를 `src/api/fetch/naver/`로 교체하거나 SDK 호출로 대체
- [ ] `getAddressFromLatLng`와 `extractDongAddress`를 네이버 응답 구조로 수정
- [ ] `public/kakao-map/` 에셋 폴더 이름 변경, `user-location.svg` 정렬 보정 재계산

### 라우트

- [ ] `(home)` — `MainKakaoMap`, `useMainKakaoMap`, `useMainKakaoMapStore`
- [ ] `write/post/location` — `PostWriteKakaoMap`, `LocationRangeSection`
- [ ] `list/[id]` — `PostDetailPreviewKakaoMap`
- [ ] `list/[id]/map` — `PostDetailKakaoMap`

### 검증

- [ ] `react-kakao-maps-sdk`를 모킹하는 테스트를 네이버 기준으로 수정
- [ ] `BaseMap`, `MapState` 스토리 갱신
- [ ] `npm run test`와 `npm run build` 통과
- [ ] 지도 플로우가 e2e로 커버되므로 `npm run check:fast` 실행
- [ ] 지도 위 바텀시트가 네이버 로고와 저작권 표기를 덮지 않는지 확인
- [ ] 클라이언트 번들에 `NAVER_MAP_KEY`가 포함되지 않았는지 확인 (`.next` 빌드 산출물에서 키 값을 grep)
