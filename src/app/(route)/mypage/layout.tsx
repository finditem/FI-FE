import useServerPrefetchQuery from "@/api/_base/query/useServerPrefetchQuery";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "마이페이지",
    template: "%s | 찾아줘! 마이페이지",
  },
  description:
    "찾아줘 마이페이지에서 분실물과 습득물 활동, 즐겨찾기, 계정 설정 등 다양한 서비스를 한곳에서 관리해보세요.",
  other: { "page-type": "mypage" },
};

export default async function layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  const cookieStore = await cookies();
  const hasToken = cookieStore.has("access_token");

  if (hasToken) {
    try {
      await useServerPrefetchQuery({
        queryClient,
        queryKey: ["users-me"],
        fetcher: () =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { Cookie: cookieStore.toString() },
            next: { revalidate: 0 },
          }).then((res) => {
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
          }),
      });
    } catch (error) {
      // no-op
    }
  }

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
