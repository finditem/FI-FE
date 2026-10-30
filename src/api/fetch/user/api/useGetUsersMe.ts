import { USERS_ME_QUERY_KEY } from "@/constants/USER_QUERY_KEYS";
import useAppQuery from "@/api/_base/query/useAppQuery";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { GetUsersMeResponse } from "../types/UserMeType";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";

/**
 * 현재 세션의 사용자 정보를 조회합니다.
 * @remarks 로그인 완료 후에는 과거 서버 쿠키 힌트가 false여도 쿼리를 활성화합니다.
 * @param hasToken - checking 상태에서만 사용하는 서버 쿠키 힌트이며 기본값은 true입니다.
 * @returns 사용자 Query의 데이터와 요청 상태를 반환합니다.
 * @example
 * const { data: user } = useGetUsersMe(hasToken);
 * @author suhyeon
 */
export const useGetUsersMe = (hasToken = true) => {
  const status = useAuthStore((state) => state.status);
  return useAppQuery<GetUsersMeResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    USERS_ME_QUERY_KEY,
    "/users/me",
    {
      enabled: status === "authenticated" || (status === "checking" && hasToken),
      retry: false,
      staleTime: 1000 * 60,
    }
  );
};
