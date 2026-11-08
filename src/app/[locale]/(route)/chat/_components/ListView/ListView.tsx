"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { DetailHeader, LoadingState } from "@/components";
import { useSearchUpdateQueryString } from "@/hooks";
import DefaultChatList from "../DefaultChatList/DefaultChatList";
import { useChatSocket } from "@/api/fetch/chatRoom/api/useChatSocket";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

const ListSearch = dynamic(() => import("../ListSearch/ListSearch"), {
  loading: () => {
    const t = useTranslations("ListView");
    return <LoadingState title={t("regionSearchLoading")} />;
  },
});

const ListViewContent = () => {
  const t = useTranslations("ListView");
  const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString("push");
  const queryClient = useQueryClient();

  useChatSocket({
    onListUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
    },
  });

  return (
    <>
      <DetailHeader title={searchMode === "region" ? t("regionTitle") : t("chatTitle")} />

      <h1 className="sr-only">{t("pageHeading")}</h1>
      {searchMode === "default" ? (
        <DefaultChatList searchUpdateQuery={searchUpdateQuery} />
      ) : (
        <ListSearch />
      )}
    </>
  );
};

const ListView = () => {
  return (
    <Suspense fallback="">
      <div className="w-full h-f-base">
        <ListViewContent />
      </div>
    </Suspense>
  );
};

export default ListView;
