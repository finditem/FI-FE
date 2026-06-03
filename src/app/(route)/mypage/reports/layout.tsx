import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "내 신고 내역",
  other: { "page-type": "mypage-reports" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
