import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import useLostFindActionData from "../../../../_hooks/useLostFindActionData/useLostFindActionData";

const LostFindActions = () => {
  const t = useTranslations("LostFindActions");
  const lostFindActionData = useLostFindActionData();

  return (
    <div className="flex w-full gap-4">
      {lostFindActionData.map(
        ({ type, symbolImage, symbolSize, bgColor, emphasis, rest, emphasisClass, restClass }) => {
          return (
            <Link
              href={`/list?type=${type}`}
              key={type}
              aria-label={t(`${type}AriaLabel`)}
              className={cn(
                "relative h-[114px] w-full min-w-0 flex-1 overflow-hidden rounded-2xl",
                bgColor
              )}
              onDragStart={(e) => e.preventDefault()}
            >
              <span className={cn("absolute left-4 top-4 text-h2-bold leading-tight", restClass)}>
                <span className={emphasisClass}>{emphasis}</span>
                {rest}
              </span>
              <Image
                draggable={false}
                src={symbolImage}
                alt=""
                width={symbolSize.width}
                height={symbolSize.height}
                className="absolute bottom-3 right-[14px]"
                priority
              />
            </Link>
          );
        }
      )}
    </div>
  );
};

export default LostFindActions;
