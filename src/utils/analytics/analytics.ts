import { trackingEvent } from "../trackingEvent/trackingEvent";

export type PostAnalyticsType = "분실물" | "습득물";

/**
 * 사용자가 글쓰기 페이지(분실물 또는 습득물 작성 폼)에 진입했을 때 호출합니다.
 * @param type - 진입한 페이지의 글 종류 ('분실물' 또는 '습득물')
 */
export const trackPostStart = (type: PostAnalyticsType) =>
  trackingEvent("post_start", { item_type: type });

/**
 * 사용자가 분실물 또는 습득물 게시글 등록을 최종 완료했을 때 호출합니다.
 * @remarks 반드시 게시글 등록 API 요청이 성공(200 OK)한 시점에 실행되어야 합니다.
 * @param type - 등록 완료된 글 종류 ('분실물' 또는 '습득물')
 */
export const trackPostComplete = (type: PostAnalyticsType) =>
  trackingEvent("post_complete", { item_type: type });

/**
 * 사용자가 검색창에 키워드를 입력하고 검색을 실행했을 때 호출합니다.
 * @remarks GA4 표준 규격(search 이벤트명 및 search_term 파라미터명)을 준수합니다.
 * @param keyword - 사용자가 입력한 실제 검색어 (예: '지갑', '에어팟')
 */
export const trackSearch = (keyword: string) => trackingEvent("search", { search_term: keyword });

export type LoginButtonLocation = "mypage" | "guest_modal" | "find_pw" | "login_email_select";

/**
 * 로그인 페이지로 진입시키는 버튼을 클릭했을 때 호출합니다.
 * @param location - 버튼이 위치한 화면/컴포넌트
 */
export const trackLoginButtonClick = (location: LoginButtonLocation) =>
  trackingEvent("login_button_click", { location });

export type LoginAttemptMethod = "email";

/**
 * 실제 로그인을 시도했을 때(이메일 로그인 제출) 호출합니다.
 * @param method - 로그인 시도 방식
 */
export const trackLoginAttempt = (method: LoginAttemptMethod) =>
  trackingEvent("login_attempt", { method });

/**
 * 카카오 로그인 버튼을 클릭했을 때 호출합니다.
 * @remarks 클릭 즉시 카카오 인증 페이지로 리다이렉트되어 이벤트 전송이 끊길 수 있어,
 * gtag 요청을 navigator.sendBeacon으로 보내도록 transport_type을 지정합니다.
 */
export const trackKakaoLoginClick = () =>
  trackingEvent("kakao_login_click", { transport_type: "beacon" });

/**
 * 애플 로그인 버튼을 클릭했을 때 호출합니다.
 * @remarks 클릭 즉시 애플 인증 페이지로 리다이렉트되어 이벤트 전송이 끊길 수 있어,
 * gtag 요청을 navigator.sendBeacon으로 보내도록 transport_type을 지정합니다.
 */
export const trackAppleLoginClick = () =>
  trackingEvent("apple_login_click", { transport_type: "beacon" });

export type SearchBarLocation = "home" | "list";

/**
 * 검색창을 클릭(포커스)했을 때 호출합니다.
 * @param page - 검색창이 위치한 화면
 */
export const trackClickSearchBar = (page: SearchBarLocation) =>
  trackingEvent("click_search_bar", { page });

export type ItemTypeLabel = "lost" | "found";

/**
 * 게시글 목록에서 카드를 클릭했을 때 호출합니다.
 * @param itemId - 클릭한 게시글 id
 * @param itemType - 게시글 종류
 */
export const trackClickItemCard = (itemId: number, itemType: ItemTypeLabel) =>
  trackingEvent("click_item_card", { item_id: itemId, item_type: itemType });

/**
 * 게시글 상세 페이지에 진입했을 때 호출합니다.
 * @param itemId - 조회한 게시글 id
 * @param itemType - 게시글 종류
 */
export const trackViewItemDetail = (itemId: number, itemType: ItemTypeLabel) =>
  trackingEvent("view_item_detail", { item_id: itemId, item_type: itemType });

export type WriteButtonLocation = "home" | "list";

/**
 * 글쓰기 페이지로 진입시키는 버튼을 클릭했을 때 호출합니다.
 * @param page - 버튼이 위치한 화면
 */
export const trackClickWriteButton = (page: WriteButtonLocation) =>
  trackingEvent("click_write_button", { page });

/**
 * 게시글 등록 버튼을 눌러 최종 제출했을 때 호출합니다.
 * @param itemType - 등록한 게시글 종류
 * @param category - 게시글 카테고리
 */
export const trackSubmitItem = (itemType: ItemTypeLabel, category: string) =>
  trackingEvent("submit_item", { item_type: itemType, category });

/**
 * 게시글 작성 중 이미지를 첨부했을 때 호출합니다.
 * @param imageCount - 이번 첨부로 추가된 이미지 수
 * @param itemType - 작성 중인 게시글 종류
 */
export const trackUploadImage = (imageCount: number, itemType: ItemTypeLabel) =>
  trackingEvent("upload_image", { image_count: imageCount, item_type: itemType });

/**
 * 게시글 작성 중 위치 등록을 클릭했을 때 호출합니다.
 * @param itemType - 작성 중인 게시글 종류
 */
export const trackClickLocation = (itemType: ItemTypeLabel) =>
  trackingEvent("click_location", { item_type: itemType });

/**
 * 게시글 작성을 뒤로 가기/취소로 중단했을 때 호출합니다.
 * @param itemType - 작성 중이던 게시글 종류
 */
export const trackWriteAbandon = (itemType: ItemTypeLabel) =>
  trackingEvent("write_abandon", { item_type: itemType });

/**
 * 경찰청 분실물(112) 바로가기 버튼을 클릭했을 때 호출합니다.
 * @param page - 버튼이 위치한 화면
 */
export const trackClick112LostItem = (page: string) =>
  trackingEvent("click_112_lost_item", { page });

/** 회원가입을 최종 완료했을 때 호출합니다. */
export const trackSignUp = () => trackingEvent("sign_up");

/** 회원가입 폼으로 진입하는 링크/버튼을 클릭했을 때 호출합니다. */
export const trackClickSignupStart = () => trackingEvent("click_signup_start");
