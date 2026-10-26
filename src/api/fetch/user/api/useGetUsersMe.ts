import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetUsersMeResponse } from "../types/UserMeType";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";

export const useGetUsersMe = (hasToken = true) => {
  const status = useAuthStore((state) => state.status);
  return useAppQuery<GetUsersMeResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    ["users-me"],
    "/users/me",
    {
      enabled: status === "authenticated" || (status === "checking" && hasToken),
      retry: false,
      staleTime: 1000 * 60,
    }
  );
};
