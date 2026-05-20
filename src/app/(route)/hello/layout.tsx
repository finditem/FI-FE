import { ReactNode } from "react";
import type { Metadata } from "next";
import { DetailHeader } from "@/components/layout";

export const metadata: Metadata = {
  title: "서비스 소개",
  description:
    "가장 빠르고 쉬운 분실물 센터. 경찰청 분실물부터 내 주변 분실물까지, 지도에서 바로 확인해보세요!",
  other: { "page-type": "hello" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader />
      <h1 className="sr-only">서비스소개 페이지</h1>
      {children}
    </>
  );
};

export default layout;
