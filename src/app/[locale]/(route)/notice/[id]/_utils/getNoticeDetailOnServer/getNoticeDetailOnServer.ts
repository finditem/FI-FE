import "server-only";
import type { NoticeDetail, NoticeDetailResponse } from "@/api/fetch/notice/types/NoticeDetailType";

type NoticeDetailOnServerResult =
  { status: "found"; notice: NoticeDetail } | { status: "notFound" } | { status: "unavailable" };

/**
 * 공지 상세를 서버에서 익명으로 조회해 존재 여부와 본문 데이터를 돌려줍니다.
 *
 * @remarks
 * - 결과는 React Query 캐시에 넣지 않고 props로만 내립니다. 게시글 상세(PR #1397)에서 캐시를
 *   하이드레이트하면 로그인 흐름의 캐시 비움과 맞물려 상세 트리가 흔들렸기 때문입니다. 같은 이유로
 *   `useServerPrefetchQuery` 대신 네이티브 fetch를 씁니다.
 * - 쿠키 없이 호출하므로 `likeStatus`는 익명 기준 값입니다. 클라이언트의 `useGetNoticeDetail` 결과로
 *   교정해야 합니다.
 * - 백엔드가 404를 줄 때만 `notFound`로 봅니다. 서버 오류나 네트워크 실패는 `unavailable`로 돌려,
 *   일시 장애가 404로 색인되지 않도록 호출부에서 기존 클라이언트 렌더로 넘기게 합니다.
 *
 * @param noticeId - 조회할 공지 ID
 * @returns 조회 결과 상태와, 찾았다면 본문 데이터
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * const result = await getNoticeDetailOnServer(noticeId);
 * if (result.status === "notFound") notFound();
 * ```
 */
export const getNoticeDetailOnServer = async (
  noticeId: number
): Promise<NoticeDetailOnServerResult> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notices/${noticeId}`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) return { status: "notFound" };
    if (!res.ok) return { status: "unavailable" };

    const body: NoticeDetailResponse = await res.json();
    if (!body?.result) return { status: "notFound" };

    return { status: "found", notice: body.result };
  } catch {
    return { status: "unavailable" };
  }
};
