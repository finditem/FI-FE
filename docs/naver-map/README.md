# 네이버 지도 API

`찾아줘!` 프론트엔드에서 네이버 지도를 다룰 때 참고하는 문서 모음이다. 지도 관련 작업(마이그레이션, 신규 기능, 버그 수정)을 시작할 때 이 폴더를 먼저 읽는다.

## 문서 구성

| 문서                                                 | 내용                                                                                | 언제 읽는가                             |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------- |
| [web-dynamic-map.md](./web-dynamic-map.md)           | Maps JavaScript API v3 레퍼런스. 클래스 목록, `Map` 옵션과 이벤트, 오버레이, 좌표계 | 지도 화면을 만들거나 고칠 때            |
| [rest-api.md](./rest-api.md)                         | Geocoding, Reverse Geocoding, Static Map, Directions REST API                       | 주소와 좌표를 변환하거나 경로를 다룰 때 |
| [migration-from-kakao.md](./migration-from-kakao.md) | 카카오 지도에서 네이버 지도로 옮기는 작업의 대응표와 체크리스트                     | 마이그레이션 작업 중                    |

마이그레이션이 끝나면 `migration-from-kakao.md`는 삭제한다. 나머지 두 문서는 계속 유지한다.

## 공식 문서

우리 문서는 공식 문서를 대체하지 않는다. 아래 링크가 원본이고, 여기에는 우리 프로젝트에 필요한 부분과 실제로 겪은 함정을 정리한다. 공식 문서와 내용이 어긋나면 공식 문서를 따르고 이 문서를 고친다.

- [Maps JavaScript API v3 개발 가이드](https://navermaps.github.io/maps.js.ncp/docs/index.html) — 웹 지도의 사실상 유일한 레퍼런스
- [NCP Maps 상품 개요](https://guide.ncloud-docs.com/docs/maps-overview) — 상품 구성과 요금제
- [NCP API 가이드](https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding-geocode) — REST API 스펙
- [maps.js.ncp GitHub](https://github.com/navermaps/maps.js.ncp) — 예제 코드

`guide.ncloud-docs.com`의 문서는 URL 끝에 `.md`를 붙이면 마크다운 원문을 받을 수 있다(예: `https://guide.ncloud-docs.com/docs/maps-overview.md`). 전체 문서 목록은 [llms.txt](https://guide.ncloud-docs.com/llms.txt)에 있다.

## 상품 구성

NCP Maps는 아래 하위 상품으로 나뉜다. 우리가 쓰는 것은 Web Dynamic Map과 Geocoding 계열이다.

| 상품                    | 용도                            | 우리 사용 여부                                 |
| ----------------------- | ------------------------------- | ---------------------------------------------- |
| Web Dynamic Map API     | 웹 인터랙티브 지도(JavaScript)  | 사용                                           |
| Geocoding API           | 주소를 좌표로 변환              | 사용                                           |
| Reverse Geocoding API   | 좌표를 주소로 변환              | 사용                                           |
| Static Map API          | 지도 이미지를 REST로 생성       | 미사용. 게시글 목록 썸네일 등에 검토 가능      |
| Directions 5 / 15 API   | 경로 탐색(경유지 5개 또는 15개) | 미사용                                         |
| Mobile Dynamic Map SDK  | Android, iOS 네이티브 지도      | 미사용. 앱은 Capacitor로 웹 지도를 그대로 쓴다 |
| 지도 앱 연동 URL Scheme | 네이버 지도 앱 열기             | 미사용                                         |

## 인증

### 키 종류

NCP 콘솔에서 Application을 등록하면 키 한 쌍이 발급된다. 예전 이름은 Client ID와 Client Secret이었고 현재 콘솔 표기는 Key ID와 Key이다. 같은 값을 가리킨다.

| 키                     | 용도                                        | 노출 가능 여부                                  |
| ---------------------- | ------------------------------------------- | ----------------------------------------------- |
| Key ID (구 Client ID)  | JavaScript SDK 스크립트 로딩, REST API 헤더 | 노출된다. 웹 서비스 URL 화이트리스트로 보호한다 |
| Key (구 Client Secret) | REST API 헤더                               | 절대 노출 금지. 서버에서만 사용한다             |

### JavaScript SDK

쿼리 파라미터 이름은 `ncpKeyId`이다. 예전 이름인 `ncpClientId`, `govClientId`, `finClientId`는 폐기되었으므로 오래된 블로그 예제를 복사하면 인증 실패한다.

```html
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=YOUR_KEY_ID&submodules=geocoder"></script>
```

이 키는 브라우저에 노출되므로 NCP 콘솔의 Application 설정에서 Web 서비스 URL을 등록해 도메인을 제한한다. 로컬 개발 주소(`http://localhost:3000`)와 배포 도메인(`https://www.finditem.kr`)을 모두 등록해야 한다. 등록하지 않은 도메인에서 호출하면 `인증이 실패하였습니다` 오류가 난다.

인증 실패는 전역 함수로 잡는다.

```ts
window.navermap_authFailure = () => {
  // 인증 실패 처리. Sentry 리포트 등
};
```

### REST API

헤더 두 개를 보낸다. 이름 대소문자는 무관하다.

```
x-ncp-apigw-api-key-id: {Key ID}
x-ncp-apigw-api-key: {Key}
```

**Key를 브라우저에 내보내면 안 된다.** 카카오 로컬 API는 REST 키 하나만으로 브라우저에서 직접 호출할 수 있었지만(`getKakaoLocalCoord2Address`가 `NEXT_PUBLIC_KAKAO_REST_API_KEY`를 쓰는 방식), 네이버는 Secret에 해당하는 Key가 필요하고 브라우저 직접 호출은 CORS로도 막힌다. 따라서 선택지는 둘이다.

1. 클라이언트에서 필요한 경우 JavaScript SDK의 `naver.maps.Service.geocode` / `reverseGeocode`를 쓴다. 이 경로는 Key ID만으로 동작한다.
2. REST API가 꼭 필요하면 Next.js Route Handler로 프록시한다. 키는 `NEXT_PUBLIC_` 접두사 없는 환경 변수에 둔다.

자세한 내용은 [rest-api.md](./rest-api.md)의 호출 경로 선택 항목을 참고한다.

## 환경 변수

| 변수                           | 값     | 노출                                             |
| ------------------------------ | ------ | ------------------------------------------------ |
| `NEXT_PUBLIC_NAVER_MAP_KEY_ID` | Key ID | 브라우저에 포함된다                              |
| `NAVER_MAP_KEY`                | Key    | 서버 전용. `NEXT_PUBLIC_` 접두사를 붙이지 않는다 |

`NAVER_MAP_KEY`에 `NEXT_PUBLIC_`을 붙이는 실수가 이 마이그레이션에서 가장 위험한 실수다. 붙이면 클라이언트 번들에 Secret이 박혀 배포된다.

## 요금

종량 요금제다. 무료 제공량과 단가는 [NCP Maps 상품 페이지](https://guide.ncloud-docs.com/docs/maps-overview)에서 확인한다. 사용량은 NCP 콘솔의 Usage Statistics에서 본다.

주의할 점은 Geocoding과 Reverse Geocoding이 호출 단위로 과금된다는 것이다. 지도를 드래그할 때마다 역지오코딩을 호출하면 사용량이 빠르게 늘어난다. 이 프로젝트는 이미 `useMainKakaoMapStore`에서 좌표만 갱신하고 주소는 필요할 때만 조회하는 구조(`setUserGpsLatLng`와 `setUserGpsFromDevice`의 분리)를 갖고 있으므로 그 구조를 유지한다.
