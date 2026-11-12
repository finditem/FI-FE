# public-data/[type]/[postId] 작업 계획

## SEO: 경찰청 유실물 상세 본문 서버 렌더(H1) + soft 404 교정(H2) — 서버 props 방식

게시글 상세(list/[id], PR #1413)와 같은 방식이다. 서버 조회 결과를 React Query 캐시에 넣지 않고
props로만 내린다. 공공데이터에는 사용자별 값이 없어 개인화 교정은 필요 없다.

- [x] `_utils/getPublicDetailOnServer`: 내부 프록시 라우트(`/api/public/{type}`)를 서버에서 조회해 found / notFound(항목 없음, 포털 결과 없음 코드) / unavailable(그 외 실패)로 구분해 돌려준다.
- [x] `page.tsx`: type이 lost/found가 아니거나 notFound면 `notFound()`(H2), found면 `initialItem` prop으로 `PublicClientDetail`에 내린다.
- [x] `usePublicClientDetail`: 클라이언트 조회 결과가 없으면 `initialItem`으로 가공해 서버 HTML에 본문을 싣는다(H1).
- [x] `PublicClientDetail`: 렌더 중 `window.location.href` 접근을 서버 렌더에서 깨지지 않게 가드한다.
- [x] `npm run test`(public-data 8 suites / 83 통과), `npm run build` 통과. e2e 모드(서버 MSW)로 빌드한 `next start`에서 lost/found 상세의 서버 HTML에 본문 h1이 실리고, `/public-data/foo/1`이 404를 주는 것을 확인했다. 로컬에는 포털 API 키가 없어 실제 포털 응답 기준의 404는 확인하지 못했다.
- [ ] e2e(public-data-page.spec)가 CI에서 녹색인지 확인한다.
