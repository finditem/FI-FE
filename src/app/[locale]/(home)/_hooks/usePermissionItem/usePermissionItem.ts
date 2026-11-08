import { useTranslations } from "next-intl";
import { PERMISSION_ITEM } from "../../_components/HOME_CONST";

const usePermissionItem = () => {
  const t = useTranslations("PermissionItem");

  return PERMISSION_ITEM.map((item) => ({
    ...item,
    title: t(`${item.type}Title`),
    description: t(`${item.type}Description`),
  }));
};

export default usePermissionItem;
