import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ApiFindPwType } from "../types/ApiFindPwType";
import { AxiosError } from "axios";

const useApiFindPw = () => {
  return useAppMutation<
    ApiFindPwType,
    ApiBaseResponseType<null>,
    AxiosError<ApiBaseResponseType<null>>
  >("public", "/auth/reset/request", "post");
};

export default useApiFindPw;
