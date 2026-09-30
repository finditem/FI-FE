# write/post/location 작업 계획

- [x] `PostWriteKakaoMap`을 `PostWriteNaverMap`으로 이름 변경한다 (폴더, 파일, `_internal/index.ts` export, `LocationRangeSection` import).
- [x] `PostWriteNaverMap`을 `BaseNaverMap`으로 전환한다 (`getMapZoomByRadius`, `minLevel={9}`는 `minZoom={11}`).
- [x] `BaseNaverMap`이 지오코딩 서브모듈(`geocoder`)을 함께 로드하도록 한다.
- [x] 네이버 역지오코딩 결과를 저장 주소(`fullAddress`)와 화면 제목용 동 이름(`address`)으로 조립하는 `_utils/getNaverAddress`를 추가한다 (도로명 우선, 지번일 때 시도 약칭).
- [x] `getNaverAddress`의 조립 규칙을 단위 테스트로 고정한다 (도로명, 지번, 부번 없음, 산 번지, 결과 없음).
- [x] `LocationRangeSection`의 `getKakaoLocalCoord2Address` 호출을 `getNaverAddress`로 바꾼다.
- [x] `post-write`, `post-edit`, `post-write-location` e2e가 차단하는 지도 SDK 요청을 네이버로 바꾸고, 쓰이지 않는 카카오 주소 mock을 지운다.
- [x] `npm run test`, `npm run build`로 회귀를 확인한다.
- [x] 실제 화면에서 드래그 후 주소가 카카오와 같은 모양으로 나오는지 확인한다 (도로명과 지번 각각, 지번의 시도 약칭).
