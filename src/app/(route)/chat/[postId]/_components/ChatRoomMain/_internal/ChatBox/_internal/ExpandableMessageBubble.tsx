import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";

const MAX_MESSAGE_BUBBLE_HEIGHT_PX = 400;

interface ExpandableMessageBubbleProps {
  content: string;
  bubbleColor: string;
  bubbleOrder: string;
}

const ExpandableMessageBubble = ({
  content,
  bubbleColor,
  bubbleOrder,
}: ExpandableMessageBubbleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const bubbleElement = contentRef.current;
    if (!bubbleElement) return;

    setIsOverflowing(bubbleElement.scrollHeight > MAX_MESSAGE_BUBBLE_HEIGHT_PX);
  }, [content]);

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        bubbleOrder === "order-2" ? "items-end" : "items-start",
        bubbleOrder
      )}
    >
      <p
        ref={contentRef}
        className={cn(
          "max-w-[272px] whitespace-pre-wrap break-words rounded-[24px] px-4 py-3",
          bubbleColor,
          !isExpanded && isOverflowing && "overflow-hidden"
        )}
        style={
          !isExpanded && isOverflowing
            ? { maxHeight: `${MAX_MESSAGE_BUBBLE_HEIGHT_PX}px` }
            : undefined
        }
      >
        {content}
      </p>

      {isOverflowing ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          className="text-caption1-medium text-layout-body-default underline"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "숨기기" : "더보기"}
        </button>
      ) : null}
    </div>
  );
};

export default ExpandableMessageBubble;
