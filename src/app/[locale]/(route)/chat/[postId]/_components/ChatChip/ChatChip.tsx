import { cn } from "@/utils";
import { ChatChipMode } from "../CHATROOM_CONST";
import { ItemStatus, PostType } from "@/types";
import useChatChipMode from "../../_hooks/useChatChipMode/useChatChipMode";

const CHIP_BASE_CLASS = "shrink-0 rounded text-caption2-semibold flex-center";

interface ChatChipProps {
  postMode: PostType;
  postStatus?: ItemStatus;
}

const ChatChip = ({ postMode, postStatus }: ChatChipProps) => {
  const chatChipMode = useChatChipMode();
  const chipMode: ChatChipMode = postMode === "FOUND" ? "FIND" : "LOST";
  const typeChipConfig = chatChipMode[chipMode];
  const foundStatusConfig = chatChipMode.FOUND_STATUS;

  return (
    <>
      <span role="note" className={cn("h-[18px] w-10", CHIP_BASE_CLASS, typeChipConfig.style)}>
        {typeChipConfig.text}
      </span>
      {postStatus === "FOUND" && (
        <span role="note" className={cn(CHIP_BASE_CLASS, foundStatusConfig.style)}>
          {foundStatusConfig.text}
        </span>
      )}
    </>
  );
};

export default ChatChip;
