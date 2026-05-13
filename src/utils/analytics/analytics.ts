import { trackingEvent } from "../trackingEvent/trackingEvent";
export { trackingEvent };

export const trackPostStart = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "post_start", category: "post", label: type });

export const trackPostComplete = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "post_complete", category: "post", label: type });

export const trackSearch = (keyword: string) =>
  trackingEvent({ action: "search", category: "explore", label: keyword });

export const trackFilterChange = (filter: string) =>
  trackingEvent({ action: "filter_change", category: "explore", label: filter });

export const trackContactClick = (postId: string) =>
  trackingEvent({ action: "contact_click", category: "conversion", label: postId });

export const trackResolved = (type: "분실물" | "습득물") =>
  trackingEvent({ action: "resolved", category: "conversion", label: type });
