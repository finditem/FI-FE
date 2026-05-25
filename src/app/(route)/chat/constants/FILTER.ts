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
    options: SORT_OPTIONS,
    keyName: "sort",
  },
  {
    options: TYPE_OPTIONS,
    keyName: "type",
  },
] as const;
