import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "찾아줘 계정에 로그인하여 분실물을 찾고 습득물을 공유해보세요.",
  other: { "page-type": "login" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <Suspense fallback="">{children}</Suspense>;
};

export default layout;
