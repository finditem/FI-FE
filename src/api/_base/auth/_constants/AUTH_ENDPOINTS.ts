/** 새 세션을 시작해야 하는 로그인 엔드포인트를 판별합니다. */
export const LOGIN_ENDPOINT_PATTERN = /^\/?auth\/(login|kakao|apple)(?:[/?]|$)/;

/** 일반 인증 요청의 401 복구에서 제외할 세션 엔드포인트를 판별합니다. */
export const SESSION_ENDPOINT_PATTERN = /^\/?auth\/(login|kakao|apple|refresh|logout)(?:[/?]|$)/;
