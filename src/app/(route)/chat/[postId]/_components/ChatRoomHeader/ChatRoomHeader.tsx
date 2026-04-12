"use client";

import { Icon, ListItemImage } from "@/components/common";
import ChatChip from "../ChatChip/ChatChip";
import ChatRoomHeaderInfoButton from "../ChatRoomHeaderInfoButton/ChatRoomHeaderInfoButton";
import { ChatRoomResponse } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import Link from "next/link";
import { ReactNode } from "react";

interface LinkWrapperProps {
  deleted: boolean;
  children: ReactNode;
  href: string;
}

interface ChatRoomHeaderProps {
  chatRoom: ChatRoomResponse | undefined;
  roomId: number;
  currentUserId?: number;
}

const LinkWrapper = ({ deleted, children, href }: LinkWrapperProps) => {
  return (
    <>
      {deleted ? (
        <div className="flex select-none items-center gap-4 px-4 opacity-30">{children}</div>
      ) : (
        <Link
          href={href}
          aria-label="게시글 상세 페이지 이동"
          className="flex items-center gap-4 px-4"
        >
          {children}
        </Link>
      )}
    </>
  );
};

const NICK_NAME_STYLE = "text-body2-semibold text-layout-body-default";

const ChatRoomHeader = ({ chatRoom, roomId, currentUserId }: ChatRoomHeaderProps) => {
  if (!chatRoom) return null;
  const { address, postType, title, thumbnailUrl, postId, category, postStatus, deleted } =
    chatRoom.postInfo;
  const { nickname, opponentUserId } = chatRoom.opponentUser;
  const isOwnPostChatRoom = currentUserId === opponentUserId;

  return (
    <header className="pb-3">
      <nav className="flex items-center justify-between px-4 py-1">
        <Link
          replace
          href="/chat"
          className="flex h-10 w-10 items-center"
          aria-label="뒤로 가기 버튼"
        >
          <Icon name="ArrowLeftSmall" size={18} className="text-neutral-normal-default" />
        </Link>

        {isOwnPostChatRoom ? (
          <p className={NICK_NAME_STYLE}>{nickname}</p>
        ) : (
          <Link
            href={`/user/${opponentUserId}`}
            aria-label="상대방 프로필 이동"
            className={NICK_NAME_STYLE}
          >
            {nickname}
          </Link>
        )}

        <ChatRoomHeaderInfoButton roomId={roomId} />
      </nav>

      <LinkWrapper deleted={deleted} href={`/list/${postId}`}>
        <div className="shrink-0">
          <ListItemImage
            alt="채팅방 게시글 썸네일"
            size={40}
            src={thumbnailUrl}
            category={category}
            className="rounded-[4px]"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1">
            <ChatChip postMode={postType} postStatus={postStatus} />
            <h2 className="truncate text-body1-semibold text-layout-header-default">
              {deleted ? `삭제됨 ${title}` : title}
            </h2>
          </div>
          <p className="min-h-4 text-caption1-medium text-layout-body-default">{address}</p>
        </div>
      </LinkWrapper>
    </header>
  );
};

export default ChatRoomHeader;
