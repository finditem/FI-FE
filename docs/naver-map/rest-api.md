# 네이버 지도 REST API

공통 인증 헤더는 아래 두 개다. 발급과 보안 주의사항은 [README.md](./README.md#인증)를 참고한다.

```
x-ncp-apigw-api-key-id: {Key ID}
x-ncp-apigw-api-key: {Key}
```

모든 API는 `GET`이다.

## 호출 경로 선택

네이버 REST API는 Secret에 해당하는 Key가 필요하고 브라우저 직접 호출은 CORS로 막힌다. 카카오 로컬 API를 브라우저에서 바로 부르던 방식(`src/api/fetch/kakao/`)을 그대로 옮길 수 없다. 기능별로 아래 경로를 고른다.

| 하고 싶은 일                           | 권장 경로                                  | 이유                                                        |
| -------------------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| 클라이언트에서 좌표를 주소로           | JS SDK `naver.maps.Service.reverseGeocode` | Key ID만 필요하고 서버 코드가 없다                          |
| 클라이언트에서 주소를 좌표로           | JS SDK `naver.maps.Service.geocode`        | 같은 이유                                                   |
| 서버에서 주소를 좌표로                 | REST Geocoding                             | SDK는 브라우저 전용이다                                     |
| 검색 결과 페이지네이션이나 필터가 필요 | REST Geocoding                             | SDK에는 `page`, `count`, `filter`가 없다                    |
| 정적 지도 이미지                       | Static Map `/raster-cors`                  | Referer 인증이므로 Secret 없이 `img` 태그로 바로 쓸 수 있다 |

REST API를 클라이언트에서 써야 한다면 Next.js Route Handler로 프록시한다. `src/app/api/` 아래에 두고, 키는 `NAVER_MAP_KEY`(`NEXT_PUBLIC_` 없음)에서 읽는다.

```ts
// src/app/api/geocode/route.ts
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query");
  if (!query) return Response.json({ error: "query is required" }, { status: 400 });

  const response = await fetch(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(query)}`,
    {
      headers: {
        "x-ncp-apigw-api-key-id": process.env.NAVER_MAP_KEY_ID!,
        "x-ncp-apigw-api-key": process.env.NAVER_MAP_KEY!,
      },
    }
  );

  return Response.json(await response.json(), { status: response.status });
}
```

프록시를 만들면 우리 서버 키로 누구나 호출할 수 있게 되므로 입력 검증과 호출 제한을 함께 둔다. 과금되는 API다.

## Geocoding

주소를 좌표로 변환한다.

```
GET https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode
```

헤더에 `Accept: application/json`을 추가한다.

### 요청 파라미터

| 파라미터     | 타입    | 필수 | 설명                                             |
| ------------ | ------- | ---- | ------------------------------------------------ |
| `query`      | String  | 필수 | 검색할 주소                                      |
| `coordinate` | String  | 선택 | 검색 중심 좌표. `경도,위도` 순서다               |
| `filter`     | Integer | 선택 | HCODE 또는 BCODE 행정구역 코드로 결과를 제한한다 |
| `language`   | String  | 선택 | `kor`(기본), `eng`                               |
| `page`       | Number  | 선택 | 페이지 번호. 기본 1                              |
| `count`      | Number  | 선택 | 결과 개수. 1에서 100, 기본 10                    |

`coordinate`를 주면 그 좌표에 가까운 결과가 위로 올라오고 각 결과에 `distance`가 채워진다. 지도 중심을 넘겨 주변 결과를 우선 노출하는 데 쓴다.

### 응답

```ts
type GeocodeResponse = {
  status: string;
  meta: { totalCount: number; page: number; count: number };
  addresses: {
    roadAddress: string;
    jibunAddress: string;
    englishAddress: string;
    x: string; // 경도
    y: string; // 위도
    distance: number; // coordinate를 준 경우의 거리(m)
    addressElements: {
      types: string[];
      longName: string;
      shortName: string;
      code: string;
    }[];
  }[];
  errorMessage?: string; // 500 응답에만 존재한다
};
```

`x`와 `y`가 문자열이므로 `Number()`로 변환해야 한다. `x`가 경도, `y`가 위도다.

## Reverse Geocoding

좌표를 주소로 변환한다.

```
GET https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc
```

### 요청 파라미터

| 파라미터    | 타입   | 필수 | 값                                                           |
| ----------- | ------ | ---- | ------------------------------------------------------------ |
| `coords`    | String | 필수 | `경도,위도` 순서. 예: `127.055972,37.544583`                 |
| `sourcecrs` | String | 선택 | `EPSG:4326`(기본), `EPSG:3857`, `NHN:2048`                   |
| `targetcrs` | String | 선택 | 위와 동일                                                    |
| `orders`    | String | 선택 | `legalcode`, `admcode`, `addr`, `roadaddr`를 콤마로 나열한다 |
| `output`    | String | 선택 | `xml`(기본), `json`                                          |
| `callback`  | String | 선택 | JSONP 콜백 이름. `output=json`에서만 동작                    |

**`output`의 기본값이 `xml`이다.** 반드시 `output=json`을 명시한다. 이것이 이 API에서 가장 자주 밟는 함정이다.

`orders`는 어떤 형태의 주소를 받을지 고르는 값이고 생략하면 `legalcode`만 온다. 도로명 주소와 지번 주소를 모두 원하면 `orders=roadaddr,addr`를 넘긴다.

| `orders` 값 | 의미        |
| ----------- | ----------- |
| `legalcode` | 법정동      |
| `admcode`   | 행정동      |
| `addr`      | 지번 주소   |
| `roadaddr`  | 도로명 주소 |

### 응답

```ts
type ReverseGeocodeResponse = {
  status: { code: number; name: string; message: string };
  results: {
    name: string; // 요청한 orders 중 어떤 것인지
    code: { id: string; type: string; mappingId: string };
    region: {
      area0: Area; // 국가
      area1: Area; // 시도
      area2: Area; // 시군구
      area3: Area; // 읍면동
      area4: Area; // 리
    };
    land?: {
      type: string;
      name: string; // 도로명
      number1: string; // 건물 본번
      number2: string; // 건물 부번
      coords: { center: { crs: string; x: number; y: number } };
      addition0: { type: string; value: string }; // 건물명 등
      addition1: { type: string; value: string };
      addition2: { type: string; value: string };
      addition3: { type: string; value: string };
      addition4: { type: string; value: string };
    };
  }[];
};

