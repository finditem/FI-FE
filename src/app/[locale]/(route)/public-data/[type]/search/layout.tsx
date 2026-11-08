import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  other: { "page-type": "public-data-search" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default layout;
