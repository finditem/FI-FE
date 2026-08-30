import { PostFilterChipValue } from "../_types/PostFilterChipValue";

export const LOST_FIND_ACTION_DATA = [
  {
    type: "lost",
    symbolImage: "/main/LostFindActions/home-lost-icon.svg",
    symbolSize: { width: 70, height: 47 },
    bgColor: "bg-fill-accent-lostItem",
    emphasisClass: "text-[#332C29]",
    restClass: "text-[#786863]",
  },
  {
    type: "found",
    symbolImage: "/main/LostFindActions/home-found-icon.svg",
    symbolSize: { width: 62, height: 47 },
    bgColor: "bg-[#C2F1D4]/45",
    emphasisClass: "text-[#29322D]",
    restClass: "text-[#81998A]",
  },
] as const;

export const POLICE_ITEMS = [
  {
    type: "lost",
    href: "/public-data?type=lost",
  },
  {
    type: "found",
    href: "/public-data?type=found",
  },
] as const;

export const SUPPORT_MENU_ITEMS = [
  {
    type: "notificationSetting",
    href: "/mypage/notifications",
  },
  {
    type: "notice",
    href: "/notice",
  },
] as const;

export const BUTTON_DEFAULT_STYLE =
  "block w-full rounded-2xl py-7 pl-[30px] text-h2-bold relative overflow-hidden";

export const WRITE_BUTTONS = [
  {
    type: "lost",
    href: "/write/post?type=lost",
    icon: "/main/LostFindActions/lost-position.svg",
    style: "text-[#5B3322] bg-fill-accent-lostItem2",
  },
  {
    type: "found",
    href: "/write/post?type=find",
    icon: "/main/LostFindActions/found-position.svg",
    style: "text-[#173C28] bg-fill-brand-subtle-hover",
  },
] as const;

export const FILTER_ITEMS = [
  { value: "all" },
  { value: "lost" },
  { value: "find" },
  { value: "category" },
] as const;

type FilterItemValue = PostFilterChipValue | "category";

export const POST_FILTER_ITEMS = FILTER_ITEMS.filter(
  (item): item is { value: PostFilterChipValue } => item.value !== "category"
);

export const CATEGORY_FILTER_ITEM = FILTER_ITEMS.find(
  (item): item is { value: "category" } => item.value === "category"
) ?? { value: "category" as FilterItemValue };

export const CATEGORY_FILTER_DROPDOWN_MIN_WIDTH_PX = 107;

export const BOTTOM_OFFSET_PX = 86.67;
export const HEADER_HEIGHT_PX = 85;
export const MIN_HEIGHT_PX = 27;
export const INITIAL_HEIGHT_PX = 591;
export const SNAP_RATIOS = [0, 0.3, 0.5, 0.75, 1] as const;

/** 바텀시트 핸들 영역 높이 (pt-3 + bar 3px + pb-5) */
export const SHEET_HANDLE_HEIGHT_PX = 35;
/** 스크롤 콘텐츠 하단 패딩 (pb-[18px]) */
export const SHEET_CONTENT_BOTTOM_PADDING_PX = 18;

export const PERMISSION_ITEM = [
  {
    type: "location",
    iconName: "Marker" as const,
  },
  {
    type: "alert",
    iconName: "AlertBell" as const,
  },
] as const;

export const PERMISSION_CONFIG = {
  Location: {
    iconName: "Marker" as const,
  },
  Alert: {
    iconName: "AlertBell" as const,
  },
};

export const MARKER_ID = "marker-id" as const;

export const POST_TYPE = "post-type" as const;
export const CATEGORY = "category" as const;
