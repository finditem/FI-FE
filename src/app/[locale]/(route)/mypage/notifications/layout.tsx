import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "알림 설정",
  description: "찾아줘에서 내가 받을 알림을 직접 선택하고 관리할 수 있어요.",
  other: { "page-type": "mypage-notifications" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
