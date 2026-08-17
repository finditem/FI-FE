import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChatRoom } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ListItemImage, ProfileAvatar } from "@/components";
import { formatCappedNumber, formatDate } from "@/utils";

interface ChatItemProps {
  chatRoom: ChatRoom;
}

const ChatItem = ({ chatRoom }: ChatItemProps) => {
  const t = useTranslations("ChatItem");
  const { lastMessageSentAt, lastMessage, unreadCount, messageType } = chatRoom;
  const { postId, address, thumbnailUrl, category } = chatRoom.postInfo;
  const { nickname, profileImageUrl, withdrawn } = chatRoom.contactUser;
  const { roomId } = chatRoom;

  const lastMessageIsImage = lastMessageSentAt && messageType === "IMAGE";
  const displayNickname = withdrawn ? t("withdrawnUser") : nickname || t("nicknameFallback");
  const displayAddress = address || t("addressFallback");
  const displayDate = formatDate(lastMessageSentAt || t("timeFallback"));
  const displayMessage = lastMessageIsImage
    ? t("imageMessage")
    : lastMessage || t("messageFallback");

  return (
    <Link
      href={`/chat/${postId}?roomId=${roomId}`}
      className="flex min-h-[113px] w-full items-center gap-3 border-b border-divider-default px-4 py-6 transition-colors hover:bg-flatGray-25"
    >
      <div className="relative size-[58px] shrink-0" aria-hidden="true">
        <ProfileAvatar
          src={profileImageUrl}
          alt=""
          size={26}
          className="absolute left-0 top-0 z-10 size-[26px] rounded-full border-[1.5px] border-white"
        />
        <div className="absolute bottom-0 right-0 rounded object-cover">
          <ListItemImage alt="" size={50} src={thumbnailUrl} category={category} />
        </div>
      </div>

      <div className="w-full min-w-0 space-y-[2px]">
        <div className="flex items-center justify-between truncate">
          <span className="truncate text-h3-semibold text-layout-header-default">
            {displayNickname}
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-flatGreen-500 px-[5.5px] py-[1.5px] text-caption2-semibold text-white flex-center">
              <span className="sr-only">{t("unreadSrLabel")}</span>
              {formatCappedNumber(unreadCount)}
            </span>
          )}
        </div>
        <div className="flex truncate text-caption1-medium text-layout-body-default">
          <span className="truncate">{displayAddress}</span>
          <time dateTime={displayDate} className="flex-shrink-0 before:mx-1 before:content-['·']">
            {displayDate}
          </time>
        </div>
        <p className="truncate text-body2-medium text-layout-header-default">{displayMessage}</p>
      </div>
    </Link>
  );
};

export default ChatItem;
