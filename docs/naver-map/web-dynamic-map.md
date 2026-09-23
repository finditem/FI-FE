# Web Dynamic Map API (Maps JavaScript API v3)

공식 레퍼런스는 [navermaps.github.io/maps.js.ncp](https://navermaps.github.io/maps.js.ncp/docs/index.html)이다. 이 문서는 전체 API 지형도와, 우리 프로젝트에서 실제로 쓰는 부분의 사용법을 정리한다.

## 로딩

### 스크립트 직접 로딩

```html
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=KEY_ID&submodules=geocoder"></script>
```

쿼리 파라미터는 다음과 같다.

| 파라미터     | 설명                                                                                   |
| ------------ | -------------------------------------------------------------------------------------- |
| `ncpKeyId`   | 필수. NCP Key ID. 구 `ncpClientId`는 폐기됨                                            |
| `submodules` | 선택. 콤마로 구분해 나열한다. `geocoder`, `drawing`, `visualization`, `panorama`, `gl` |
| `language`   | 선택. `ko`, `en`, `ja`, `zh`                                                           |

서브모듈은 기본 번들에 들어 있지 않으므로 명시하지 않으면 `naver.maps.Service`(지오코딩)나 `naver.maps.visualization.HeatMap` 같은 클래스가 `undefined`가 된다. 필요한 것만 넣는다. 번들 크기가 늘어난다.

### React 래퍼

카카오에서 쓰던 `react-kakao-maps-sdk`에 대응하는 라이브러리는 [`react-naver-maps`](https://www.npmjs.com/package/react-naver-maps)다.

- 2026년 6월 기준 최신 버전은 `0.2.2`이고 React 19를 peer dependency로 요구한다. 이 프로젝트는 React 19를 쓰므로 맞는다.
- 런타임 의존성이 없다.
- 비공식 라이브러리다. 커버하지 못하는 API는 `useNavermaps()`로 `naver.maps` 네임스페이스를 직접 꺼내 쓴다.

```tsx
<NavermapsProvider ncpKeyId={process.env.NEXT_PUBLIC_NAVER_MAP_KEY_ID!}>
  <Container style={{ width: "100%", height: "100%" }}>
    <NaverMap center={center} zoom={15}>
      <Marker position={position} />
    </NaverMap>
  </Container>
</NavermapsProvider>
```

Next.js App Router에서는 `"use client"`가 필요하다. 지도 컴포넌트는 서버 렌더링할 수 없다.

## 좌표계와 줌

### 좌표

`naver.maps.LatLng(lat, lng)`이고 인자 순서는 위도, 경도다. 여러 API가 문자열로는 `"경도,위도"` 순서를 쓰므로 주의한다. 특히 REST Geocoding의 `coordinate`와 Reverse Geocoding의 `coords`는 경도가 먼저다.

기본 좌표계는 `EPSG:4326`(WGS84 경위도)이다. 서버가 주는 `latitude`, `longitude`를 그대로 쓸 수 있다.

### 줌 레벨

**카카오와 방향이 반대다.** 네이버는 `zoom` 값이 클수록 확대된다.

|           | 카카오        | 네이버          |
| --------- | ------------- | --------------- |
| 속성 이름 | `level`       | `zoom`          |
| 범위      | 1에서 14      | 6에서 21 (국내) |
| 방향      | 작을수록 확대 | 클수록 확대     |
| 기본값    | 3 (SDK 기준)  | 11              |

`minZoom`과 `maxZoom`을 지정하지 않으면 지도 유형이 지원하는 범위를 그대로 쓴다. 카카오의 `minLevel`, `maxLevel`과 이름은 비슷하지만 의미가 반대이므로 그대로 옮기면 안 된다. 변환 공식과 대응표는 [migration-from-kakao.md](./migration-from-kakao.md#줌-레벨-변환)에 있다.

## Map

```ts
const map = new naver.maps.Map("mapDiv", {
  center: new naver.maps.LatLng(37.544583, 127.055972),
  zoom: 15,
});
```

첫 인자는 DOM 엘리먼트 또는 그 id다. 컨테이너에는 반드시 `height`가 지정되어 있어야 한다. `min-height`만 있으면 지도가 그려지지 않는다. 카카오와 같은 제약이다.

### 주요 옵션

| 옵션          | 타입      | 기본값                             | 설명                                     |
| ------------- | --------- | ---------------------------------- | ---------------------------------------- |
| `center`      | `Coord`   | 서울시청 `37.5666103, 126.9783882` | 초기 중심 좌표                           |
| `zoom`        | `number`  | `11`                               | 초기 줌 레벨                             |
| `minZoom`     | `number`  | 지도 유형의 최소값                 | 최소 줌                                  |
| `maxZoom`     | `number`  | 지도 유형의 최대값                 | 최대 줌                                  |
| `draggable`   | `boolean` | `true`                             | 패닝 허용. 카카오 기본값과 반대이니 주의 |
| `scrollWheel` | `boolean` | `true`                             | 휠 확대 축소 허용                        |
| `zoomControl` | `boolean` | `false`                            | 줌 컨트롤 표시                           |
| `mapTypeId`   | `string`  | `NORMAL`                           | 지도 유형                                |

### 주요 메서드

| 메서드                                    | 설명                                                              |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `setCenter(coord)` / `getCenter()`        | 중심 좌표를 즉시 변경하거나 읽는다                                |
| `panTo(coord, options?)`                  | 애니메이션으로 중심을 옮긴다. 카카오의 `isPanto: true`에 대응한다 |
| `morph(coord, zoom?)`                     | 중심과 줌을 함께 애니메이션으로 옮긴다                            |
| `setZoom(zoom, useEffect?)` / `getZoom()` | 줌을 변경하거나 읽는다                                            |
| `fitBounds(bounds)`                       | 영역이 화면에 들어오도록 맞춘다                                   |
| `getBounds()`                             | 현재 보이는 영역을 `LatLngBounds`로 반환한다                      |
| `setOptions(options)`                     | 옵션을 나중에 변경한다                                            |

`getCenter()`가 반환하는 값은 `LatLng`이고 `lat()`, `lng()` 메서드로 꺼낸다. 카카오의 `getLat()`, `getLng()`와 이름이 다르다.

### 이벤트

| 이벤트                            | 설명                                     |
| --------------------------------- | ---------------------------------------- |
| `click`, `dblclick`, `rightclick` | 마우스 클릭                              |
| `center_changed`                  | 중심 좌표 변경                           |
| `zoom_changed`                    | 줌 변경                                  |
| `bounds_changed`                  | 보이는 영역 변경                         |
| `dragstart`, `drag`, `dragend`    | 드래그                                   |
| `pinchstart`, `pinch`, `pinchend` | 터치 핀치                                |
| `idle`                            | 이동과 확대 축소가 끝나 지도가 멈춘 상태 |
| `tilesloaded`                     | 타일 로딩 완료                           |

## 이벤트 등록과 해제

`naver.maps.Event`를 쓴다. 카카오의 `kakao.maps.event`와 달리 대문자로 시작한다.

```ts
const listener = naver.maps.Event.addListener(map, "idle", handleIdle);
naver.maps.Event.removeListener(listener);
```

**해제 방식이 카카오와 다르다.** 카카오는 `removeListener(target, type, handler)`로 세 인자를 넘기지만, 네이버의 `addListener`는 `MapEventListener` 핸들을 반환하고 `removeListener`는 그 핸들을 받는다. 배열로 여러 개를 한 번에 넘길 수도 있다.

| 함수                                       | 설명                                      |
| ------------------------------------------ | ----------------------------------------- |
| `addListener(target, eventName, listener)` | 리스너를 등록하고 핸들을 반환한다         |
| `removeListener(listeners)`                | 핸들 또는 핸들 배열로 해제한다            |
| `once(target, eventName, listener)`        | 한 번만 실행되는 리스너를 등록한다        |
| `clearListeners(target, eventName)`        | 대상의 특정 이벤트 리스너를 모두 해제한다 |
| `trigger(target, eventName, eventObject?)` | 이벤트를 강제로 발생시킨다                |

핸들을 버리면 해제할 수 없으므로 `useEffect` cleanup에서 쓸 핸들은 반드시 보관한다. 이 점 때문에 카카오 코드를 기계적으로 옮기면 리스너가 누적되어 메모리 누수가 생긴다.

## 오버레이

### Marker

```ts
new naver.maps.Marker({
  position: new naver.maps.LatLng(lat, lng),
  map,
  icon: {
    url: "/naver-map/marker.svg",
    size: new naver.maps.Size(26, 37),
    scaledSize: new naver.maps.Size(26, 37),
    anchor: new naver.maps.Point(13, 37),
  },
});
```

`icon`은 세 가지 형태를 받는다.

| 형태       | 키                                              | 용도             |
| ---------- | ----------------------------------------------- | ---------------- |
| 이미지     | `url`, `size`, `scaledSize`, `origin`, `anchor` | 일반 이미지 마커 |
| 스프라이트 | 위와 같고 `origin`으로 잘라낸다                 | 스프라이트 시트  |
| HTML       | `content`, `size`, `anchor`                     | 임의의 HTML 마커 |

`anchor`는 아이콘 이미지 안에서 좌표에 붙는 기준점이다. 카카오의 `options.offset`은 중심 기준 보정값이라 의미가 다르다. 카카오 `offset`이 `{ x: 13, y: 20 }`이었다면 네이버에서는 `anchor`를 직접 계산해 넣는다.

HTML 형태의 `content`는 문자열이다. React 엘리먼트를 넣을 수 없으므로, 현재 `CustomOverlayMap`으로 구현한 장소 마커나 사용자 위치 마커처럼 React 컴포넌트를 지도 위에 올려야 하는 경우는 `naver.maps.OverlayView`를 상속한 커스텀 오버레이를 만들거나 `react-naver-maps`의 오버레이 컴포넌트를 쓴다.

### Circle

카카오 `Circle`과 옵션이 거의 같아서 마이그레이션 비용이 가장 낮다.

```ts
new naver.maps.Circle({
  map,
  center: new naver.maps.LatLng(lat, lng),
  radius: 500,
  strokeColor: "#1EB87B",
  strokeWeight: 1,
  fillColor: "#1EB87B",
  fillOpacity: 0.15,
});
```

`radius`의 단위는 미터다. 카카오와 같다.

### 그 밖의 오버레이

| 클래스                     | 용도                                  |
| -------------------------- | ------------------------------------- |
| `naver.maps.InfoWindow`    | 말풍선 정보창                         |
| `naver.maps.Polyline`      | 선                                    |
| `naver.maps.Polygon`       | 다각형                                |
| `naver.maps.Rectangle`     | 사각형                                |
| `naver.maps.Ellipse`       | 타원                                  |
| `naver.maps.GroundOverlay` | 지도 위에 이미지를 좌표에 맞춰 덮는다 |
| `naver.maps.OverlayView`   | 사용자 정의 오버레이의 기반 클래스    |

## 전체 클래스 목록

작업 중 필요한 기능이 이미 있는지 확인할 때 쓰는 목록이다. 상세 스펙은 [공식 레퍼런스](https://navermaps.github.io/maps.js.ncp/docs/index.html)에서 클래스 이름으로 찾는다.

**네임스페이스**: `naver`, `naver.maps`, `naver.maps.drawing`, `naver.maps.visualization`

| 분류                     | 클래스                                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 기본 자료형              | `LatLng`, `LatLngBounds`, `Point`, `PointBounds`, `Size`                                                        |
| KVO                      | `KVO`, `KVOArray`                                                                                               |
| 지도                     | `Map`                                                                                                           |
| 타일                     | `Tile`, `ImageTile`, `CanvasTile`                                                                               |
| 지도 유형                | `ImageMapType`, `CanvasMapType`, `MapTypeRegistry`, `NaverMapTypeOptions`, `NaverStyleMapTypeOptions`           |
| 컨트롤                   | `CustomControl`, `LogoControl`, `MapDataControl`, `MapTypeControl`, `ScaleControl`, `ZoomControl`               |
| 레이어                   | `Layer`, `BicycleLayer`, `CadastralLayer`, `LabelLayer`, `StreetLayer`, `TrafficLayer`                          |
| 데이터 레이어            | `Data`, `Feature`, `Geometry`                                                                                   |
| 오버레이                 | `OverlayView`, `Marker`, `InfoWindow`, `Circle`, `Ellipse`, `Rectangle`, `Polyline`, `Polygon`, `GroundOverlay` |
| 서브모듈 `drawing`       | `drawing.DrawingManager`                                                                                        |
| 서브모듈 `panorama`      | `Panorama`, `AroundControl`, `FlightSpot`                                                                       |
| 서브모듈 `visualization` | `visualization.HeatMap`, `visualization.DotMap`, `visualization.WeightedLocation`                               |
| 서브모듈 `geocoder`      | `Service` (`geocode`, `reverseGeocode`, `fromAddrToCoord`, `fromCoordToAddr`)                                   |

`LogoControl`은 제거할 수 없다. 네이버 로고와 저작권 표기는 이용 약관상 가려서도 안 되므로, 지도 위에 올리는 바텀시트나 오버레이가 로고를 덮지 않는지 확인한다. 현재 홈 화면은 지도 위에 바텀시트를 올리는 구조이므로 이 부분을 디자인과 함께 점검해야 한다.

## 클라이언트에서 지오코딩

`geocoder` 서브모듈을 로드하면 브라우저에서 Key ID만으로 주소와 좌표를 변환할 수 있다. REST API와 달리 Secret이 필요 없다.

```ts
naver.maps.Service.reverseGeocode(
  { coords: new naver.maps.LatLng(lat, lng) },
  (status, response) => {
    if (status !== naver.maps.Service.Status.OK) return;
    const { jibunAddress, roadAddress } = response.v2.address;
  }
);
```

```ts
naver.maps.Service.geocode({ query: "서울특별시 성동구 성수동" }, (status, response) => {
  if (status !== naver.maps.Service.Status.OK) return;
  const [first] = response.v2.addresses;
  const lat = Number(first.y);
  const lng = Number(first.x);
});
```

콜백 기반 API이므로 Promise로 감싸 쓴다. 응답의 `x`와 `y`는 문자열이고 `x`가 경도, `y`가 위도다. 이 호출도 REST API와 동일하게 과금된다.

## TypeScript

타입 정의는 `@types/navermaps`로 제공된다. `react-naver-maps`를 쓰면 그 패키지가 타입을 함께 가져온다. 전역 `naver` 네임스페이스를 직접 참조하는 코드는 `declare global`이 필요할 수 있으므로, 현재 `kakao.maps.LatLng`를 전역으로 쓰는 `MapCameraSync` 같은 코드를 옮길 때 확인한다.
