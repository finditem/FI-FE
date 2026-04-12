import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { AxiosError } from "axios";

interface ApiEmailLoginType {
  email: string;
  password: string;
}

interface EmailLoginResponseType extends ApiBaseResponseType<{
  userId: string;
  temporaryPassword: boolean;
}> {}

const useApiEmailLogin = () => {
  return useAppMutation<
    ApiEmailLoginType,
    EmailLoginResponseType,
    AxiosError<ApiBaseResponseType<null>>
  >("auth", "auth/login", "post");
};

export default useApiEmailLogin;
