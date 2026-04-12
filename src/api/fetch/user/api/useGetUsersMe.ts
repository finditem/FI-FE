import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetUsersMeResponse } from "../types/UserMeType";
import { AxiosError } from "axios";

export const useGetUsersMe = (hasToken = true) => {
  return useAppQuery<GetUsersMeResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    ["users-me"],
    "/users/me",
    {
      enabled: hasToken,
      staleTime: 1000 * 60,
    }
  );
};
