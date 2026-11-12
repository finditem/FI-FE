import "server-only";
import type { GetDetailPostResponse, PostDetailData } from "@/api/fetch/post/types/PostDetailType";

type PostDetailOnServerResult =
  { status: "found"; post: PostDetailData } | { status: "notFound" } | { status: "unavailable" };

/**
 * 게시글 상세를 서버에서 익명으로 조회해 존재 여부와 본문 데이터를 돌려줍니다.
 *
 * @remarks
 * - 결과는 React Query 캐시에 넣지 않고 props로만 내립니다. 캐시를 하이드레이트하면 로그인 흐름의
 *   캐시 비움과 맞물려 상세 트리가 흔들렸기 때문에(PR #1397), 본문 렌더와 클라이언트 쿼리를 분리했습니다.
 *   같은 이유로 `useServerPrefetchQuery` 대신 네이티브 fetch를 씁니다.
 * - 쿠키 없이 호출하므로 `isMine`, `favoriteStatus` 같은 사용자별 값은 비어 있습니다. 개인화 값은
 *   클라이언트의 `useGetDetailPost` 결과로 교정해야 합니다.
 * - 백엔드가 404를 줄 때만 `notFound`로 봅니다. 서버 오류나 네트워크 실패는 `unavailable`로 돌려,
 *   일시 장애가 404로 색인되지 않도록 호출부에서 기존 클라이언트 렌더로 넘기게 합니다.
 *
 * @param postId - 조회할 게시글 ID
 * @returns 조회 결과 상태와, 찾았다면 본문 데이터
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * const result = await getPostDetailOnServer(postId);
 * if (result.status === "notFound") notFound();
 * ```
 */
export const getPostDetailOnServer = async (postId: number): Promise<PostDetailOnServerResult> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) return { status: "notFound" };
    if (!res.ok) return { status: "unavailable" };

    const body: GetDetailPostResponse = await res.json();
    if (!body?.result) return { status: "notFound" };

    return { status: "found", post: body.result };
  } catch {
    return { status: "unavailable" };
  }
};
