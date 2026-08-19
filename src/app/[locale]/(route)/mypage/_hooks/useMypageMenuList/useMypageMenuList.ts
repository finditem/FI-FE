import { useTranslations } from "next-intl";
import { MYPAGE_MENU_LIST } from "../../_constants/MYPAGE_ROUTE_CONFIG";

export const useMypageMenuList = () => {
  const t = useTranslations("MyPageMenu");

  return MYPAGE_MENU_LIST.map((menu) => ({
    key: menu.key,
    title: t(menu.key),
    pages: menu.pages.map((page) => ({
      key: page.key,
      pageName: t(page.key),
      pageLink: page.pageLink,
    })),
  }));
};
