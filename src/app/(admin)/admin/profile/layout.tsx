import { ReactNode } from "react";
import type { Metadata } from "next";
import { DetailHeader } from "@/components";

export const metadata: Metadata = {
  title: "프로필 설정",
  other: { "page-type": "admin-profile-settings" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader title="프로필 설정" />
      <h1 className="sr-only">관리자 프로필 수정</h1>

      {children}
    </>
  );
};

export default layout;
