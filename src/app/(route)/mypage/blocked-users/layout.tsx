import { ReactNode } from "react";
import type { Metadata } from "next";
import { DetailHeader } from "@/components/layout";

export const metadata: Metadata = {
  other: { "page-type": "mypage-blocked-users" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader title="내가 차단한 계정" />
      <h1 className="sr-only">내가 차단한 계정</h1>

      {children}
    </>
  );
};

export default layout;
