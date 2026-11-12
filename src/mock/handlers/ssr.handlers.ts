import { http, HttpResponse } from "msw";
import { MOCK_POST_DEFAULT_DETAIL } from "../data/posts.data";
import { createMockNoticeDetailHeaderResponse } from "../data/notice.data";
import { buildPublicDetailResponse } from "../data/public.data";
import { MOCK_USER_META_RESPONSE } from "../data/userProfile.data";

/**
 * SSR 프리패치 전용 MSW 핸들러.
 *
 * @remarks
 * - 상세 페이지의 `useServerPrefetchQuery`는 Next 서버 프로세스에서 외부 API 절대 URL
 *   (`${NEXT_PUBLIC_API_URL}/posts/:id` 등)과 공공데이터 프록시 라우트(`/api/public/*`)를
 *   직접 호출한다. 이 요청들은 브라우저를 거치지 않아 Playwright의 `page.route` 목이 닿지
 *   않으므로, e2e에서 Next 서버에 올라가는 MSW(node) 서버가 여기서 가로챈다.
 * - 클라이언트가 쓰는 `/api/posts/:id` 같은 상대 경로 핸들러(`posts.handlers`)와 겹치지 않도록,
 *   서버 측 절대 경로(와일드카드 + `/posts/:id`)와 공공데이터 프록시 경로만 매칭한다.
 */
export const ssrHandlers = [
  // 게시글 상세 (list/[id])
  http.get("*/posts/:id", ({ params }) => {
    return HttpResponse.json({
      ...MOCK_POST_DEFAULT_DETAIL,
      result: { ...MOCK_POST_DEFAULT_DETAIL.result, id: Number(params.id) },
    });
  }),

  // 공지 상세 (notice/[id])
  http.get("*/notices/:id", ({ params }) => {
    return HttpResponse.json(createMockNoticeDetailHeaderResponse(Number(params.id)));
  }),

  // 회원 프로필 메타 (user/[userId]). 서버에서 회원 존재 여부와 닉네임을 확인할 때 호출한다.
  http.get("*/users/:id/meta", () => {
    return HttpResponse.json(MOCK_USER_META_RESPONSE);
  }),

  // 경찰청 분실물 상세 (public-data/lost/[postId])
  http.get("*/api/public/lost", ({ request }) => {
    const atcId = new URL(request.url).searchParams.get("atcId") ?? "";
    return HttpResponse.json(buildPublicDetailResponse("lost", atcId));
  }),

  // 경찰청 습득물 상세 (public-data/found/[postId])
  http.get("*/api/public/found", ({ request }) => {
    const atcId = new URL(request.url).searchParams.get("atcId") ?? "";
    return HttpResponse.json(buildPublicDetailResponse("found", atcId));
  }),
];
