import "server-only";
import { headers } from "next/headers";
import type { PublicDataItem } from "@/types";
import type { PublicDataTabType } from "@/app/[locale]/(route)/public-data/_types/PublicDataTabType";

type PublicDetailOnServerResult =
  { status: "found"; item: PublicDataItem } | { status: "notFound" } | { status: "unavailable" };

/** 공공데이터 포털이 조회 결과가 없을 때 내려주는 결과 코드(NODATA_ERROR)입니다. */
const PORTAL_NO_DATA_CODE = "03";

/**
 * 경찰청 유실물 상세를 서버에서 조회해 존재 여부와 본문 데이터를 돌려줍니다.
 *
 * @remarks
 * - 클라이언트의 `usePublicDataDetailQuery`와 같은 내부 프록시 라우트(`/api/public/{type}`)를 호출합니다.
 * - 결과는 React Query 캐시에 넣지 않고 props로만 내립니다. 게시글·공지 상세와 같은 방식으로 맞춰,
 *   본문 렌더와 클라이언트 쿼리를 분리합니다.
 * - 항목이 비어 있거나 포털이 결과 없음 코드를 줄 때만 `notFound`로 봅니다. 그 밖의 실패는
 *   `unavailable`로 돌려, 포털 장애가 404로 색인되지 않도록 호출부에서 기존 클라이언트 렌더로 넘기게 합니다.
 *
 * @param type - 분실물(`lost`) 또는 습득물(`found`)
 * @param atcId - 포털 관리번호
 * @returns 조회 결과 상태와, 찾았다면 항목 데이터
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * const result = await getPublicDetailOnServer("lost", postId);
 * if (result.status === "notFound") notFound();
 * ```
 */
export const getPublicDetailOnServer = async (
  type: PublicDataTabType,
  atcId: string
): Promise<PublicDetailOnServerResult> => {
  try {
    const host = (await headers()).get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const params = new URLSearchParams({ atcId });

    const res = await fetch(`${protocol}://${host}/api/public/${type}?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return body?.code === PORTAL_NO_DATA_CODE
        ? { status: "notFound" }
        : { status: "unavailable" };
    }

    const item = Array.isArray(body?.items?.item) ? body.items.item[0] : body?.items?.item;
    if (!item) return { status: "notFound" };

    return { status: "found", item };
  } catch {
    return { status: "unavailable" };
  }
};
