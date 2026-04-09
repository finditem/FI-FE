"use client";
"use no memo";

import { useApiKakaoLogin } from "@/api/fetch/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TermAgree from "../TermAgree/TermAgree";
import { Terms } from "@/components/domain";
import { FormProvider, useForm } from "react-hook-form";
import KakaoLoading from "../KakaoLoading/KakaoLoading";

const KakaoContainer = () => {
  const [step, setStep] = useState<"Term" | "Loading">("Loading");

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const termName = searchParams.get("termName") ?? "";

  const isRequesting = useRef(false);

  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();

  const appEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";

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
            if (!termsAgreed) {
              window.sessionStorage.setItem("auth-type", "KAKAO");
              router.replace("/auth/kakao/callback?term");
            }
          },
        }
      );
    }
  }, [code, KakaoLoginMutate, router]);

  const methods = useForm();
  const { setValue } = methods;

  return (
    <FormProvider {...methods}>
      <form>
        {step === "Term" && !termName && (
          <TermAgree
            onOpenDetail={(termName) => router.push(`/auth/kakao/callback?termName=${termName}`)}
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
    </FormProvider>
  );
};

export default KakaoContainer;
