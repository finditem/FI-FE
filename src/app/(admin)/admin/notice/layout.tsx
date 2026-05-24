import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components";

export const metadata: Metadata = {
  title: "공지사항 글쓰기",
  other: { "page-type": "admin-notice" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <ScrollToTopButton className="fixed-button-position-bottom" />
    </>
  );
};

export default layout;
