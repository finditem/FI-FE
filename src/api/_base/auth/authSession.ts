import axios, { CanceledError } from "axios";
import { getBaseURL } from "../axios/getBaseURL";
import type { ApiBaseResponseType } from "../types/ApiBaseResponseType";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { useNotificationStore } from "@/store/useNotificationStore/useNotificationStore";
import { AUTH_SESSION_ENDED_EVENT, AUTH_TOKEN_REFRESHED_EVENT } from "@/constants/AUTH_EVENTS";
import { getSessionExpiredLoginUrl } from "@/utils/getSessionExpiredLoginUrl/getSessionExpiredLoginUrl";
import { isProtectedRoute } from "@/utils/isProtectedRoute/isProtectedRoute";

/** 재발급 후 사용자 식별자와 임시 비밀번호 여부를 전달하는 응답입니다. */
export type RefreshResponse = ApiBaseResponseType<{ userId: number; temporaryPassword: boolean }>;

/**
 * 세션 재발급과 쿠키 삭제에 사용하는 인터셉터 없는 전송 계층입니다.
 *
 * @remarks
 * `authApi`로 대체하면 401 재발급이 재귀 호출될 수 있습니다.
 * 일반 도메인 요청은 베이스 Query 훅을 사용합니다.
 */
export const sessionTransport = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000,
});

// 세션 공유 상태는 이 모듈에 모아 Bootstrap·인터셉터·채팅이 같은 재발급을 기다리게 합니다.
let sessionEpoch = 0;
let tokenVersion = 0;
let hasSessionEnded = false;
let refreshInFlight: Promise<RefreshResponse> | undefined;
let refreshController: AbortController | undefined;
let expiryInFlight: Promise<void> | undefined;

/**
 * 계정 전환·로그아웃 전후의 요청을 구분하는 세션 세대를 반환합니다.
 * @example
 * const requestSessionEpoch = getSessionEpoch();
 */
export const getSessionEpoch = (): number => sessionEpoch;

/**
 * 같은 세션에서 재발급 전후의 요청을 구분하는 토큰 버전을 반환합니다.
 * @example
 * const requestTokenVersion = getTokenVersion();
 */
export const getTokenVersion = (): number => tokenVersion;

/**
 * 이미 종료된 세션의 인증 요청을 네트워크 전송 전에 차단할지 반환합니다.
 * @example
 * if (isSessionTerminal()) return;
 */
export const isSessionTerminal = (): boolean => hasSessionEnded;

/**
 * 세션 만료로 처리할 HTTP 401인지 확인합니다.
 * @remarks 403·서버 장애·네트워크 오류는 세션 만료로 간주하지 않습니다.
 * @param error - 인증 요청에서 전달된 오류입니다.
 * @example
 * if (isAuthenticationError(error)) await expireSession();
 */
export const isAuthenticationError = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 401;

function cancelPendingRefresh(): void {
  refreshController?.abort();
  refreshController = undefined;
  refreshInFlight = undefined;
}

/**
 * 로컬 인증·약관·알림 상태를 초기화하고 세션 종료를 알립니다.
 * @remarks Bootstrap이 종료 이벤트를 받아 Query 캐시와 채팅·SSE 연결을 정리합니다.
 * @example
 * resetClientSession();
 */
export function resetClientSession(): void {
  sessionEpoch += 1;
  hasSessionEnded = true;
  cancelPendingRefresh();
  useAuthStore.getState().setStatus("anonymous");
  useAgreeStore.getState().logout();
  useNotificationStore.getState().resetUnreadNotificationState();

  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_SESSION_ENDED_EVENT));
}

/**
 * 이전 쿠키 삭제와 재발급이 새 로그인에 영향을 주지 않도록 새 세션을 시작합니다.
 * @remarks 로그인 요청 전과 로그인 완료 시 모두 기다려야 합니다.
 * @example
 * await startClientSession();
 */
export async function startClientSession(): Promise<void> {
  await expiryInFlight;
  sessionEpoch += 1;
  hasSessionEnded = false;
  cancelPendingRefresh();
  expiryInFlight = undefined;
}

async function deleteSessionCookies(): Promise<void> {
  try {
    await sessionTransport.delete("/auth/session");
  } catch {
    // 보호 화면에서는 미들웨어의 session-expired 경로로도 쿠키를 정리합니다.
  }
}

function redirectExpiredSession(): void {
  if (typeof window === "undefined") return;
  const { pathname, search } = window.location;
  if (!isProtectedRoute(pathname)) return;

  window.location.replace(getSessionExpiredLoginUrl(pathname, search));
}

interface ExpireSessionOptions {
  /** 보호 화면에서 로그인으로 이동할지 지정하며 기본값은 true입니다. */
  redirect?: boolean;
}

/**
 * 세션 종료와 쿠키 삭제를 한 번만 실행하고 보호 화면에서 로그인으로 이동합니다.
 * @param options - 명시적 로그아웃은 redirect를 false로 지정해 기존 홈 이동을 유지합니다.
 * @returns 동시에 발생한 만료 처리가 함께 기다리는 Promise입니다.
 * @example
 * await expireSession({ redirect: false });
 */
export function expireSession({ redirect = true }: ExpireSessionOptions = {}): Promise<void> {
  if (expiryInFlight) return expiryInFlight;

  resetClientSession();
  expiryInFlight = deleteSessionCookies().then(() => {
    if (redirect) redirectExpiredSession();
  });
  return expiryInFlight;
}

async function requestSessionRefresh(
  refreshSessionEpoch: number,
  signal: AbortSignal
): Promise<RefreshResponse> {
  try {
    const { data } = await sessionTransport.post<RefreshResponse>("/auth/refresh", undefined, {
      signal,
    });
    if (refreshSessionEpoch !== sessionEpoch) throw new CanceledError("Session changed");

    tokenVersion += 1;
    useAuthStore.getState().setStatus("authenticated");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(AUTH_TOKEN_REFRESHED_EVENT));
    }
    return data;
  } catch (error) {
    if (refreshSessionEpoch === sessionEpoch && isAuthenticationError(error)) {
      await expireSession();
    }
    throw error;
  }
}

/**
 * 같은 탭에서 진행 중인 재발급을 Bootstrap·인터셉터·채팅이 공유합니다.
 * @remarks
 * 세션 세대는 이전 계정의 응답을 차단하고, 토큰 버전은 늦은 401의 추가 재발급을 막습니다.
 * 이전 작업의 finally는 새 재발급 Promise를 비우지 않아야 합니다.
 * @returns 재발급 응답을 전달하는 공유 Promise입니다.
 * @example
 * await refreshSession();
 */
export function refreshSession(): Promise<RefreshResponse> {
  if (hasSessionEnded) return Promise.reject(new CanceledError("Session ended"));
  if (refreshInFlight) return refreshInFlight;

  refreshController = new AbortController();
  const refreshPromise = requestSessionRefresh(sessionEpoch, refreshController.signal).finally(
    () => {
      if (refreshInFlight !== refreshPromise) return;
      refreshInFlight = undefined;
    }
  );
  refreshInFlight = refreshPromise;
  return refreshPromise;
}
