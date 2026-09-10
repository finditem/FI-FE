"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/constants";
import { CATEGORY, FEED_PARAM, FEED_PARAM_VALUE, POST_TYPE } from "../../_components/HOME_CONST";
import { PostFilterChipValue } from "../../_types/PostFilterChipValue";

const getSelectedPostFilterFromQuery = (postType: string | null): PostFilterChipValue => {
  if (postType === "lost") return "lost";
  if (postType === "find") return "find";
  return "all";
};

const useHomeFilterQuery = () => {
  const t = useTranslations("FilterItems");
  const tFilterOptions = useTranslations("FilterOptions");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const postTypeParam = searchParams.get(POST_TYPE)?.toLowerCase() ?? null;
  const categoryParam = searchParams.get(CATEGORY)?.toUpperCase() ?? "";

  const selectedPostFilter = getSelectedPostFilterFromQuery(postTypeParam);
  const selectedCategoryOption = CATEGORY_OPTIONS.find((option) => option.value === categoryParam);
  const isCategorySelected = !!selectedCategoryOption;
  const categoryFilterLabel = selectedCategoryOption
    ? tFilterOptions(`category.${selectedCategoryOption.value}`)
    : t("category");

  const replaceQuery = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setFilterQuery = (key: typeof POST_TYPE | typeof CATEGORY, value?: string) => {
    // "모두보기"(POST_TYPE=all)를 타입 필터가 이미 없는 상태에서 다시 누른 경우.
    // 첫 클릭은 타입 필터만 해제해 통합 피드로 두고, 이 재클릭에서 feed 파라미터까지 지워
    // 피드 시트를 닫고 메인 시트로 돌아간다. 카테고리 필터가 남아 있으면 시트를 유지한다.
    const isRepeatedPostTypeReset =
      key === POST_TYPE && (!value || value === "all") && !postTypeParam;

    replaceQuery((params) => {
      const shouldDelete = !value || (key === POST_TYPE && value === "all");

      if (shouldDelete) {
        params.delete(key);
      } else {
        params.set(key, key === CATEGORY ? value.toLowerCase() : value);
      }

      if (
        isRepeatedPostTypeReset &&
        params.get(FEED_PARAM) === FEED_PARAM_VALUE &&
        !params.get(CATEGORY)
      ) {
        params.delete(FEED_PARAM);
      }
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
