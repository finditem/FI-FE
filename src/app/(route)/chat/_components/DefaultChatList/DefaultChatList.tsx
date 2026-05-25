"use client";

import { Filter, EmptyState, LoadingState } from "@/components";
import ChatItem from "../ChatItem/ChatItem";
import { useSearchParams } from "next/navigation";
import FilterDropdown from "../FilterDropdown/FilterDropdown";
import { FilTER_DROPDOWN_OPTIONS } from "../../constants/FILTER";
import { useChatList } from "@/api/fetch/chatRoom";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll/useInfiniteScroll";

interface DefaultChatListProps {
  searchUpdateQuery: (key: string, value?: string) => void;
}

const DefaultChatList = ({ searchUpdateQuery }: DefaultChatListProps) => {
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region");
  const regionDisplayText = selectedRegion || "지역 선택";
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
        {FilTER_DROPDOWN_OPTIONS.map((option) => (
          <FilterDropdown key={option.keyName} {...option} searchUpdateQuery={searchUpdateQuery} />
        ))}
      </div>

      {isLoading && <LoadingState title="채팅 목록 불러오는 중..." />}
      {chatList?.length !== 0 ? (
        chatList?.map((chatRoom) => <ChatItem key={chatRoom.roomId} chatRoom={chatRoom} />)
      ) : (
        <EmptyState
          icon={{ iconName: "ChatListEmpty", iconSize: 90 }}
          title="아직 채팅 내역이 없어요"
          description="채팅이 시작되면 여기에 채팅 목록이 표기돼요."
        />
      )}

      {hasNextPage && <div ref={chatListRef} className="h-[100px]" />}
    </>
  );
};

export default DefaultChatList;
