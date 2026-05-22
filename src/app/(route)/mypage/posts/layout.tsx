import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "내가 쓴 게시글",
  description: "찾아줘에서 내가 작성한 분실 및 발견 게시글을 확인해 보세요.",
  other: { "page-type": "mypage-posts" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
