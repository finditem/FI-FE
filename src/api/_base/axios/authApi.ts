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
import {
  LOGIN_ENDPOINT_PATTERN,
  SESSION_ENDPOINT_PATTERN,
} from "../auth/_constants/AUTH_ENDPOINTS";

/**
 * 원요청의 세션·토큰 세대와 재전송 여부를 보존하는 인터셉터 전용 설정입니다.
 * @author suhyeon
 */
type AuthRequestConfig = InternalAxiosRequestConfig & {
  /**
   * 원요청은 최대 한 번만 재전송합니다.
   * @author suhyeon
   */
  _authRetry?: boolean;
  /**
   * 계정 전환·로그아웃 이전에 시작한 요청을 구분합니다.
   * @author suhyeon
   */
  _sessionEpoch?: number;
  /**
   * 같은 세션에서 이전 토큰으로 시작한 요청을 구분합니다.
   * @author suhyeon
   */
  _tokenVersion?: number;
};

const authApi = axios.create({ baseURL: getBaseURL(), withCredentials: true, timeout: 5000 });
const isSessionRequest = (url = ""): boolean => SESSION_ENDPOINT_PATTERN.test(url);

function assertCurrentSession(config: AuthRequestConfig): void {
  if (config._sessionEpoch === undefined || config._sessionEpoch === getSessionEpoch()) return;
  throw new CanceledError("Session changed");
}

function createExpiredSessionError(config: AuthRequestConfig): AxiosError {
  // 게스트의 쓰기 동작도 기존 호출부가 로그인 안내로 처리할 수 있는 401을 반환합니다.
  return new AxiosError("Session expired", "ERR_BAD_REQUEST", config, undefined, {
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

authApi.interceptors.request.use(async (config: AuthRequestConfig) => {
  if (LOGIN_ENDPOINT_PATTERN.test(config.url ?? "")) {
    await startClientSession();
  }
  if (isSessionRequest(config.url) || typeof window === "undefined") return config;

  assertCurrentSession(config);
  config._sessionEpoch = getSessionEpoch();
  config._tokenVersion = getTokenVersion();
  if (isSessionTerminal()) throw createExpiredSessionError(config);
  return config;
});

authApi.interceptors.response.use(
  (response) => {
    assertCurrentSession(response.config as AuthRequestConfig);
    return response;
  },
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) throw error;
    const request = error.config as AuthRequestConfig | undefined;
    if (typeof window === "undefined" || !request || isSessionRequest(request.url)) throw error;
    if (request._sessionEpoch !== getSessionEpoch()) throw new CanceledError("Session changed");
    if (isSessionTerminal() || !isAuthenticationError(error)) throw error;

    if (request._authRetry) {
      await expireSession();
      throw error;
    }

    request._authRetry = true;
    // 이미 토큰이 갱신됐다면 추가 회전 없이 원요청만 재전송합니다.
    if (request._tokenVersion === getTokenVersion()) await refreshSession();
    return authApi(request);
  }
);

export default authApi;
