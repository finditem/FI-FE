import { SimpleSortType } from "@/types";
import { CommentFilterState } from "../_types/commentFilterType";

export const COMMENT_DEFAULT_FILTERS: CommentFilterState = {
  startDate: "",
  endDate: "",
  simpleSort: "LATEST",
};

export const SIMPLE_SORT_LABEL_MAP: Record<SimpleSortType, string> = {
  LATEST: "최신순",
  OLDEST: "오래된순",
};

export const SORT_KEBAB_ITEM: { label: "최신순" | "오래된순"; value: SimpleSortType }[] = [
  { label: "최신순", value: "LATEST" },
  { label: "오래된순", value: "OLDEST" },
];
