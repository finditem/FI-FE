import useAppMutation from "@/api/_base/query/useAppMutation";
import { CheckCodeResponseType } from "../types/CheckCodeResponseType";
import { AxiosError } from "axios";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";

const useApiCheckCode = () => {
  return useAppMutation<
    { email: string; code: string },
    CheckCodeResponseType,
    AxiosError<ApiBaseResponseType<null>>
  >("public", "/auth/email/verify", "post");
};

export default useApiCheckCode;
