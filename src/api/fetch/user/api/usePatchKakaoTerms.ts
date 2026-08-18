import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useAgreeStore } from "@/store";
import { useRouter } from "next/navigation";
import { isValidCallbackUrl } from "@/utils";

export interface KakaoTermType {
  privacyPolicyAgreed?: boolean;
  termsOfServiceAgreed?: boolean;
  contentPolicyAgreed?: boolean;
  marketingConsent?: boolean;
}

export const usePatchKakaoTerms = () => {
  const router = useRouter();
  const { setAgreed } = useAgreeStore();

  return useAppMutation<KakaoTermType, ApiBaseResponseType<undefined>, undefined>(
    "auth",
    "/users/me/terms",
    "patch",
    {
      onSuccess: () => {
        setAgreed();
        const rawCallback = sessionStorage.getItem("callbackUrl");
        sessionStorage.removeItem("callbackUrl");
        router.replace(isValidCallbackUrl(rawCallback) ? rawCallback : "/");
      },
    }
  );
};
