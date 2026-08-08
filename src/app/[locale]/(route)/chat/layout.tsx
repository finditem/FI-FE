import { ReactNode } from "react";
import { ChatLayoutClient } from "./_components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "채팅 목록",
  description: "찾아줘에서 진행 중인 채팅을 확인해보세요.",
  other: { "page-type": "chat-list" },
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
};

export default Layout;
