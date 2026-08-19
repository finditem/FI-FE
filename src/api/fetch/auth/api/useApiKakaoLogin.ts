import { KakaoLoginResponseType } from "../types/KakaoLoginResponseType";
import { useApiSocialLogin } from "./useApiSocialLogin";

interface KakaoRequestType {
  code: string;
  environment: string;
  privacyPolicyAgreed?: boolean;
  termsOfServiceAgreed?: boolean;
  contentPolicyAgreed?: boolean;
  marketingConsent?: boolean;
}

export const useApiKakaoLogin = () =>
  useApiSocialLogin<KakaoRequestType, KakaoLoginResponseType>("kakao");