type Area = {
  name: string;
  coords: { center: { crs: string; x: number; y: number } };
  alias?: string;
};
```

카카오의 `coord2address`와 응답 구조가 전혀 다르다. 카카오는 `documents[].address.address_name`으로 완성된 주소 문자열을 주지만, 네이버는 `region.area1.name`부터 `area4.name`까지를 직접 이어 붙여야 한다. `land`는 `orders`에 `addr`나 `roadaddr`를 넣었을 때만 채워진다.

`서울특별시 성동구 성수동` 같은 문자열을 만들려면 다음과 같이 조립한다.

```ts
const [result] = response.results;
const { area1, area2, area3 } = result.region;
const address = [area1.name, area2.name, area3.name].filter(Boolean).join(" ");
```

## Static Map

지도 이미지를 생성한다. 현재 미사용이지만 게시글 카드 썸네일처럼 인터랙션이 필요 없는 지도에 쓰면 Web Dynamic Map 로딩 비용을 줄일 수 있다.

```
GET https://naveropenapi.apigw.ntruss.com/map-static/v2/raster
GET https://naveropenapi.apigw.ntruss.com/map-static/v2/raster-cors
```

`/raster`는 Key ID와 Key 헤더로 인증한다. `/raster-cors`는 HTTP Referer로 인증하므로 NCP 콘솔에 Web 서비스 URL이 등록되어 있으면 **Secret 없이 `img` 태그의 `src`에 URL을 그대로 넣을 수 있다.** 클라이언트에서 쓸 때는 이쪽을 쓴다.

### 요청 파라미터

| 파라미터      | 타입    | 필수   | 값                                                                 |
| ------------- | ------- | ------ | ------------------------------------------------------------------ |
| `w`, `h`      | Integer | 필수   | 1에서 1024 픽셀                                                    |
| `center`      | String  | 조건부 | `경도,위도`                                                        |
| `level`       | Integer | 조건부 | 0에서 20                                                           |
| `markers`     | String  | 조건부 | 최대 20개. 파이프로 옵션을 구분한다                                |
| `crs`         | String  | 선택   | `EPSG:4326`(기본) 외 다수                                          |
| `maptype`     | String  | 선택   | `basic`(기본), `traffic`, `satellite`, `satellite_base`, `terrain` |
| `format`      | String  | 선택   | `jpg`(기본), `png`, `png8`                                         |
| `scale`       | Integer | 선택   | `1`(기본), `2`(고해상도)                                           |
| `lang`        | String  | 선택   | `ko`(기본), `en`, `ja`, `zh`                                       |
| `dataversion` | String  | 선택   | 캐시 관리용 버전 문자열                                            |

`center`와 `level`을 함께 주거나, 둘을 생략하고 `markers`를 준다. 후자는 마커가 모두 들어오도록 자동으로 맞춘다.

**Static Map의 `level`은 Web Dynamic Map의 `zoom`과 다른 파라미터 이름을 쓰지만 의미는 같다.** 값이 클수록 확대되고 범위는 0에서 20이다. 카카오의 `level`과 헷갈리지 않도록 주의한다.

### 마커 옵션

`markers=type:d|size:mid|color:red|pos:127.055972 37.544583` 형태로 파이프로 구분해 쓴다.

| 키               | 값                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `type`           | `d`(기본), `n`(숫자), `a`(알파벳), `t`(툴팁), `e`(사용자 정의 이미지)                            |
| `size`           | `tiny`, `small`, `mid`(기본)                                                                     |
| `color`          | `Default`, `Blue`, `Orange`, `Yellow`, `Red`, `Brown`, `Green`, `Purple`, `Gray` 또는 24비트 hex |
| `label`          | A에서 Z, 0에서 9                                                                                 |
| `pos`            | 필수. `경도 위도`. 콤마로 여러 개를 넘긴다                                                       |
| `icon`, `anchor` | `type:e`에서만 사용하는 사용자 정의 마커 이미지 URL과 기준점                                     |
| `viewSizeRatio`  | 0.1에서 2.0                                                                                      |

## Directions

경로를 탐색한다. 현재 미사용이다. 분실물 위치까지 가는 길 안내 같은 기능을 붙일 때 검토한다.

```
GET https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving
GET https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving
```

Directions 5는 경유지 5개, Directions 15는 15개까지 지원한다. 파라미터 구조는 같고 요금 단가가 다르다.

### 요청 파라미터

| 파라미터    | 타입    | 필수 | 값                                                                                                                                 |
| ----------- | ------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `start`     | String  | 필수 | `경도,위도`                                                                                                                        |
| `goal`      | String  | 필수 | `경도,위도`. 콜론으로 최대 10개 목적지                                                                                             |
| `waypoints` | String  | 선택 | `경도,위도`. 파이프로 구분                                                                                                         |
| `option`    | String  | 선택 | `trafast`(실시간 빠른길), `tracomfort`(편한길), `traoptimal`(최적), `traavoidtoll`(무료 우선), `traavoidcaronly`(자동차 전용 회피) |
| `cartype`   | Integer | 선택 | 1에서 6                                                                                                                            |
| `fueltype`  | String  | 선택 | `gasoline`, `highgradegasoline`, `diesel`, `lpg`                                                                                   |
| `mileage`   | Double  | 선택 | 연비. 기본 14 km/L                                                                                                                 |
| `lang`      | String  | 선택 | `ko`, `en`, `ja`, `zh`                                                                                                             |

자동차 경로만 제공한다. 도보와 대중교통 경로는 네이버 지도 API에 없으므로, 필요하면 지도 앱 연동 URL Scheme로 네이버 지도 앱을 여는 방식을 쓴다.

### 응답

| 필드              | 설명                                  |
| ----------------- | ------------------------------------- |
| `code`            | 응답 코드                             |
| `message`         | 응답 메시지                           |
| `currentDateTime` | 조회 시각                             |
| `route`           | 선택한 `option`을 키로 갖는 경로 결과 |

## 오류 처리

HTTP 상태 코드와 별개로 응답 본문의 `status` 또는 `code`를 확인해야 한다. 특히 Geocoding은 검색 결과가 없을 때도 200을 주고 `addresses`가 빈 배열로 온다. 빈 배열과 오류를 구분해 처리한다.

인증 실패는 401 또는 403으로 온다. 이 경우 Key ID와 Key가 맞는지, 그리고 NCP 콘솔에서 해당 API가 Application에 추가되어 있는지 확인한다. **Application에 API를 추가하지 않으면 키가 맞아도 실패한다.** 지도 관련 API를 새로 쓸 때마다 콘솔에서 체크박스를 켜 줘야 한다.
