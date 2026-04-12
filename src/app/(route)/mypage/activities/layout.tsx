import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "내 활동 내역",
  description: "찾아줘에서 내가 활동한 기록들을 확인해보세요.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
