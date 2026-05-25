import Link from "next/link";
import { ChatRoom } from "@/api/fetch/chatRoom/types/ChatRoomResponse";
import { ListItemImage, ProfileAvatar } from "@/components";
import { formatCappedNumber, formatDate } from "@/utils";

interface ChatItemProps {
  chatRoom: ChatRoom;
}

const ChatItem = ({ chatRoom }: ChatItemProps) => {
  const { lastMessageSentAt, lastMessage, unreadCount, messageType } = chatRoom;
  const { postId, address, thumbnailUrl, category } = chatRoom.postInfo;
  const { nickname, profileImageUrl, withdrawn } = chatRoom.contactUser;
  const { roomId } = chatRoom;

  const lastMessageIsImage = lastMessageSentAt && messageType === "IMAGE";
  const displayNickname = withdrawn ? "탈퇴한 회원" : nickname || "닉네임을 불러오지 못했습니다.";
  const displayAddress = address || "위치 정보를 불러오지 못했습니다.";
  const displayDate = formatDate(lastMessageSentAt || "시간 정보가 없습니다.");
  const displayMessage = lastMessageIsImage
    ? "사진"
    : lastMessage || "메시지를 불러오지 못했습니다.";

  return (
    <Link
      href={`/chat/${postId}?roomId=${roomId}`}
      className="flex min-h-[113px] w-full items-center gap-3 border-b border-divider-default px-4 py-6 transition-colors hover:bg-flatGray-25"
    >
      <div className="relative h-[58px] w-[58px] shrink-0" aria-hidden="true">
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
              <span className="sr-only">읽지 않은 메시지 </span>
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
