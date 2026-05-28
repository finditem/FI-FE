"use client";

import dynamic from "next/dynamic";
import { DetailHeader, LoadingState } from "@/components";
import { useSearchUpdateQueryString } from "@/hooks";
import DefaultChatList from "../DefaultChatList/DefaultChatList";
import { useChatSocket } from "@/api/fetch/chatRoom/api/useChatSocket";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense } from "react";

const ListSearch = dynamic(() => import("../ListSearch/ListSearch"), {
  loading: () => <LoadingState title="지역 검색 불러오는 중..." />,
});

const ListViewContent = () => {
  const { searchMode, searchUpdateQuery } = useSearchUpdateQueryString("replace");
  const queryClient = useQueryClient();

  useChatSocket({
    onListUpdate: () => {
      queryClient.invalidateQueries({ queryKey: ["chatList"] });
    },
  });

  return (
    <>
      <DetailHeader title={searchMode === "region" ? "지역 선택" : "채팅"} />

      <h1 className="sr-only">채팅 목록 페이지</h1>
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
