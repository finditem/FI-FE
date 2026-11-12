# notice/[id] 작업 계획

## SEO: 공지 상세 본문 서버 렌더(H1) + soft 404 교정(H2) — 서버 props 방식

게시글 상세(list/[id], PR #1413)와 같은 방식이다. 서버 데이터를 React Query 캐시에 넣지 않고 props로만
내려, 본문은 서버 데이터로 즉시 그리고 사용자별 값(`likeStatus`)과 인터랙션은 기존 클라이언트 쿼리가 맡는다.

- [x] `_utils/getNoticeDetailOnServer`: 서버에서 `/notices/{id}`를 익명 fetch(revalidate 60)해 found / notFound(404) / unavailable(그 외 실패)로 구분해 돌려준다.
- [x] `page.tsx`: 숫자가 아닌 id와 notFound는 `notFound()`(H2), found면 `initialNotice` prop으로 `NoticeDetailView`에 내린다.
- [x] `NoticeDetailView`: 본문은 `라이브 쿼리 결과 ?? initialNotice`로 그려 서버 HTML에 싣는다(H1). 스켈레톤은 본문 데이터가 전혀 없을 때만 보인다.
- [x] `NoticeDetailContent`: 클라이언트 조회 전에는 `likeStatus`가 익명 값이라 추천 버튼을 비활성화한다. 상대 시간 라벨은 hydration 경고를 억제한다.
- [x] `npm run test`(notice 12 suites / 66 통과), `npm run build` 통과. `next start`로 서버 HTML에 본문 h1이 실리고 `/notice/99999999`, `/notice/abc`가 404를 주는 것을 확인했다.
- [ ] e2e(notice.spec)가 CI에서 녹색인지 확인한다.
