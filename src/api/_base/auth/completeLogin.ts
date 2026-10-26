import type { QueryClient } from "@tanstack/react-query";
import { CanceledError } from "axios";
import authApi from "../axios/authApi";
import { getSessionEpoch, isAuthenticationError, startClientSession } from "./authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants/AUTH_EVENTS";
import type { GetUsersMeResponse } from "@/api/fetch/user/types/UserMeType";

export async function completeLogin(queryClient: QueryClient, fetchUser = true) {
  await startClientSession();
  const epoch = getSessionEpoch();
  useAuthStore.getState().setStatus("checking");
  useAgreeStore.getState().logout();
  await queryClient.cancelQueries();
  queryClient.clear();
  let user: GetUsersMeResponse | undefined;
  try {
    if (fetchUser) {
      user = await queryClient.fetchQuery({
        queryKey: ["users-me"],
        queryFn: async ({ signal }) =>
          (await authApi.get<GetUsersMeResponse>("/users/me", { signal })).data,
        retry: false,
      });
    }
  } catch (error) {
    if (isAuthenticationError(error) || epoch !== getSessionEpoch()) throw error;
    // 로그인 자체는 성공했다. 일시적인 프로필 조회 실패는 로그아웃으로 바꾸지 않는다.
  }
  if (epoch !== getSessionEpoch()) throw new CanceledError("Session changed");
  useAuthStore.getState().setStatus("authenticated");
  window.dispatchEvent(new Event(AUTH_LOGIN_SUCCESS_EVENT));
  return user;
}
