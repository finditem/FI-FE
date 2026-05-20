import { DetailHeader } from "@/components/layout";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  other: { "page-type": "admin-notice-write" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-base">
      <DetailHeader title="공지사항 수정" />
      <h1 className="sr-only">공지사항 수정 페이지</h1>
      {children}
    </div>
  );
};

export default Layout;
