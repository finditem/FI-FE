import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { KakaoLoginResponseType } from "../types/KakaoLoginResponseType";

interface KakaoRequestType {
  code: string;
  environment: string;
  privacyPolicyAgreed?: boolean;
  termsOfServiceAgreed?: boolean;
  contentPolicyAgreed?: boolean;
  marketingConsent?: boolean;
}

const useApiKakaoLogin = () => {
  const router = useRouter();

  const { addToast } = useToast();

  return useAppMutation<KakaoRequestType, KakaoLoginResponseType, ApiBaseResponseType<null>>(
    "auth",
    "/auth/kakao",
    "post",
    {
      onSuccess: () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
        }
        router.replace("/");
      },
      onError: (error) => {
        if (error.code === "AUTH400-KAKAO_CODE_INVALID")
          addToast("카카오 인증코드가 유효하지 않거나 이미 사용되었어요", "warning");
        else if (error.code === "AUTH500-KAKAO_USERINFO_FAILED")
          addToast("카카오 사용자 정보 조회에 실패했어요", "warning");
        else addToast("잠시 후 다시 시도해 주세요", "warning");
        router.replace("/login");
      },
    }
  );
};

export default useApiKakaoLogin;
