import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "내가 쓴 댓글",
  description: "찾아줘에서 내가 작성한 댓글을 확인해보세요.",
  other: { "page-type": "mypage-comments" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
