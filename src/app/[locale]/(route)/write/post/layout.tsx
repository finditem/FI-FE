import { ReactNode } from "react";
import type { Metadata } from "next";
import { PostWriteFormProvider } from "./location/_components";

export const metadata: Metadata = {
  other: { "page-type": "write-post" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <PostWriteFormProvider>{children}</PostWriteFormProvider>;
};

export default Layout;
