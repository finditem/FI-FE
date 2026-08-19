import { useTranslations } from "next-intl";
import { IconName } from "@/components";
import { MYPAGE_TAP_CONFIG } from "../../_constants/MYPAGE_ROUTE_CONFIG";
import { MyPageTapType } from "../../_types/MyPageTapType";

export const useMypageTapConfig = (): {
  key: MyPageTapType;
  pageName: string;
  iconName: IconName;
  pageLink: string;
}[] => {
  const t = useTranslations("MyPageMenu");

  return MYPAGE_TAP_CONFIG.map((item) => ({
    key: item.key,
    pageName: t(item.key),
    iconName: item.iconName,
    pageLink: item.pageLink,
  }));
};
