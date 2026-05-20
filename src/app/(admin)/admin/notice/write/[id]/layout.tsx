import { DetailHeader } from "@/components";
import { ReactNode } from "react";

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
