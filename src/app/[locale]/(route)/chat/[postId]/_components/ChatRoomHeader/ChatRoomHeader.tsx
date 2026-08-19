"use client";

import { useTranslations } from "next-intl";
import { Icon, ListItemImage } from "@/components";
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
  withdrawn: boolean;
}

const LinkWrapper = ({ deleted, children, href }: LinkWrapperProps) => {
  const t = useTranslations("ChatRoomHeader");

  return (
    <>
      {deleted ? (
        <div className="flex select-none items-center gap-4 px-4 opacity-30">{children}</div>
      ) : (
        <Link
          href={href}
          aria-label={t("postLinkAriaLabel")}
          className="flex items-center gap-4 px-4"
        >
          {children}
        </Link>
      )}
    </>
  );
};

const NICK_NAME_STYLE = "text-body2-semibold text-layout-body-default";

const ChatRoomHeader = ({ chatRoom, roomId, currentUserId, withdrawn }: ChatRoomHeaderProps) => {
  const t = useTranslations("ChatRoomHeader");
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
          aria-label={t("backAriaLabel")}
        >
          <Icon name="ArrowLeftSmall" size={18} className="text-neutral-normal-default" />
        </Link>

        {isOwnPostChatRoom || withdrawn ? (
          <p className={NICK_NAME_STYLE}>{withdrawn ? t("withdrawnUser") : nickname}</p>
        ) : (
          <Link
            href={`/user/${opponentUserId}`}
            aria-label={t("profileAriaLabel")}
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
            alt={t("thumbnailAlt")}
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
              {deleted && !withdrawn ? t("deletedTitle", { title }) : title}
            </h2>
          </div>
          <p className="min-h-4 text-caption1-medium text-layout-body-default">{address}</p>
        </div>
      </LinkWrapper>
    </header>
  );
};

export default ChatRoomHeader;
