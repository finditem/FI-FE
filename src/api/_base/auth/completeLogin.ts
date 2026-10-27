import type { QueryClient } from "@tanstack/react-query";
import { CanceledError } from "axios";
import authApi from "../axios/authApi";
import { getSessionEpoch, isAuthenticationError, startClientSession } from "./authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants/AUTH_EVENTS";
import { USERS_ME_QUERY_KEY } from "@/constants/USER_QUERY_KEYS";
import type { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";

async function fetchLoginUser(
  queryClient: QueryClient,
  loginSessionEpoch: number
): Promise<GetUsersMeResponse | undefined> {
  try {
    // 세션 확정 전 캐시를 채워야 하므로 화면용 Query 훅 대신 명령형 조회를 사용합니다.
    return await queryClient.fetchQuery({
      queryKey: USERS_ME_QUERY_KEY,
      queryFn: async ({ signal }) => {
        const { data } = await authApi.get<GetUsersMeResponse>("/users/me", { signal });
        return data;
      },
      retry: false,
    });
  } catch (error) {
    if (isAuthenticationError(error) || loginSessionEpoch !== getSessionEpoch()) throw error;
    // 프로필 조회의 일시 장애는 성공한 로그인을 취소하지 않습니다.
    return undefined;
  }
}

/**
 * 이전 계정의 요청·캐시를 정리한 후 새 사용자와 로그인 상태를 확정합니다.
 *
 * @remarks
 * 도중에 로그아웃되면 취소 오류를 전달해 호출부의 약관 복원과 화면 이동을 막습니다.
 * 프로필 조회는 초기화 순서를 보장하기 위한 인증 계층의 직접 Axios 사용 예외입니다.
 *
 * @param queryClient - 이전 요청을 취소하고 새 사용자 캐시를 저장할 클라이언트입니다.
 * @param fetchUser - 임시 비밀번호 이동처럼 프로필이 필요하지 않으면 false로 지정합니다. 기본값은 true입니다.
 * @returns 조회에 성공한 사용자 응답이며, 조회 생략·일시 장애 시에는 undefined입니다.
 *
 * @example
 * await completeLogin(queryClient);
 */
export async function completeLogin(
  queryClient: QueryClient,
  fetchUser = true
): Promise<GetUsersMeResponse | undefined> {
  await startClientSession();
  const loginSessionEpoch = getSessionEpoch();
  useAuthStore.getState().setStatus("checking");
  useAgreeStore.getState().logout();

  await queryClient.cancelQueries();
  queryClient.clear();
  const user = fetchUser ? await fetchLoginUser(queryClient, loginSessionEpoch) : undefined;

  if (loginSessionEpoch !== getSessionEpoch()) throw new CanceledError("Session changed");
  useAuthStore.getState().setStatus("authenticated");
  window.dispatchEvent(new Event(AUTH_LOGIN_SUCCESS_EVENT));
  return user;
}
