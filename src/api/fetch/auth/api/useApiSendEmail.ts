import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { AxiosError } from "axios";

export const useApiSendEmail = () => {
  return useAppMutation<
    { email: string },
    ApiBaseResponseType<null>,
    AxiosError<ApiBaseResponseType<null>>
  >("public", "/auth/email/send-code", "post");
};
