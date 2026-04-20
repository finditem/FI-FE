"use client";
"use no memo";

import { useApiKakaoLogin } from "@/api/fetch/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Terms, TermsAgreement } from "@/components/domain";
import { FormProvider, useForm } from "react-hook-form";
import KakaoLoading from "../KakaoLoading/KakaoLoading";
import { useAgreeStore } from "@/store";
import { ErrorView } from "@/components/state";
import { usePatchKakaoTerms } from "@/api/fetch/user";

const KakaoContainer = () => {
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

  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();
  const { mutate: KakaoPatchMutate, isPending } = usePatchKakaoTerms();

  const appEnv =
    process.env.NEXT_PUBLIC_APP_ENV || (process.env.NODE_ENV === "production" ? "prod" : "dev");

  useEffect(() => {
    if (!code || step === "Term") return;
    if (isRequesting.current) return;

    isRequesting.current = true;
    if (code) {
      KakaoLoginMutate(
        {
          code: code,
          environment: appEnv,
        },
        {
          onSuccess: (res) => {
            const { termsAgreed } = res.result;
            login(termsAgreed);

            if (termsAgreed) {
              router.replace("/");
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
  }, [code, KakaoLoginMutate, router, appEnv, login, step]);

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
    KakaoPatchMutate(payload);
  };

  return (
    <FormProvider {...methods}>
      <form>
        {step === "Term" && !termName && (
          <TermsAgreement
            onComplete={handleSubmit}
            onOpenDetail={(termName) => router.push(`/auth/kakao/callback?termName=${termName}`)}
            isPending={isPending}
          />
        )}
        {termName && (
          <Terms
            termName={termName}
            onAgree={() => {
              setValue(termName, true, { shouldDirty: true, shouldValidate: true });
              router.push(`/auth/kakao/callback`);
            }}
            showButton={true}
            pageType="SIGN_UP"
          />
        )}
      </form>

      {step === "Loading" && <KakaoLoading />}
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

export default KakaoContainer;
