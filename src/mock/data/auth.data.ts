import type { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { ApiSignUpType } from "@/api/fetch/auth/types/ApiSingUpType";
import type { SignUpResponseType } from "@/api/fetch/auth/types/SignUpResponseType";

export const MOCK_AUTH_USER: GetUsersMeResponse = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: {
    userId: 1,
    nickname: "테스트유저",
    email: "test@test.com",
    profileImg: "",
    role: "USER",
    socialUser: false,
  },
};
export const MOCK_AUTH_ADMIN: GetUsersMeResponse = {
  ...MOCK_AUTH_USER,
  result: { ...MOCK_AUTH_USER.result, role: "ADMIN" },
};
export const MOCK_AUTH_SOCIAL_USER: GetUsersMeResponse = {
  ...MOCK_AUTH_USER,
  result: { ...MOCK_AUTH_USER.result, socialUser: true },
};
export const MOCK_AUTH_REFRESH_RESPONSE: ApiBaseResponseType<{
  userId: number;
  temporaryPassword: boolean;
}> = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};
export const MOCK_AUTH_LOGIN_RESPONSE = {
  ...MOCK_AUTH_REFRESH_RESPONSE,
  result: { userId: "1", temporaryPassword: false },
};
export const MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE = {
  ...MOCK_AUTH_LOGIN_RESPONSE,
  result: { ...MOCK_AUTH_LOGIN_RESPONSE.result, temporaryPassword: true },
};
export const MOCK_AUTH_EXPIRED_RESPONSE = {
  isSuccess: false,
  code: "AUTH401-INVALID_REFRESH",
  message: "세션이 만료되었습니다.",
  result: null,
};
export const MOCK_AUTH_LOGIN_FORM = {
  email: "test@test.com",
  password: "Password1!",
  rememberId: false,
};
export const MOCK_AUTH_INVALID_FORM = { ...MOCK_AUTH_LOGIN_FORM, email: "invalid-email" };
export const MOCK_AUTH_STALE_COOKIES =
  "locale_session=1; access_token=expired-access; refresh_token=expired-refresh";
export const MOCK_AUTH_GUEST_COOKIES = "locale_session=1";
export const MOCK_AUTH_COOKIE = { name: "refresh_token", value: "auth-test-refresh", path: "/" };
export const MOCK_AUTH_ACCESS_COOKIE = {
  name: "access_token",
  value: "auth-test-access",
  path: "/",
};
export const MOCK_AUTH_SOCIAL_RESPONSE = {
  ...MOCK_AUTH_REFRESH_RESPONSE,
  result: { userId: 1, isTemporaryPassword: false, termsAgreed: true },
};
export const MOCK_AUTH_SOCIAL_REQUEST = { code: "auth-test-code", environment: "dev" };
export const MOCK_AUTH_OAUTH_STATE = "auth-test-state";

export const MOCK_AUTH_INVALID_CREDENTIALS_ERROR = {
  response: { data: { code: "AUTH401-INVALID_CREDENTIALS" } },
};

export const MOCK_AUTH_SIGN_UP_REQUEST: ApiSignUpType = {
  email: MOCK_AUTH_LOGIN_FORM.email,
  password: MOCK_AUTH_LOGIN_FORM.password,
  nickname: MOCK_AUTH_USER.result.nickname,
  privacyPolicyAgreed: true,
  termsOfServiceAgreed: true,
  contentPolicyAgreed: true,
  marketingConsent: false,
};

export const MOCK_AUTH_SIGN_UP_RESPONSE: SignUpResponseType = {
  ...MOCK_AUTH_LOGIN_RESPONSE,
  result: { id: "1", temporaryPassword: false },
};

// isValidCallbackUrl 검증용 fixture입니다. URL 파서가 조용히 지워 Open Redirect 우회에 악용되는
// 제어 문자는 소스에서 눈에 보이지 않아 혼동되지 않도록 코드 포인트로 생성합니다.
const TAB = String.fromCharCode(9);
const LINE_FEED = String.fromCharCode(10);
const CARRIAGE_RETURN = String.fromCharCode(13);
const NUL = String.fromCharCode(0);

/** 통과해야 하는 안전한 내부 경로입니다. */
export const MOCK_AUTH_CALLBACK_VALID_URLS = [
  "/",
  "/mypage",
  "/write/post",
  "/write/post?type=lost&category=wallet",
  "/search?q=%EC%A7%80%EA%B0%91",
  "/post/123#comment",
];

/** 문자열이 아니라 거부해야 하는 값입니다. */
export const MOCK_AUTH_CALLBACK_NON_STRING_VALUES: unknown[] = [undefined, null, 123, {}, [], true];

/** 슬래시로 시작하지 않아 거부해야 하는 값입니다. */
export const MOCK_AUTH_CALLBACK_NON_SLASH_URLS = [
  "",
  "evil.com",
  "https://evil.com",
  "http:/evil.com",
  "../secret",
];

/** 프로토콜 상대 URL 접두어라 거부해야 하는 값입니다. host가 더미 오리진(x)과 같은 경우까지 포함합니다. */
export const MOCK_AUTH_CALLBACK_PROTOCOL_RELATIVE_URLS = [
  "//evil.com",
  "//evil.com/path",
  "/\\evil.com",
  "//x/path",
  "/\\x/path",
];

/** URL 파서가 지워 우회에 악용되는 제어 문자가 끼어 거부해야 하는 값입니다. `[라벨, 입력]` 형태입니다. */
export const MOCK_AUTH_CALLBACK_CONTROL_CHAR_URLS: [string, string][] = [
  ["탭", `/${TAB}/evil.com`],
  ["줄바꿈", `/${LINE_FEED}https://evil.com`],
  ["캐리지 리턴", `/path${CARRIAGE_RETURN}/evil.com`],
  ["널 문자", `/path${NUL}/evil.com`],
];

/** 순환 리다이렉트를 유발해 거부해야 하는 경로입니다. */
export const MOCK_AUTH_CALLBACK_CIRCULAR_URLS = [
  "/login",
  "/login/email",
  "/sign-up",
  "/sign-up/terms",
];
