import { useTranslations } from "next-intl";
import { SEARCH_HEADER_TITLE_KEYS } from "../../_components/LIST_CONST";

const useSearchHeaderTitle = () => {
  const t = useTranslations("SearchHeaderTitle");

  return Object.fromEntries(SEARCH_HEADER_TITLE_KEYS.map((key) => [key, t(key)])) as Record<
    (typeof SEARCH_HEADER_TITLE_KEYS)[number],
    string
  >;
};

export default useSearchHeaderTitle;
