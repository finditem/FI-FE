import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1:1 문의하기",
  description: "찾아줘 서비스 이용 중 궁금한 점이 있나요? 1:1 문의로 빠르게 접수해보세요.",
  other: { "page-type": "inquiry-write" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
