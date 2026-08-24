import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AUTH_LOGIN_SUCCESS_EVENT } from "@/constants";
import { AxiosError } from "axios";

type SocialProvider = "kakao" | "apple";

export const useApiSocialLogin = <
  TRequest extends { code: string; environment: string },
  TResponse,
>(
  provider: SocialProvider
) => {
  const router = useRouter();

  const { addToast } = useToast();
  const t = useTranslations("useApiSocialLogin");

  const errorMessages: Record<SocialProvider, Record<string, string>> = {
    kakao: {
      "AUTH400-KAKAO_CODE_INVALID": t("kakaoCodeInvalid"),
      "AUTH500-KAKAO_USERINFO_FAILED": t("kakaoUserInfoFailed"),
      "AUTH409-EMAIL_RECENTLY_DELETED": t("kakaoRecentlyDeleted"),
    },
    apple: {
      "AUTH400-APPLE_CODE_INVALID": t("appleCodeInvalid"),
      "AUTH401-APPLE_ID_TOKEN_INVALID": t("appleTokenInvalid"),
    },
  };

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
        addToast((code && errorMessages[provider][code]) || t("retry"), "warning");
        router.replace("/login");
      },
    }
  );
};
