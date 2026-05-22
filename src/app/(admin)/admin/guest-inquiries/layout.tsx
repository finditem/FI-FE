import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components/common";

export const metadata: Metadata = {
  title: "비회원 문의 내역",
  other: { "page-type": "admin-guest-inquiries" },
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
