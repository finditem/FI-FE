import axios, {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getBaseURL } from "./getBaseURL";
import {
  expireSession,
  getSessionEpoch,
  getTokenVersion,
  isAuthenticationError,
  isSessionTerminal,
  refreshSession,
  startClientSession,
} from "../auth/authSession";

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
  _sessionEpoch?: number;
  _tokenVersion?: number;
};

const authApi = axios.create({ baseURL: getBaseURL(), withCredentials: true, timeout: 5000 });
const isSessionRequest = (url = "") =>
  /^\/?auth\/(login|kakao|apple|refresh|logout)(?:[/?]|$)/.test(url);

authApi.interceptors.request.use(async (config: AuthRequestConfig) => {
  if (/^\/?auth\/(login|kakao|apple)(?:[/?]|$)/.test(config.url ?? "")) {
    await startClientSession();
  }
  if (!isSessionRequest(config.url) && typeof window !== "undefined") {
    if (config._sessionEpoch !== undefined && config._sessionEpoch !== getSessionEpoch()) {
      throw new CanceledError("Session changed");
    }
    config._sessionEpoch = getSessionEpoch();
    config._tokenVersion = getTokenVersion();
    if (isSessionTerminal()) {
      // 게스트의 쓰기 동작도 기존 호출부가 로그인 안내로 처리할 수 있는 401을 반환한다.
      throw new AxiosError("Session expired", "ERR_BAD_REQUEST", config, undefined, {
        config,
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        data: {
          isSuccess: false,
          code: "AUTH401-INVALID_REFRESH",
          message: "Session expired",
          result: null,
        },
      });
    }
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => {
    const config = response.config as AuthRequestConfig;
    if (config._sessionEpoch !== undefined && config._sessionEpoch !== getSessionEpoch()) {
      throw new CanceledError("Session changed");
    }
    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const request = error.config as AuthRequestConfig | undefined;
    if (typeof window === "undefined" || !request || isSessionRequest(request.url)) throw error;
    if (request._sessionEpoch !== getSessionEpoch()) throw new CanceledError("Session changed");
    if (isSessionTerminal()) throw error;
    if (!isAuthenticationError(error)) throw error;
    if (request._authRetry) {
      await expireSession();
      throw error;
    }
    request._authRetry = true;
    // 이미 갱신된 토큰 이전에 시작한 요청이면 추가 회전 없이 원요청만 재시도한다.
    if (request._tokenVersion === getTokenVersion()) await refreshSession();
    return authApi(request);
  }
);

export default authApi;
