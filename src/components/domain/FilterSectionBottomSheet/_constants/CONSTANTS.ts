export const tabs = [
  { label: "지역", value: "region" },
  { label: "카테고리", value: "category" },
  { label: "정렬", value: "sort" },
  { label: "찾음 여부", value: "status" },
] as const;

export const categoryValues = [
  undefined,
  "ELECTRONICS",
  "WALLET",
  "ID_CARD",
  "JEWELRY",
  "BAG",
  "CARD",
  "ETC",
] as const;

export const sortValues = ["LATEST", "OLDEST", "MOST_FAVORITED", "MOST_VIEWED"] as const;

export const findStatusValues = [undefined, "SEARCHING", "FOUND"] as const;

export const statusValues = [undefined, "LOST", "FOUND"] as const;
