import useAppQuery from "@/api/_base/query/useAppQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { AxiosError } from "axios";

export const useApiCheckNickname = (nickname: string) => {
  return useAppQuery<ApiBaseResponseType<null>, AxiosError<ApiBaseResponseType<null>>>(
    "public",
    ["/auth/check-nickname", nickname],
    `/auth/check-nickname?nickname=${nickname}`,
    {
      enabled: !!nickname,
      retry: false,
    }
  );
};
