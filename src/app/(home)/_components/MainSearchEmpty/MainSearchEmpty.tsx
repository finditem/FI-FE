import { Button, Icon } from "@/components/common";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { BUTTON_DEFAULT_STYLE, WRITE_BUTTONS } from "./WRITE_BUTTONS";

const MainSearchEmpty = () => {
  return (
    <div className="w-full gap-5 pt-5 flex-col-center">
      <div className="h-[54px] w-[54px] rounded-full border-[2.8px] border-white/30 backdrop-blur-[11.19px] bg-fill-brand-subtle-pressed flex-center">
        <Icon name="MainSearchWarning" size={48} className="mt-1" />
      </div>
      <div className="gap-2 flex-col-center">
        <p className="text-h2-bold text-layout-header-default">
          검색한 위치에 등록된 분실물이 없어요
        </p>
        <span className="text-body2-regular text-layout-body-default">
          직접 글을 올려 찾아줘에 등록할 수 있어요
        </span>
      </div>

      <div className="w-full space-y-4">
        {WRITE_BUTTONS.map((button) => (
          <Button
            key={button.label}
            as={Link}
            href={button.href}
            ignoreBase
            className={cn(BUTTON_DEFAULT_STYLE, button.style)}
          >
            {button.label}
            <Image
              src={button.icon}
              alt=""
              width={50}
              height={70}
              className="absolute -top-1 left-0"
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MainSearchEmpty;
