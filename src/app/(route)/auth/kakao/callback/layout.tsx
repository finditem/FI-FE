import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "카카오 로그인",
  description: "카카오 계정으로 간편하게 로그인하여 분실물을 찾고 습득물을 공유해보세요.",
  other: { "page-type": "kakao-callback" },
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback="">{children}</Suspense>;
};

export default layout;
