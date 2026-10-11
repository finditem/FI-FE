import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useAgreeStore } from "@/store";
import { usePatchKakaoTerms } from "@/api/fetch/user";
import { isValidCallbackUrl, verifyOAuthState } from "@/utils";

type OAuthProvider = "kakao" | "apple";

interface OAuthLoginResponse {
  result: {
    termsAgreed: boolean;
    isTemporaryPassword: boolean;
  };
}

interface UseOAuthLoginCallbackParams<TResponse extends OAuthLoginResponse> {
  provider: OAuthProvider;
  loginMutate: (
    payload: { code: string; environment: string },
    options: { onSuccess: (res: TResponse) => void }
  ) => void;
}

const useOAuthLoginCallback = <TResponse extends OAuthLoginResponse>({
  provider,
  loginMutate,
}: UseOAuthLoginCallbackParams<TResponse>) => {
  const { termsAgreed, isLoggedIn, login } = useAgreeStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const termName = searchParams.get("termName") ?? "";

  const callbackPath = `/auth/${provider}/callback`;

  const [step, setStep] = useState<"Term" | "Loading" | "NoAction">(() => {
    if (code) return "Loading";
    if (isLoggedIn && !termsAgreed) return "Term";
    return "NoAction";
  });

  const isRequesting = useRef(false);

  const { mutate: patchTermsMutate, isPending: isPatchTermsPending } = usePatchKakaoTerms();

  const appEnv =
    process.env.NEXT_PUBLIC_APP_ENV || (process.env.NODE_ENV === "production" ? "prod" : "dev");

  useEffect(() => {
    if (!code || step === "Term") return;
    if (isRequesting.current) return;

    isRequesting.current = true;

    if (!verifyOAuthState(state)) {
      setStep("NoAction");
      return;
    }

    if (code) {
      loginMutate(
        { code, environment: appEnv },
        {
          onSuccess: (res) => {
            const { termsAgreed, isTemporaryPassword } = res.result;
            login(termsAgreed);

            if (termsAgreed) {
              if (isTemporaryPassword) {
                router.replace("/change-password?reason=temporary-password");
                return;
              }

              const rawCallback = sessionStorage.getItem("callbackUrl");
              sessionStorage.removeItem("callbackUrl");
              router.replace(isValidCallbackUrl(rawCallback) ? rawCallback : "/");
            } else {
              if (isTemporaryPassword) {
                sessionStorage.setItem("isTemporaryPassword", "true");
              }
              setStep("Term");
            }
          },
        }
      );
    }

    if (isLoggedIn && !termsAgreed) {
      setStep("Term");
    }
  }, [code, state, loginMutate, router, appEnv, login, step]);

  const methods = useForm();
  const { setValue } = methods;

  const handleTermsSubmit = () => {
    const values = methods.getValues();
    const payload = {
      privacyPolicyAgreed: values.privacyPolicyAgreed,
      termsOfServiceAgreed: values.termsOfServiceAgreed,
      contentPolicyAgreed: values.contentPolicyAgreed,
      marketingConsent: values.marketingConsent,
    };
    patchTermsMutate(payload);
  };

  return {
    router,
    step,
    termName,
    methods,
    setValue,
    handleTermsSubmit,
    isPatchTermsPending,
    callbackPath,
  };
};

export default useOAuthLoginCallback;
