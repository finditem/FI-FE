import { ReferenceType } from "@/api/fetch/notification";

export const alertRouteUrl = (
  referenceType: ReferenceType,
  referenceId: number,
  roomId?: number
): string => {
  switch (referenceType) {
    case "POST":
    case "COMMENT":
      return `/list/${referenceId}`;
    case "CHAT":
      return `/chat/${referenceId}?roomId=${roomId}`;
    case "INQUIRY":
      return `/mypage/inquiries/${referenceId}`;
    case "NOTICE":
      return `/notice/${referenceId}`;
    case "REPORT":
      return `/mypage/reports/${referenceId}`;
    default:
      return "#";
  }
};
