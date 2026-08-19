import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { ChatLayoutClient } from "./_components";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChatListLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "chat-list" },
  };
}

const Layout = ({ children }: { children: ReactNode }) => {
  return <ChatLayoutClient>{children}</ChatLayoutClient>;
};

export default Layout;
