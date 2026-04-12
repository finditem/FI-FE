export const ACTIVITY_OPTIONS = [
  { value: undefined, label: "전체" },
  { value: "POST", label: "게시글" },
  { value: "COMMENT", label: "댓글" },
  { value: "FAVORITE", label: "즐겨찾기" },
  { value: "INQUIRY", label: "1:1 문의" },
  { value: "REPORT", label: "신고" },
] as const;
