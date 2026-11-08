import { useTranslations } from "next-intl";
import { SORT_OPTIONS, TYPE_OPTIONS } from "../../_components/CHATLIST_CONST";

const useChatFilterOptions = () => {
  const t = useTranslations("ChatFilterOptions");

  return [
    {
      options: SORT_OPTIONS.map((option) => ({ ...option, label: t(`${option.value}Label`) })),
      keyName: "sort",
    },
    {
      options: TYPE_OPTIONS.map((option) => ({ ...option, label: t(`${option.value}Label`) })),
      keyName: "type",
    },
  ] as const;
};

export default useChatFilterOptions;
