import { SimpleSortType } from "@/types";
import { CommentFilterState } from "../_types/commentFilterType";

export const COMMENT_DEFAULT_FILTERS: CommentFilterState = {
  startDate: "",
  endDate: "",
  simpleSort: "LATEST",
};

export const SIMPLE_SORT_LABEL_KEY_MAP = {
  LATEST: "latest",
  OLDEST: "oldest",
} as const satisfies Record<SimpleSortType, "latest" | "oldest">;

export const SORT_KEBAB_ITEM: {
  labelKey: (typeof SIMPLE_SORT_LABEL_KEY_MAP)[SimpleSortType];
  value: SimpleSortType;
}[] = [
  { labelKey: "latest", value: "LATEST" },
  { labelKey: "oldest", value: "OLDEST" },
];
