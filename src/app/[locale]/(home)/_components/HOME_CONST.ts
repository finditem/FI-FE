import { PostFilterChipValue } from "../_types/PostFilterChipValue";

export const LOST_FIND_ACTION_DATA = [
  {
    type: "lost",
    symbolImage: "/main/LostFindActions/home-lost-icon.svg",
    // 태블릿 기준 크기. 모바일에서는 컴포넌트에서 CSS로 축소한다.
    symbolSize: { width: 83, height: 56 },
    bgColor: "bg-fill-accent-lostItem",
    emphasisClass: "text-[#332C29]",
    restClass: "text-[#786863] tablet:text-[#675a56]",
    subtitleClass: "text-[#907b74]",
  },
  {
    type: "found",
    symbolImage: "/main/LostFindActions/home-found-icon.svg",
    symbolSize: { width: 74, height: 56 },
    bgColor: "bg-[#C2F1D4]/45",
    emphasisClass: "text-[#29322D]",
    restClass: "text-[#81998A] tablet:text-[#4f5d54]",
    subtitleClass: "text-[#54695c]",
  },
] as const;

export const POLICE_BANNER = {
  href: "/public-data?type=lost",
} as const;

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

/** 검색바 아래 필터칩. 클릭 시 해당 타입 핀만 지도에 렌더링 (기능 미구현, UI 전용) */
export const MAIN_SEARCH_CHIPS = [
  { type: "lost", icon: "/main/MainSearchChip/lost.svg" },
  { type: "found", icon: "/main/MainSearchChip/found.svg" },
  { type: "popup", icon: "/main/MainSearchChip/popup.svg" },
  { type: "cafe", icon: "/main/MainSearchChip/cafe.svg" },
  { type: "food", icon: "/main/MainSearchChip/food.svg" },
] as const;

export type MainSearchChipType = (typeof MAIN_SEARCH_CHIPS)[number]["type"];

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

/**
 * 검색바 아래 분실물/발견물 칩으로 여는 게시글 피드 시트의 열림 표시 파라미터.
 * 타입 필터는 `POST_TYPE`(`?post-type`)이 담당하고, 이 값은 시트가 열려 있음을 나타낸다.
 * "모두보기"로 `?post-type`이 지워져도 이 값이 남아 있으면 시트는 전체 피드로 유지된다.
 * 전체 피드 상태에서 "모두보기"를 다시 누르면(`?post-type`·`?category` 모두 없음)
 * `useHomeFilterQuery`가 이 값도 지워 시트가 닫히고 메인 시트로 돌아간다.
 */
export const FEED_PARAM = "feed" as const;
export const FEED_PARAM_VALUE = "post" as const;

/**
 * 지도에서 장소 마커를 클릭했을 때 선택된 장소의 `placeId`를 담는 파라미터.
 * `PLACE_FILTER_PARAM`(어떤 카테고리를 보고 있는지)과 함께 쓰이며, 이 값이 있으면
 * 지도에 반경 원이 그려지고 바텀시트가 장소 상세로 바뀐다.
 */
export const PLACE_ID_PARAM = "place-id" as const;

/**
 * 장소 마커 선택 시 지도에 그리는 반경. 바깥 원은 `nearby-posts`/`nearby-post-markers`가
 * 서버에서 자르는 500m와 같은 값이고, 안쪽 원은 데이터와 무관한 장식이다.
 */
export const PLACE_RADIUS_M = { outer: 500, inner: 250 } as const;

/**
 * 장소 마커를 선택했을 때 맞추는 지도 줌 레벨.
 * 카카오 레벨 5는 4m/px라 500m 반경 원의 지름이 250px이 되어 390px 폭 화면에 들어온다.
 * `DEFAULT_MAP_LEVEL`과 같은 값이라 기본 상태에서 장소를 선택하면 줌이 바뀌지 않는다.
 * 사용자가 확대해 둔 상태에서 선택했을 때만 이 레벨로 되돌린다.
 */
export const PLACE_SELECTED_MAP_LEVEL = 5;

/** 검색바 아래 칩으로 여는 장소 필터 시트의 URL 파라미터 */
export const PLACE_FILTER_PARAM = "place" as const;
export const PLACE_FILTER_VALUES = ["popup", "cafe", "restaurant"] as const;
export type PlaceFilterValue = (typeof PLACE_FILTER_VALUES)[number];

/** 장소 필터 값 <-> NeighborhoodPlace 카테고리 매핑 */
export const PLACE_FILTER_TO_CATEGORY = {
  popup: "POPUP",
  cafe: "CAFE",
  restaurant: "RESTAURANT",
} as const;
