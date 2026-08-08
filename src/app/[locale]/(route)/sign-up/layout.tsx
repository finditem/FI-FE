import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "회원가입",
  description: "찾아줘 계정을 만들어 분실물을 찾고 습득물을 공유해 보세요.",
  other: { "page-type": "sign-up" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
