import { PostFilterChipValue } from "../_types/PostFilterChipValue";

export const FILTER_ITEMS = [
  {
    label: "모두보기",
    value: "all",
  },
  {
    label: "분실물만",
    value: "lost",
  },
  {
    label: "발견물만",
    value: "find",
  },
  {
    label: "카테고리",
    value: "category",
  },
];

type FilterItemValue = PostFilterChipValue | "category";

export const POST_FILTER_ITEMS = FILTER_ITEMS.filter(
  (item): item is { label: string; value: PostFilterChipValue } => item.value !== "category"
);

export const CATEGORY_FILTER_ITEM = FILTER_ITEMS.find(
  (item): item is { label: string; value: "category" } => item.value === "category"
) ?? { label: "카테고리", value: "category" as FilterItemValue };

export const CATEGORY_FILTER_DROPDOWN_MIN_WIDTH_PX = 107;
