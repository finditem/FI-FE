import useAppMutation from "@/api/_base/query/useAppMutation";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { completeLogin } from "@/api/_base/auth/completeLogin";

type SocialProvider = "kakao" | "apple";

/**
 * 소셜 로그인 성공 후 사용자 캐시와 인증 상태의 확정을 기다립니다.
 * @param provider - 로그인할 소셜 제공자입니다.
 * @returns 소셜 로그인 요청과 공통 완료 처리를 포함한 mutation 상태를 반환합니다.
 * @example
 * const login = useApiSocialLogin<KakaoLoginRequest, KakaoLoginResponse>("kakao");
 * @author suhyeon
 */
export const useApiSocialLogin = <
  TRequest extends { code: string; environment: string },
  TResponse,
>(
  provider: SocialProvider
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      onSuccess: async () => {
        await completeLogin(queryClient);
      },
      onError: (error) => {
        const code = error.response?.data.code;
        addToast((code && errorMessages[provider][code]) || t("retry"), "warning");
        router.replace("/login");
      },
    }
  );
};
