import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components";

export const metadata: Metadata = {
  other: { "page-type": "user-profile" },
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
