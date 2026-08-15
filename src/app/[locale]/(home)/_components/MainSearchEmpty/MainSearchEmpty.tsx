import { useTranslations } from "next-intl";
import { Button, Icon } from "@/components";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { BUTTON_DEFAULT_STYLE } from "../HOME_CONST";
import useWriteButtons from "../../_hooks/useWriteButtons/useWriteButtons";

const MainSearchEmpty = () => {
  const t = useTranslations("MainSearchEmpty");
  const writeButtons = useWriteButtons();

  return (
    <div className="w-full gap-5 pt-5 flex-col-center">
      <div className="h-[54px] w-[54px] rounded-full border-[2.8px] border-white/30 backdrop-blur-[11.19px] bg-fill-brand-subtle-pressed flex-center">
        <Icon name="MainSearchWarning" size={48} className="mt-1" />
      </div>
      <div className="gap-2 flex-col-center">
        <p className="text-h2-bold text-layout-header-default">{t("emptyTitle")}</p>
        <span className="text-body2-regular text-layout-body-default">{t("emptyDescription")}</span>
      </div>

      <div className="w-full space-y-4">
        {writeButtons.map((button) => (
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
