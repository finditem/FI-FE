import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "비밀번호 찾기",
  description: "찾아줘에서 계정 이메일 인증을 통해 비밀번호를 변경해 보세요.",
  other: { "page-type": "find-password" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
