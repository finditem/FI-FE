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
