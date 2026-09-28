"use client";

import {
  Icon,
  ReportModal,
  PostReportBlockActions,
  BlockUserModal as UserBlockModal,
  PostFoundConfirmModal,
} from "@/components";
import { cn } from "@/utils";
import { useState } from "react";
import { InfoButtonOptionValue } from "../../_types/InfoButtonOptionValue";
import useLeaveChatRoom from "@/api/fetch/chatRoom/api/useLeaveChatRoom";
import { useGetDetailPost } from "@/api/fetch/post";
import { useClickOutside } from "@/hooks";
import ChatLeaveModal from "./_internal/ChatLeaveModal";
import useInfoOptions from "../../_hooks/useInfoOptions/useInfoOptions";
import { useTranslations } from "next-intl";

const MenuItem = ({
  infoOptions,
  onOptionClick,
}: {
  infoOptions: ReturnType<typeof useInfoOptions>;
  onOptionClick: (value: InfoButtonOptionValue) => void;
}) => {
  return (
    <ul className="absolute right-0 top-10 z-10 m-0 list-none p-0" role="menu">
      {infoOptions.map(({ value, label, textColor, position, icon }) => {
        return (
          <li key={value} role="menuitem">
            <button
              type="button"
              aria-label={label}
              onClick={() => onOptionClick(value)}
              className={cn(
                "glass-card flex w-full items-center gap-2 text-nowrap border border-white bg-white/50 px-7 py-4 text-left text-h3-medium transition-colors hover:bg-white/70",
                textColor,
                position === "first" && "rounded-t-[20px]",
                position === "last" && "rounded-b-[20px]"
              )}
            >
              <Icon name={icon} size={20} />
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const ReportBlockSheet = ({
  onOpenReport,
  onOpenBlock,
}: {
  onOpenReport: () => void;
  onOpenBlock: () => void;
}) => {
  return (
    <div
      role="menu"
      className="glass-card absolute right-0 top-10 z-10 w-[202px] overflow-hidden rounded-[20px] border border-white bg-white/50"
    >
      <PostReportBlockActions onOpenReport={onOpenReport} onOpenBlock={onOpenBlock} />
    </div>
  );
};

interface ChatRoomHeaderInfoButtonProps {
  roomId: number;
  postId: number;
  opponentUserId: number;
}

const ChatRoomHeaderInfoButton = ({
  roomId,
  postId,
  opponentUserId,
}: ChatRoomHeaderInfoButtonProps) => {
  const t = useTranslations("ChatRoomHeaderInfoButton");
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [reportBlockOpen, setReportBlockOpen] = useState(false);
  const [leaveChatRoomModalOpen, setLeaveChatRoomModalOpen] = useState(false);
  const [foundConfirmOpen, setFoundConfirmOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const containerRef = useClickOutside(() => {
    setChatMenuOpen(false);
    setReportBlockOpen(false);
  });
  const { mutate: leaveChatRoom } = useLeaveChatRoom(roomId);
  const { data: postDetail } = useGetDetailPost({ id: postId });
  const isMine = postDetail?.result.isMine ?? false;
  const infoOptions = useInfoOptions(isMine);

  const handleMenuButtonClick = () => {
    setChatMenuOpen((prev) => !prev);
    setReportBlockOpen(false);
  };

  const handleOptionClick = (value: InfoButtonOptionValue) => {
    if (value === "changeToFound") {
      setFoundConfirmOpen(true);
      setChatMenuOpen(false);
      return;
    }
    if (value === "reportBlock") {
      setReportBlockOpen(true);
      return;
    }
    setLeaveChatRoomModalOpen(true);
    setChatMenuOpen(false);
  };

  const handleOpenReport = () => {
    setReportOpen(true);
    setReportBlockOpen(false);
    setChatMenuOpen(false);
  };

  const handleOpenBlock = () => {
    setBlockOpen(true);
    setReportBlockOpen(false);
    setChatMenuOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className="relative">
        <button
          className="flex h-10 w-10 items-center justify-end"
          aria-label={t("menuAriaLabel")}
          type="button"
          onClick={handleMenuButtonClick}
        >
          <Icon name="Information" size={18} />
        </button>
        {chatMenuOpen &&
          (reportBlockOpen ? (
            <ReportBlockSheet onOpenReport={handleOpenReport} onOpenBlock={handleOpenBlock} />
          ) : (
            <MenuItem infoOptions={infoOptions} onOptionClick={handleOptionClick} />
          ))}
      </div>

      <PostFoundConfirmModal
        isOpen={foundConfirmOpen}
        onClose={() => setFoundConfirmOpen(false)}
        postId={postId}
        roomId={roomId}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetId={roomId}
        targetType="CHAT"
        invalidateKeys={[["chatRoom", roomId], ["posts"], ["user-block-list"]]}
      />

      <UserBlockModal
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        writerId={opponentUserId}
      />

      <ChatLeaveModal
        isOpen={leaveChatRoomModalOpen}
        onClose={() => setLeaveChatRoomModalOpen(false)}
        onConfirm={() => leaveChatRoom(undefined)}
        onCancel={() => setLeaveChatRoomModalOpen(false)}
      />
    </>
  );
};

export default ChatRoomHeaderInfoButton;
