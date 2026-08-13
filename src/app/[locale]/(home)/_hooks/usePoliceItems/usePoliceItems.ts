import { useTranslations } from "next-intl";
import { POLICE_ITEMS } from "../../_components/HOME_CONST";

const usePoliceItems = () => {
  const t = useTranslations("PoliceItems");

  return POLICE_ITEMS.map((item) => ({
    ...item,
    headLabel: t(`${item.type}HeadLabel`),
    label: t(`${item.type}Label`),
  }));
};

export default usePoliceItems;
