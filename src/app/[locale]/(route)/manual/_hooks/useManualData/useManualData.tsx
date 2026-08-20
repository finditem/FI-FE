import { useTranslations } from "next-intl";
import { MANUAL_DATA } from "../../_components/MANUAL_CONST";
import type { ManualItemType, ManualKey } from "../../_types/ManualType";

const useManualData = (group: ManualKey): ManualItemType[] => {
  const t = useTranslations("ManualData");

  return MANUAL_DATA[group].map((item) => ({
    ...item,
    title: t(`${group}.${item.id}.title`),
    content: t.rich(`${group}.${item.id}.content`, { br: () => <br /> }),
    btnText: item.href ? t(`${group}.${item.id}.btnText`) : undefined,
  }));
};

export default useManualData;
