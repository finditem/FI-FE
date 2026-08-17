import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import Image from "next/image";

interface ChatImageButtonProps {
  src: string;
  width: number;
  height: number;
  colSpan?: number;
  index: number;
  onClick: (index: number) => void;
}

const ChatImageButton = ({ src, width, height, colSpan, index, onClick }: ChatImageButtonProps) => {
  const t = useTranslations("ChatImageButton");

  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      className={cn("block overflow-hidden rounded-lg", colSpan === 2 && "col-span-2")}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={t("imageAlt", { index: index + 1 })}
        className="object-cover"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </button>
  );
};

export default ChatImageButton;
