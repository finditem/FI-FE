"use client";
"use no memo";

import { useApiAppleLogin } from "@/api/fetch/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Terms, TermsAgreement, ErrorView } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import AppleLoading from "../AppleLoading/AppleLoading";
import { useAgreeStore } from "@/store";
import { usePatchKakaoTerms } from "@/api/fetch/user";
import { isValidCallbackUrl } from "@/utils";

const AppleContainer = () => {
  const { termsAgreed, isLoggedIn, login } = useAgreeStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const termName = searchParams.get("termName") ?? "";

  const [step, setStep] = useState<"Term" | "Loading" | "NoAction">(() => {
    if (code) return "Loading";
    if (isLoggedIn && !termsAgreed) return "Term";
    return "NoAction";
  });

  const isRequesting = useRef(false);

  const { mutate: AppleLoginMutate } = useApiAppleLogin();
  const { mutate: ApplePatchMutate, isPending } = usePatchKakaoTerms();

  const appEnv =
    process.env.NEXT_PUBLIC_APP_ENV || (process.env.NODE_ENV === "production" ? "prod" : "dev");

  useEffect(() => {
    if (!code || step === "Term") return;
    if (isRequesting.current) return;

    isRequesting.current = true;
    if (code) {
      AppleLoginMutate(
        {
          code: code,
          environment: appEnv,
        },
        {
          onSuccess: (res) => {
            const { termsAgreed } = res.result;
            login(termsAgreed);

            if (termsAgreed) {
              const rawCallback = sessionStorage.getItem("callbackUrl");
              sessionStorage.removeItem("callbackUrl");
              router.replace(isValidCallbackUrl(rawCallback) ? rawCallback : "/");
            } else {
              setStep("Term");
            }
          },
        }
      );
    }

    if (isLoggedIn && !termsAgreed) {
      setStep("Term");
    }
  }, [code, AppleLoginMutate, router, appEnv, login, step]);

  const methods = useForm();
  const { setValue } = methods;

  const handleSubmit = () => {
    const values = methods.getValues();
    const payload = {
      privacyPolicyAgreed: values.privacyPolicyAgreed,
      termsOfServiceAgreed: values.termsOfServiceAgreed,
      contentPolicyAgreed: values.contentPolicyAgreed,
      marketingConsent: values.marketingConsent,
    };
    ApplePatchMutate(payload);
  };

  return (
    <FormProvider {...methods}>
      <form>
        {step === "Term" && !termName && (
          <TermsAgreement
            onComplete={handleSubmit}
            onOpenDetail={(termName) => router.push(`/auth/apple/callback?termName=${termName}`)}
            isPending={isPending}
          />
        )}
        {termName && (
          <Terms
            termName={termName}
            onAgree={() => {
              setValue(termName, true, { shouldDirty: true, shouldValidate: true });
              router.push(`/auth/apple/callback`);
            }}
            showButton={true}
            pageType="SIGN_UP"
          />
        )}
      </form>

      {step === "Loading" && <AppleLoading />}
      {step === "NoAction" && (
        <ErrorView
          iconName="NotFound"
          code="404"
          title="페이지를 찾을 수 없습니다."
          description={
            <>
              존재하지 않는 주소를 입력했거나 <br />
              요청하신 페이지를 사용할 수 없습니다.
            </>
          }
        />
      )}
    </FormProvider>
  );
};

export default AppleContainer;
