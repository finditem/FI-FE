"use client";
"use no memo";

import { useApiKakaoLogin } from "@/api/fetch/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TermAgree from "../TermAgree/TermAgree";
import { Terms } from "@/components/domain";
import { FormProvider, useForm } from "react-hook-form";
import KakaoLoading from "../KakaoLoading/KakaoLoading";
import { useAgreeStore } from "@/store";
import { ErrorView } from "@/components/state";

const KakaoContainer = () => {
  const { termsAgreed, isLoggedIn, login } = useAgreeStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const termName = searchParams.get("termName") ?? "";

  const [step, setStep] = useState<"Term" | "Loading" | "NoAction">(() => {
    if (isLoggedIn && !termsAgreed) return "Term";
    if (code) return "Loading";
    return "NoAction";
  });

  const isRequesting = useRef(false);

  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();

  const appEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";

  useEffect(() => {
    if (!code || step === "Term") return;
    if (isRequesting.current) return;

    if (termsAgreed) {
      setStep("Term");
    }

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

            if (!termsAgreed) {
              window.sessionStorage.setItem("auth-type", "KAKAO");
              setStep("Term");
            } else {
              router.replace("/");
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
