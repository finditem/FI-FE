import { formatKoreanDate } from "@/utils";

interface ChatDateDividerProps {
  createdAt: string;
}

const ChatDateDivider = ({ createdAt }: ChatDateDividerProps) => {
  return (
    <div className="my-4 flex w-full justify-center">
      <span className="rounded-3xl bg-toast px-2 py-1 text-caption2-semibold text-white">
        {formatKoreanDate(createdAt)}
      </span>
    </div>
  );
};

export default ChatDateDivider;
