import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "공지사항",
    template: "%s | 찾아줘! 공지사항",
  },
  description: "찾아줘에 등록된 공지사항을 확인해 보세요.",
  other: { "page-type": "notice" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
