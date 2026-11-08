"use client";

import { useTranslations } from "next-intl";
import { Filter, EmptyState, LoadingState } from "@/components";
import ChatItem from "../ChatItem/ChatItem";
import { useSearchParams } from "next/navigation";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import useChatFilterOptions from "../../_hooks/useChatFilterOptions/useChatFilterOptions";
import { useChatList } from "@/api/fetch/chatRoom";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";

interface DefaultChatListProps {
  searchUpdateQuery: (key: string, value?: string) => void;
}

const DefaultChatList = ({ searchUpdateQuery }: DefaultChatListProps) => {
  const t = useTranslations("DefaultChatList");
  const filterOptions = useChatFilterOptions();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region");
  const regionDisplayText = selectedRegion || t("regionPlaceholder");
  const {
    data: chatList,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
  } = useChatList();
  const { ref: chatListRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      <div className="flex gap-2 px-5 py-[14px] no-scrollbar">
        <Filter
          ariaLabel={regionDisplayText}
          onSelected={!!selectedRegion}
          icon={{ name: "Location", size: 16 }}
          iconPosition="leading"
          onClick={() => searchUpdateQuery("search", "region")}
        >
          {regionDisplayText}
        </Filter>
        {filterOptions.map((option) => (
          <FilterDropdown key={option.keyName} {...option} searchUpdateQuery={searchUpdateQuery} />
        ))}
      </div>

      {isLoading && <LoadingState title={t("loadingTitle")} />}
      {chatList?.length !== 0 ? (
        chatList?.map((chatRoom) => <ChatItem key={chatRoom.roomId} chatRoom={chatRoom} />)
      ) : (
        <EmptyState
          icon={{ iconName: "ChatListEmpty", iconSize: 90 }}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      )}

      {hasNextPage && <div ref={chatListRef} className="h-[100px]" />}
    </>
  );
};

export default DefaultChatList;
