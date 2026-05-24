export const TYPE_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "발견", value: "found" },
  { label: "분실", value: "lost" },
] as const;

export const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
] as const;

export const FilTER_DROPDOWN_OPTIONS = [
  {
    ariaLabel: "채팅 리스트 최신순",
    options: SORT_OPTIONS,
    buttonText: "최신순",
    keyName: "sort",
  },
  {
    ariaLabel: "채팅 리스트 분실/발견",
    options: TYPE_OPTIONS,
    buttonText: "발견/분실",
    keyName: "type",
  },
] as const;

export const SELECTED_TEXT = {
  oldest: "오래된순",
  latest: "최신순",
  all: "발견/분실",
  found: "발견",
  lost: "분실",
} as const;
