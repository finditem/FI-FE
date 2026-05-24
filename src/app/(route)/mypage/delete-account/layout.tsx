import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "회원 탈퇴",
  description: "찾아줘 계정을 삭제하고 서비스 이용을 중단할 수 있어요.",
  other: { "page-type": "mypage-delete-account" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
