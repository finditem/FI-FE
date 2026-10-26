import axios, { CanceledError } from "axios";
import { getBaseURL } from "../axios/getBaseURL";
import type { ApiBaseResponseType } from "../types/ApiBaseResponseType";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { useNotificationStore } from "@/store/useNotificationStore/useNotificationStore";
import { AUTH_SESSION_ENDED_EVENT } from "@/constants/AUTH_EVENTS";
import { getSessionExpiredLoginUrl, isProtectedRoute } from "@/utils/authRoutes/authRoutes";

export type RefreshResponse = ApiBaseResponseType<{ userId: number; temporaryPassword: boolean }>;
export const sessionTransport = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000,
});
let sessionEpoch = 0; // 계정 전환·로그아웃 이전의 응답을 무시한다.
let tokenVersion = 0; // 같은 세션에서 갱신 전에 보낸 요청의 늦은 401을 구분한다.
let terminal = false;
let refreshInFlight: Promise<RefreshResponse> | undefined;
let refreshController: AbortController | undefined;
let expiryInFlight: Promise<void> | undefined;

export const getSessionEpoch = () => sessionEpoch;
export const getTokenVersion = () => tokenVersion;
export const isSessionTerminal = () => terminal;
export const isAuthenticationError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export function resetClientSession() {
  sessionEpoch += 1;
  terminal = true;
  refreshController?.abort();
  refreshInFlight = undefined;
  useAuthStore.getState().setStatus("anonymous");
  useAgreeStore.getState().logout();
  useNotificationStore.getState().resetUnreadNotificationState();
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_SESSION_ENDED_EVENT));
}

export async function startClientSession() {
  // 이전 삭제 응답이 새 로그인 쿠키를 지우지 않도록 로그인 요청 전에도 대기한다.
  await expiryInFlight;
  sessionEpoch += 1;
  terminal = false;
  refreshController?.abort();
  refreshInFlight = undefined;
  expiryInFlight = undefined;
}

export function expireSession({ redirect = true }: { redirect?: boolean } = {}): Promise<void> {
  if (expiryInFlight) return expiryInFlight;
  resetClientSession();
  expiryInFlight = (async () => {
    try {
      await sessionTransport.delete("/auth/session");
    } catch {
      // 보호 화면은 미들웨어의 session-expired 삭제 경로로도 복구한다.
    }
    if (redirect && typeof window !== "undefined" && isProtectedRoute(window.location.pathname)) {
      window.location.replace(
        getSessionExpiredLoginUrl(window.location.pathname, window.location.search)
      );
    }
  })();
  return expiryInFlight;
}

export function refreshSession(): Promise<RefreshResponse> {
  if (terminal) return Promise.reject(new CanceledError("Session ended"));
  if (refreshInFlight) return refreshInFlight;
  const epoch = sessionEpoch;
  refreshController = new AbortController();
  const task = sessionTransport
    .post<RefreshResponse>("/auth/refresh", undefined, { signal: refreshController.signal })
    .then(({ data }) => {
      if (epoch !== sessionEpoch) throw new CanceledError("Session changed");
      tokenVersion += 1;
      useAuthStore.getState().setStatus("authenticated");
      if (typeof window !== "undefined") window.dispatchEvent(new Event("tokenRefreshed"));
      return data;
    })
    .catch(async (error: unknown) => {
      if (epoch === sessionEpoch && isAuthenticationError(error)) await expireSession();
      throw error;
    })
    .finally(() => {
      if (refreshInFlight === task) refreshInFlight = undefined;
    });
  refreshInFlight = task;
  return task;
}
