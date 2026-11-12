import "server-only";

type UserMetaOnServerResult =
  { status: "found"; nickname: string } | { status: "notFound" } | { status: "unavailable" };

/**
 * 회원 프로필의 메타 정보를 서버에서 조회해 존재 여부와 닉네임을 돌려줍니다.
 *
 * @remarks
 * - `generateMetadata`와 페이지 본문이 같은 URL과 옵션으로 호출하므로 Next.js fetch 캐시로 한 번만 요청됩니다.
 * - 백엔드가 404를 줄 때만 `notFound`로 봅니다. 서버 오류나 네트워크 실패는 `unavailable`로 돌려,
 *   일시 장애가 404로 색인되지 않도록 호출부에서 기존 클라이언트 렌더로 넘기게 합니다.
 *
 * @param userId - 조회할 회원 ID
 * @returns 조회 결과 상태와, 찾았다면 닉네임
 *
 * @author suhyeon
 */
/**
 * @example
 * ```tsx
 * const result = await getUserMetaOnServer(userId);
 * if (result.status === "notFound") notFound();
 * ```
 */
export const getUserMetaOnServer = async (userId: number): Promise<UserMetaOnServerResult> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/meta`, {
      next: { revalidate: 600 },
    });

    if (res.status === 404) return { status: "notFound" };
    if (!res.ok) return { status: "unavailable" };

    const body = await res.json();
    return { status: "found", nickname: body?.result?.nickname ?? "" };
  } catch {
    return { status: "unavailable" };
  }
};
