import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetUsersMeTemperatureResponse } from "../types/UserTemperatureType";
import { AxiosError } from "axios";

/**
 * 내 찾길 온도를 조회합니다.
 *
 * @remarks
 * - 온도는 매주 월요일 04:00(KST)에만 갱신되어 게시글 작성, 찾기 완료, 후기 수신 직후에도 값이 바뀌지 않습니다.
 *   그래서 활동 후 무효화하지 않고 staleTime을 길게 둡니다.
 * - 401/404는 같은 화면의 `useGetUsersMe` 에러 처리와 공통 인증 흐름에 맡깁니다.
 *
 * @param hasToken 토큰이 있을 때만 조회합니다.
 *
 * @example
 * ```tsx
 * const { data } = useGetUsersMeTemperature(hasToken);
 * <MyPageTemperatureCard temperature={data?.result.temperature} />
 * ```
 */
export const useGetUsersMeTemperature = (hasToken = true) => {
  return useAppQuery<GetUsersMeTemperatureResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    ["users-me-temperature"],
    "/users/me/temperature",
    {
      enabled: hasToken,
      staleTime: 1000 * 60 * 60,
    }
  );
};
