// TODO(준열): 타이틀과 서브타이틀의 타이포그래피를 임의값에서 디자인 토큰으로 교체한다.
// 현재 타이틀은 `tablet:text-[24px] tablet:leading-[1.5]`, 서브타이틀은 `text-[12px] leading-[1.33]`로
// 하드코딩되어 있다. 서브타이틀은 `text-caption1-regular`로 대체 가능하고, 타이틀은 크기가 `h1-bold`와
// 같지만 줄 높이가 토큰(110%)과 달라 `tablet:text-h1-bold tablet:leading-[1.5]` 형태의 정리만 가능하다.
// customFonts.ts의 타이포 토큰 체계와 맞추는 작업으로 별도 진행한다.
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
