"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";
import { EMPTY_ICON_MAP } from "./_constants/EMPTY_CONSTANTS";

interface MypageEmptyUIProps {
  pageType: "posts" | "comments" | "reports" | "inquiries" | "activity" | "favorites";
}

const MypageEmptyUI = ({ pageType }: MypageEmptyUIProps) => {
  const t = useTranslations("MypageEmptyUI");

  return (
    <div className="gap-5 py-20 text-center flex-col-center">
      <Icon
        name={EMPTY_ICON_MAP[pageType]}
        size={70}
        className={pageType == "activity" ? "w-[160px]" : ""}
      />
      <h2 className="text-h2-bold text-layout-header-default">{t(`${pageType}.heading`)}</h2>
      <p className="whitespace-pre-line text-body2-regular text-layout-body-default">
        {t(`${pageType}.body`)}
      </p>
    </div>
  );
};

export default MypageEmptyUI;
