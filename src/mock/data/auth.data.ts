import type { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";
import type { RefreshResponse } from "@/api/_base/auth/authSession";

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
export const MOCK_AUTH_REFRESH_RESPONSE: RefreshResponse = {
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
