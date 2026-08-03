import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "알림",
  description: "찾아줘에서 나에게 온 알림을 확인해보세요.",
  other: { "page-type": "alert" },
};

const layout = ({ children }: { children: ReactNode }) => {
  return <div className="h-f-base">{children}</div>;
};

export default layout;
