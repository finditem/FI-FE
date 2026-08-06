import {
  BOTTOM_OFFSET_PX,
  HEADER_HEIGHT_PX,
  MIN_HEIGHT_PX,
  SNAP_RATIOS,
  INITIAL_HEIGHT_PX,
  SHEET_HANDLE_HEIGHT_PX,
  SHEET_CONTENT_BOTTOM_PADDING_PX,
} from "../_components/HOME_CONST";

export const getMaxHeightPx = () => {
  if (typeof window === "undefined") return INITIAL_HEIGHT_PX;
  return window.innerHeight - BOTTOM_OFFSET_PX - HEADER_HEIGHT_PX;
};

export interface DefaultSheetContentHeights {
  upToLostFindActions: number;
  upToRecentFoundItemSection: number;
  upToPoliceSection: number;
  totalContentHeight: number;
}

export const getSnapHeightsByDevice = (max: number): number[] => {
  const range = max - MIN_HEIGHT_PX;
  return SNAP_RATIOS.map((r) =>
    r === 0 ? MIN_HEIGHT_PX : r === 1 ? max : MIN_HEIGHT_PX + range * r
  );
};

const CONTENT_SNAP_OFFSET_PX = 40;

const clampSheetHeight = (value: number, max: number) =>
  Math.max(MIN_HEIGHT_PX, Math.min(max, value));

export const getSnapHeightsByContent = (
  max: number,
  contentHeights: DefaultSheetContentHeights
): number[] => {
  const base = SHEET_HANDLE_HEIGHT_PX + SHEET_CONTENT_BOTTOM_PADDING_PX;
  const { upToLostFindActions, upToRecentFoundItemSection, upToPoliceSection, totalContentHeight } =
    contentHeights;

  const peekAfterLost = Math.max(0, upToRecentFoundItemSection - upToLostFindActions) / 2;
  const peekAfterRecent = Math.max(0, upToPoliceSection - upToRecentFoundItemSection) / 2;
  const peekAfterPolice = Math.max(0, totalContentHeight - upToPoliceSection) / 2;

  const secondRaw = base + upToLostFindActions - CONTENT_SNAP_OFFSET_PX + peekAfterLost;
  const thirdRaw = base + upToRecentFoundItemSection - CONTENT_SNAP_OFFSET_PX + peekAfterRecent;
  const fourthRaw = base + upToPoliceSection - CONTENT_SNAP_OFFSET_PX + peekAfterPolice;

  const second = clampSheetHeight(secondRaw, max);
  const third = clampSheetHeight(Math.max(thirdRaw, second), max);
  const fourth = clampSheetHeight(Math.max(fourthRaw, third), max);

  return [MIN_HEIGHT_PX, second, third, fourth, max];
};

export const getSnapHeights = (
  max: number,
  options?: {
    searchValue: string | null;
    contentHeights?: DefaultSheetContentHeights | null;
    markerId?: string | null;
  }
): number[] => {
  if (options?.searchValue) {
    return getSnapHeightsByDevice(max);
  }
  if (options?.markerId) {
    return getSnapHeightsByDevice(max);
  }
  if (options?.contentHeights) {
    return getSnapHeightsByContent(max, options.contentHeights);
  }
  return getSnapHeightsByDevice(max);
};
