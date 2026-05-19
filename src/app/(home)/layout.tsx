import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "우리 동네 분실물 찾기, 찾아줘!",
  description:
    "가장 빠르고 쉬운 분실물 센터. 경찰청 분실물부터 내 주변 분실물까지, 지도에서 바로 확인해보세요!",
  other: { "page-type": "home" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
