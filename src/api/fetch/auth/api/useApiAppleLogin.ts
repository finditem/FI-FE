import { AppleLoginResponseType } from "../types/AppleLoginResponseType";
import { useApiSocialLogin } from "./useApiSocialLogin";

interface AppleRequestType {
  code: string;
  environment: string;
}

export const useApiAppleLogin = () =>
  useApiSocialLogin<AppleRequestType, AppleLoginResponseType>("apple");
