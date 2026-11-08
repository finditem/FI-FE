import { ReactNode } from "react";
import type { Metadata } from "next";
import { ScrollToTopButton } from "@/components";

export const metadata: Metadata = {
  other: { "page-type": "public-data-list" },
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
