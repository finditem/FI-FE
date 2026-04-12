import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components/common";

export const metadata: Metadata = {
  title: "콘텐츠 활용 동의",
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-dvh">
      {children}
      <ScrollToTopButton className="fixed-button-position-bottom" />
    </div>
  );
};

export default layout;
