import { ReportType } from "@/types";

export const REPORT_TYPE_TITLE: Record<ReportType, string> = {
  IRRELEVANT_CONTENT: "실제 분실/발견한 물건이 아닌 내용이에요.",
  DUPLICATE: "동일한 내용이 여러 번 올라왔어요.",
  SPAM: "분실물과 무관한 홍보성 게시글이에요.",
  OFFENSIVE_LANGUAGE: "채팅 또는 댓글에 모욕적 표현이 있어요.",
  EXTORTION: "물건 반환을 빌미로 금전 요구가 있어요.",
  FALSE_CLAIM: "실제 주인이 아닌 사람이 소유를 주장해요.",
  ETC: "위 항목 외의 다른 문제를 신고해요.",
};
