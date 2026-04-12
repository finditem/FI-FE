"use client";

import { useSignUpFlow } from "../../_hooks/useSignUpFlow";
import SignUpField from "../SignUpField/SignUpField";
import { useSignUpSubmit } from "../../_hooks/useSignUpSubmit";
import { useFormContext } from "react-hook-form";
import { Terms, TermsAgreement } from "@/components/domain";

const SignUpContainer = () => {
  const { submitSignUp, isPending } = useSignUpSubmit();

  const { step, onNext, openTermDetail, onAgreeTerm, completeTerms, termName } = useSignUpFlow({
    onSubmit: submitSignUp,
  });

  const { setValue } = useFormContext();

  return (
    <form className="h-bf-base flex w-full flex-1 flex-col justify-between">
      {step === "1" && <SignUpField onNext={() => onNext(2)} />}
      {step === "2" && !termName && (
        <TermsAgreement
          onOpenDetail={openTermDetail}
          onComplete={completeTerms}
          isPending={isPending}
        />
      )}
      {step === "2" && termName && (
        <Terms
          termName={termName}
          onAgree={() => {
            setValue(termName, true, { shouldDirty: true, shouldValidate: true });
            onAgreeTerm(2);
          }}
          showButton={true}
          pageType="SIGN_UP"
        />
      )}
    </form>
  );
};

export default SignUpContainer;
