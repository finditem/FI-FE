export const PUBLIC_DEFAULT_TABS = [
  { label: "지역", value: "region" },
  { label: "카테고리", value: "category" },
];

export const PUBLIC_DEFAULT_FILTERS = {
  publicRegion: "",
  publicCategory: "",
};

export const SEARCH_PATH = {
  lost: "/public-data/lost/search",
  found: "/public-data/found/search",
} as const;
