import { useEffect } from "react";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { ChatListType, ChatRoom } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import QUERY_PARAMS from "./QUERY_PARAMS";

interface useChatListOptions {
  size?: number;
  enabled?: boolean;
}

const useChatList = (options: useChatListOptions = {}) => {
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const t = useTranslations("useChatList");
  const { size = 10, enabled = true } = options;

  const type = QUERY_PARAMS.type.transform(searchParams.get(QUERY_PARAMS.type.key));
  const typeQuery = (type as unknown as string) === "ALL" ? "" : type;
  const address = QUERY_PARAMS.address.transform(searchParams.get(QUERY_PARAMS.address.key));
  const sort = QUERY_PARAMS.sort.transform(searchParams.get(QUERY_PARAMS.sort.key));

  const result = useAppInfiniteQuery<ApiBaseResponseType<ChatListType>, unknown, ChatRoom[]>(
    "auth",
    ["chatList", size, type, address, sort],
    `/users/me/chats?size=${size}&type=${typeQuery}&address=${QUERY_PARAMS.address.transform(address)}&sort=${QUERY_PARAMS.sort.transform(sort)}`,
    {
      enabled,
      select: (data) => data.pages.flatMap((page) => page.result.chatRooms),
    }
  );

  useEffect(() => {
    if (result.isError) {
      addToast(t("loadError"), "error");
    }
  }, [result.isError, addToast, t]);

  return result;
};

export default useChatList;
