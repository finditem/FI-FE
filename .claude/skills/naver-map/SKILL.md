---
name: naver-map
description: 네이버 지도(NCP Maps) 관련 작업을 할 때 실행한다. 지도 화면 구현과 수정, 마커와 오버레이, 줌 레벨, 지오코딩(주소와 좌표 변환), 카카오 지도에서 네이버 지도로의 마이그레이션이 대상이다. docs/naver-map/ 문서를 컨텍스트로 읽어 온다. 카카오 로그인 같은 지도 외 카카오 기능에는 사용하지 않는다.
---

# naver-map

네이버 지도 작업의 컨텍스트는 `docs/naver-map/`에 있다. 작업을 시작하기 전에 필요한 문서를 읽는다.

## 절차

1. `docs/naver-map/README.md`를 먼저 읽는다. 인증과 키 처리 규칙, 상품 구성이 여기에 있다.
2. 작업 종류에 따라 아래 문서를 읽는다.
   - 지도 화면, 마커, 오버레이, 줌, 이벤트 — `docs/naver-map/web-dynamic-map.md`
   - 주소와 좌표 변환, 정적 지도 이미지, 경로 탐색 — `docs/naver-map/rest-api.md`
   - 카카오에서 네이버로 옮기는 작업 — `docs/naver-map/migration-from-kakao.md`
3. 문서에 없는 API를 써야 하면 공식 문서에서 확인한 뒤, 알아낸 내용을 해당 문서에 추가한다. 다음 사람이 같은 것을 다시 찾지 않게 한다.

## 반드시 지킬 것

- `NAVER_MAP_KEY`(REST API의 Key, 구 Client Secret)에 `NEXT_PUBLIC_` 접두사를 붙이지 않는다. 붙이면 클라이언트 번들에 Secret이 노출된다. 클라이언트에서 지오코딩이 필요하면 JS SDK의 `naver.maps.Service`를 쓴다.
- 줌 레벨을 카카오 `level`과 혼동하지 않는다. 네이버 `zoom`은 값이 클수록 확대된다. 변환 공식은 `zoom = 20 - level`이고 근거와 대응표는 마이그레이션 문서에 있다.
- 백엔드 지도 API(`/main/posts/marker`, `/main/posts/recent-found`, `/main/places/search-location` 등)는 카카오 `level` 의미론으로 파라미터를 받는다. 이 값을 바꾸는 변경은 백엔드 합의 없이 진행하지 않는다.
- 스크립트 인증 파라미터는 `ncpKeyId`다. 오래된 예제의 `ncpClientId`는 폐기되었다.

## 문서 갱신

공식 문서와 실제 동작이 다른 지점, 새로 밟은 함정, 새로 쓰게 된 API는 `docs/naver-map/`에 기록한다. 이 문서들은 팀 공용 컨텍스트이므로 개인 메모가 아니라 다음 작업자가 읽을 문서로 쓴다.
