import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components";

export const metadata: Metadata = {
  title: "유저 탈퇴 사유 목록",
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
