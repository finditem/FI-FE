import { DetailHeader } from "@/components/layout";
import { ReactNode } from "react";
import { FloatingInquiryButton } from "./_components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "찾아줘 서비스가 궁금하신가요? 분실물 찾는 방법, 게시글 작성 등 자주 묻는 질문을 한 곳에서 확인할 수 있어요.",
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DetailHeader title="자주 묻는 질문" />
      <h1 className="sr-only">자주 묻는 질문</h1>
      {children}
      <FloatingInquiryButton />
    </>
  );
};

export default Layout;
