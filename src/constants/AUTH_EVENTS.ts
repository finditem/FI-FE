/** 로그인 완료 후 약관·실시간 연결 등 후속 처리를 시작하는 이벤트 이름입니다. */
export const AUTH_LOGIN_SUCCESS_EVENT = "authLoginSuccess";

/** 로컬 세션 종료 후 캐시와 실시간 연결을 정리하는 이벤트 이름입니다. */
export const AUTH_SESSION_ENDED_EVENT = "authSessionEnded";

/** 재발급 성공 후 채팅·SSE 연결에 토큰 변경을 알리는 이벤트 이름입니다. */
export const AUTH_TOKEN_REFRESHED_EVENT = "tokenRefreshed";
