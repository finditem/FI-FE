import { useTranslations } from "next-intl";
import { ACCOUNT_ROUTE } from "../../_constants/ACCOUNT_ROUTE";

export const useAccountRoute = () => {
  const t = useTranslations("AccountContainer");

  return ACCOUNT_ROUTE.map((item) => ({
    ...item,
    pageName: t(item.key),
  }));
};
