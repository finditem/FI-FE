import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "채팅방 | 찾아줘! 채팅",
  description: "찾아줘에서 진행 중인 채팅을 확인해보세요.",
  other: { "page-type": "chat-room" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default layout;
