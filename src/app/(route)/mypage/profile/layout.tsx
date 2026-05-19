import type { Metadata } from "next";
import { ReactNode } from "react";
import { DetailHeader } from "@/components/layout";

export const metadata: Metadata = {
  title: "프로필 설정",
  description: "나의 찾아줘 프로필을 관리해 보세요.",
  other: { "page-type": "mypage-profile" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader title="프로필 설정" />
      <h1 className="sr-only">프로필 수정</h1>

      {children}
    </>
  );
};

export default layout;
