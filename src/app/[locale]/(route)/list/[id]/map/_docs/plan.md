# list/[id]/map 작업 계획

- [x] `PostDetailKakaoMap`을 `PostDetailNaverMap`으로 이름 변경한다 (폴더, 파일, `_components/index.ts` export, `page.tsx` import, 테스트와 스토리 이름).
- [x] 번역 네임스페이스 `PostDetailKakaoMap`을 `PostDetailNaverMap`으로 ko/en 동시에 변경한다.
- [x] `BaseKakaoMap`을 `BaseNaverMap`으로 전환한다 (`getMapLevelByRadius`는 `getMapZoomByRadius`로, `minLevel={8}`은 `minZoom={12}`로).
- [x] 단위 테스트의 지도 mock과 줌 기대값(14/13/12)을 네이버 기준으로 바꾼다.
- [x] 스토리에 `ToastProvider` 데코레이터를 추가한다.
- [x] `post-write-map.spec.ts`가 차단하는 지도 SDK 요청을 카카오에서 네이버(`oapi.map.naver.com`)로 바꾼다.
- [x] `npm run check:i18n-keys`, `npm run test`, `npm run build`, `npm run build-storybook`으로 회귀를 확인한다.
- [x] 실제 상세 지도 화면에서 배율, 마커, 반경 원, 드래그, 하단 주소 카드를 확인한다.
