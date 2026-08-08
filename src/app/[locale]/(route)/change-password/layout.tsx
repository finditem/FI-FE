import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "비밀번호 변경 | 찾아줘! 마이페이지" },
  description: "찾아줘 계정의 비밀번호를 안전하게 변경해 보세요.",
  other: { "page-type": "change-password" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
