"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/constants";
import { CATEGORY, POST_TYPE } from "../../_constants/QUERY_PARAMS";
import { PostFilterChipValue } from "../../_types/PostFilterChipValue";

const getSelectedPostFilterFromQuery = (postType: string | null): PostFilterChipValue => {
  if (postType === "lost") return "lost";
  if (postType === "find") return "find";
  return "all";
};

const useHomeFilterQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const postTypeParam = searchParams.get(POST_TYPE)?.toLowerCase() ?? null;
  const categoryParam = searchParams.get(CATEGORY)?.toUpperCase() ?? "";

  const selectedPostFilter = getSelectedPostFilterFromQuery(postTypeParam);
  const selectedCategoryOption = CATEGORY_OPTIONS.find((option) => option.value === categoryParam);
  const isCategorySelected = !!selectedCategoryOption;
  const categoryFilterLabel = selectedCategoryOption?.label ?? "카테고리";

  const replaceQuery = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setFilterQuery = (key: typeof POST_TYPE | typeof CATEGORY, value?: string) => {
    replaceQuery((params) => {
      const shouldDelete = !value || (key === POST_TYPE && value === "all");
      if (shouldDelete) {
        params.delete(key);
        return;
      }

      const normalizedValue = key === CATEGORY ? value.toLowerCase() : value;
      params.set(key, normalizedValue);
    });
  };

  return {
    categoryParam,
    selectedPostFilter,
    isCategorySelected,
    categoryFilterLabel,
    setFilterQuery,
  };
};

export default useHomeFilterQuery;
