/**
 * 로그인 성공 등 인증 흐름에서 `window`로 주고받는 `CustomEvent` 이름입니다.
 *
 * @author hyungjun
 */

/** 이메일·카카오 로그인 등에서 `new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT)`로 발생시키고,
 * SSE 등 후속 연결 로직에서 `addEventListener`로 구독합니다.
 */
export const AUTH_LOGIN_SUCCESS_EVENT = "authLoginSuccess";

/**
 * 재발급 성공 후 실시간 연결에 토큰 변경을 알리는 이벤트 이름입니다.
 * @author suhyeon
 */
export const AUTH_TOKEN_REFRESHED_EVENT = "tokenRefreshed";
