import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | 찾아줘! 관리자",
    absolute: "관리자 메인 페이지 | 찾아줘! 관리자",
  },
  description: "찾아줘의 관리자만 접근할 수 있어요.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "관리 시스템",
    description: "접근 권한이 필요합니다.",
    url: "",
    siteName: "",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "관리 시스템",
    description: "접근 권한이 필요합니다.",
    images: [],
  },
  other: { "page-type": "admin" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default layout;
