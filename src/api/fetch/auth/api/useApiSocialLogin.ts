import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { AxiosError } from "axios";

type SocialProvider = "kakao" | "apple";

const ERROR_MESSAGES: Record<SocialProvider, Record<string, string>> = {
  kakao: {
    "AUTH400-KAKAO_CODE_INVALID": "카카오 인증코드가 유효하지 않거나 이미 사용되었어요",
    "AUTH500-KAKAO_USERINFO_FAILED": "카카오 사용자 정보 조회에 실패했어요",
    "AUTH409-EMAIL_RECENTLY_DELETED": "탈퇴한 사용자에요",
  },
  apple: {
    "AUTH400-APPLE_CODE_INVALID": "애플 인증코드가 유효하지 않거나 이미 사용되었어요",
    "AUTH401-APPLE_ID_TOKEN_INVALID": "애플 인증 정보를 확인할 수 없어요",
  },
};

export const useApiSocialLogin = <
  TRequest extends { code: string; environment: string },
  TResponse,
>(
  provider: SocialProvider
) => {
  const router = useRouter();

  const { addToast } = useToast();

  return useAppMutation<TRequest, TResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    `/auth/${provider}`,
    "post",
    {
      onSuccess: () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent(AUTH_LOGIN_SUCCESS_EVENT));
        }
      },
      onError: (error) => {
        const code = error.response?.data.code;
        addToast(
          (code && ERROR_MESSAGES[provider][code]) || "잠시 후 다시 시도해 주세요",
          "warning"
        );
        router.replace("/login");
      },
    }
  );
};
