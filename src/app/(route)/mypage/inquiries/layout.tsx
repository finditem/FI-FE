import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "내 문의 내역",
  other: { "page-type": "mypage-inquiries" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
