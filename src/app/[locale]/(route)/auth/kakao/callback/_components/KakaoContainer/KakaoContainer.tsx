"use client";
"use no memo";

import { useApiKakaoLogin } from "@/api/fetch/auth";
import { Terms, TermsAgreement, ErrorView } from "@/components";
import { FormProvider } from "react-hook-form";
import KakaoLoading from "../KakaoLoading/KakaoLoading";
import { useOAuthLoginCallback } from "@/hooks";
import { useTranslations } from "next-intl";

const KakaoContainer = () => {
  const t = useTranslations("KakaoCallback");
  const { mutate: KakaoLoginMutate } = useApiKakaoLogin();

  const {
    router,
    step,
    termName,
    methods,
    setValue,
    handleTermsSubmit,
    isPatchTermsPending,
    callbackPath,
  } = useOAuthLoginCallback({ provider: "kakao", loginMutate: KakaoLoginMutate });

  return (
    <FormProvider {...methods}>
      <form>
        {step === "Term" && !termName && (
          <TermsAgreement
            onComplete={handleTermsSubmit}
            onOpenDetail={(termName) => router.push(`${callbackPath}?termName=${termName}`)}
            isPending={isPatchTermsPending}
          />
        )}
        {termName && (
          <Terms
            termName={termName}
            onAgree={() => {
              setValue(termName, true, { shouldDirty: true, shouldValidate: true });
              router.push(callbackPath);
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
          title={t("notFoundTitle")}
          description={
            <>
              {t("notFoundDescriptionLine1")} <br />
              {t("notFoundDescriptionLine2")}
            </>
          }
        />
      )}
    </FormProvider>
  );
};

export default KakaoContainer;
