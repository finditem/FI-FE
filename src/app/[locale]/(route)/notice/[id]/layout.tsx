import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  other: { "page-type": "notice-detail" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default Layout;
