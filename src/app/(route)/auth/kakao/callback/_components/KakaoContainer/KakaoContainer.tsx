"use client";
"use no memo";

import { useApiKakaoLogin } from "@/api/fetch/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import TermAgree from "../TermAgree/TermAgree";
import { Terms } from "@/components/domain";
import { FormProvider, useForm } from "react-hook-form";
import KakaoLoading from "../KakaoLoading/KakaoLoading";

const KakaoContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const term = searchParams.has("term");
  const termName = searchParams.get("termName") ?? "";

  const isRequesting = useRef(false);

  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();

  const appEnv = process.env.NODE_ENV === "production" ? "prod" : "dev";

  useEffect(() => {
    if (!code || term) return;
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
            const { isNewUser } = res.result;
            if (isNewUser) {
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
        {term && !termName && (
          <TermAgree
            onOpenDetail={(termName) =>
              router.push(`/auth/kakao/callback?term&termName=${termName}`)
            }
          />
        )}
        {termName && (
          <Terms
            termName={termName}
            onAgree={() => {
              setValue(termName, true, { shouldDirty: true, shouldValidate: true });
              router.push(`/auth/kakao/callback?term`);
            }}
            showButton={true}
            pageType="SIGN_UP"
          />
        )}
      </form>

      {!term && !termName && <KakaoLoading />}
    </FormProvider>
  );
};

export default KakaoContainer;
