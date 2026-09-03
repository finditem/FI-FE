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
        ({
          type,
          symbolImage,
          symbolSize,
          bgColor,
          emphasis,
          rest,
          subtitle,
          emphasisClass,
          restClass,
          subtitleClass,
        }) => {
          return (
            <Link
              href={`/list?type=${type}`}
              key={type}
              aria-label={t(`${type}AriaLabel`)}
              className={cn(
                "relative flex h-[114px] w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl p-4",
                "tablet:h-[120px] tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6 tablet:py-8",
                bgColor
              )}
              onDragStart={(e) => e.preventDefault()}
            >
              <span className="flex flex-col gap-1 tablet:w-[191px]">
                <span
                  className={cn(
                    "text-h2-bold leading-tight tablet:text-[24px] tablet:leading-[1.5]",
                    restClass
                  )}
                >
                  <span className={emphasisClass}>{emphasis}</span>
                  {rest}
                </span>
                <span
                  className={cn("hidden text-[12px] leading-[1.33] tablet:block", subtitleClass)}
                >
                  {subtitle}
                </span>
              </span>
              <Image
                draggable={false}
                src={symbolImage}
                alt=""
                width={symbolSize.width}
                height={symbolSize.height}
                className={cn(
                  "absolute bottom-3 right-[14px] h-[47px] w-auto",
                  "tablet:static tablet:h-[56px] tablet:shrink-0",
                  type === "lost" && "tablet:drop-shadow-[0_1.875px_0.938px_rgba(0,0,0,0.12)]"
                )}
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
