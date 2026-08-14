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
        ({ type, title, positionImage, markImage, bagImage, messageImage, bgColor }) => {
          const { src, size } = markImage;

          return (
            <Link
              href={`/list?type=${type}`}
              key={type}
              aria-label={t(`${type}AriaLabel`)}
              className={cn(
                "relative h-[106px] w-full min-w-0 flex-1 overflow-hidden rounded-2xl",
                bgColor
              )}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image draggable={false} src={positionImage} alt="" width={50} height={70} priority />
              <Image
                draggable={false}
                src={messageImage}
                alt=""
                width={58}
                height={52}
                className="absolute bottom-3 left-4"
                priority
              />
              <Image
                draggable={false}
                src={src}
                alt=""
                width={size.width}
                height={size.height}
                className="absolute right-[18px] top-5 z-10"
                priority
              />
              <Image
                draggable={false}
                src={bagImage}
                alt=""
                width={57.69}
                height={42.18}
                className="absolute bottom-5 right-[14px]"
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
