import { trackingEvent } from "../trackingEvent/trackingEvent";

/**
 * 사용자가 글쓰기 페이지(분실물 또는 습득물 작성 폼)에 진입했을 때 호출합니다.
 * @param type - 진입한 페이지의 글 종류 ('분실물' 또는 '습득물')
 */
export const trackPostStart = (type: "분실물" | "습득물") =>
  trackingEvent("post_start", { item_type: type });

/**
 * 사용자가 분실물 또는 습득물 게시글 등록을 최종 완료했을 때 호출합니다.
 * @remarks 반드시 게시글 등록 API 요청이 성공(200 OK)한 시점에 실행되어야 합니다.
 * @param type - 등록 완료된 글 종류 ('분실물' 또는 '습득물')
 */
export const trackPostComplete = (type: "분실물" | "습득물") =>
  trackingEvent("post_complete", { item_type: type });

/**
 * 사용자가 검색창에 키워드를 입력하고 검색을 실행했을 때 호출합니다.
 * @remarks GA4 표준 규격(search 이벤트명 및 search_term 파라미터명)을 준수합니다.
 * @param keyword - 사용자가 입력한 실제 검색어 (예: '지갑', '에어팟')
 */
export const trackSearch = (keyword: string) => trackingEvent("search", { search_term: keyword });
