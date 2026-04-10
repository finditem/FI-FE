import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useAgreeStore } from "@/store";
import { useRouter } from "next/navigation";

export interface kakaoTermType {
  privacyPolicyAgreed?: boolean;
  termsOfServiceAgreed?: boolean;
  contentPolicyAgreed?: boolean;
  marketingConsent?: boolean;
}

export const usePatchKakaoTerms = () => {
  const router = useRouter();
  const { setAgreed } = useAgreeStore();

  return useAppMutation<kakaoTermType, ApiBaseResponseType<undefined>, undefined>(
    "auth",
    "/users/me/terms",
    "patch",
    {
      onSuccess: () => {
        setAgreed();
        router.replace("/");
      },
    }
  );
};
