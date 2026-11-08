import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PostWriteMenu } from "./_components";

export const metadata: Metadata = {
  other: { "page-type": "list" },
};

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}
      <PostWriteMenu />
    </>
  );
};

export default Layout;
