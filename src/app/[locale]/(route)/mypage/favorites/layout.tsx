import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "즐겨찾기 목록",
  description: "찾아줘에서 내가 즐겨찾기한 분실 및 발견 게시글을 확인해보세요.",
  other: { "page-type": "mypage-favorites" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
