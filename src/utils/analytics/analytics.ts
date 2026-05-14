import { trackingEvent } from "../trackingEvent/trackingEvent";
export { trackingEvent };

// 글쓰게 페이지 진입
export const trackPostStart = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "post_start", category: "post", label: type });

// 글쓰기 제출
export const trackPostComplete = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "post_complete", category: "post", label: type });

// 검색 실행
export const trackSearch = (keyword: string) =>
  trackingEvent({ action: "search", category: "explore", label: keyword });

// 필터 변경
export const trackFilterChange = (filter: string) =>
  trackingEvent({ action: "filter_change", category: "explore", label: filter });

// 입력하기 버튼 클릭
export const trackContactClick = (postId: string) =>
  trackingEvent({ action: "contact_click", category: "conversion", label: postId });

// 해결 완료
export const trackResolved = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "resolved", category: "conversion", label: type });
