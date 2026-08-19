import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ChatRoomLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "chat-detail" },
  };
}

const layout = ({ children }: { children: ReactNode }) => {
  return children;
};

export default layout;
