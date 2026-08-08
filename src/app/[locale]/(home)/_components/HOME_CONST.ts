import { PostFilterChipValue } from "../_types/PostFilterChipValue";

export const LOST_FIND_ACTION_DATA = [
  {
    type: "lost",
    title: "분실 신고",
    positionImage: "/main/LostFindActions/lost-position.svg",
    markImage: {
      src: "/main/LostFindActions/question.svg",
      size: {
        width: 21.39,
        height: 33.41,
      },
    },
    bagImage: "/main/LostFindActions/lost-bag.svg",
    messageImage: "/main/LostFindActions/lost-message.svg",
    bgColor: "bg-fill-accent-lostItem2",
  },
  {
    type: "found",
    title: "발견 신고",
    positionImage: "/main/LostFindActions/found-position.svg",
    markImage: {
      src: "/main/LostFindActions/exclamation.svg",
      size: {
        width: 16,
        height: 64,
      },
    },
    bagImage: "/main/LostFindActions/found-bag.svg",
    messageImage: "/main/LostFindActions/found-message.svg",
    bgColor: "bg-fill-brand-subtle-hover",
  },
] as const;

export const POLICE_ITEMS = [
  {
    href: "https://www.finditem.kr/public-data?type=lost",
    headLabel: "분실",
    label: "했어요",
  },
  {
    href: "https://www.finditem.kr/public-data?type=found",
    headLabel: "발견",
    label: "했어요",
  },
];

export const SUPPORT_MENU_ITEMS = [
  {
    label: "키워드 알람 설정하기",
    href: "/mypage/notifications",
  },
  {
    label: "공지사항",
    href: "/notice",
  },
];

export const BUTTON_DEFAULT_STYLE =
  "block w-full rounded-2xl py-7 pl-[30px] text-h2-bold relative overflow-hidden";

export const WRITE_BUTTONS = [
  {
    label: "분실한 물건 등록하기",
    href: "/write/post?type=lost",
    icon: "/main/LostFindActions/lost-position.svg",
    style: "text-[#5B3322] bg-fill-accent-lostItem2",
  },
  {
    label: "발견한 물건 등록하기",
    href: "/write/post?type=find",
    icon: "/main/LostFindActions/found-position.svg",
    style: "text-[#173C28] bg-fill-brand-subtle-hover",
  },
];

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
    iconName: "Marker" as const,
    title: "위치 (선택)",
    description: "현 위치 기반으로 유실물 정보 확인",
  },
  {
    iconName: "AlertBell" as const,
    title: "알림 (선택)",
    description: "찾아줘 서비스 알림 수신",
  },
];

export const PERMISSION_CONFIG = {
  Location: {
    title: "더 편한 서비스를 위해 위치 정보를 접근의 허용해 주세요.",
    description: `위치 정보 허용 시 현재 위치를 기반으로\n 유실물 정보를 제공해요.`,
    iconName: "Marker" as const,
    agreeBtnText: "위치 접근 허용하기",
  },
  Alert: {
    title: "알림을 허용하고 더 많은 소식을 받아보세요.",
    description: `알림 허용은 마이페이지의 설정에서\n 언제든지 변경할 수 있어요.`,
    iconName: "AlertBell" as const,
    agreeBtnText: "알림 허용하기",
  },
};

export const MARKER_ID = "marker-id" as const;

export const POST_TYPE = "post-type" as const;
export const CATEGORY = "category" as const;
