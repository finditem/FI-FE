import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { FormType } from "../types/FormType";
import { useRoutingGard } from "./useRoutingGard";
import { ApiSignUpType } from "@/api/fetch/auth";

interface useSignUpFlowProps {
  onSubmit: (data: ApiSignUpType) => void;
}

export const useSignUpFlow = ({ onSubmit }: useSignUpFlowProps) => {
  const { updateMaxStep } = useRoutingGard();

  const searchParams = useSearchParams();
  const router = useRouter();

  // 컴포넌트 전환 변수
  const step = searchParams.get("step") ?? "1";
  const termName = searchParams.get("term") ?? "";

  const { trigger, getValues } = useFormContext<FormType>();

  // 회원가입 1단계 -> 2단계
  const onNext = useCallback(
    async (nextStep: number) => {
      const ok = await trigger(["email", "password", "nickname"]);
      if (ok) {
        updateMaxStep(nextStep);
        router.push(`/sign-up?step=${nextStep}`);
      }
    },
    [trigger, router]
  );

  // 약관 상세 열기
  const openTermDetail = useCallback((termKey: string) => {
    router.push(`/sign-up?step=2&term=${termKey}`);
  }, []);

  // 세부 약관 -> 약관 동의
  const onAgreeTerm = useCallback(async (preStep: number) => {
    router.push(`/sign-up?step=${preStep}`);
  }, []);

  // 약관 동의 -> 최종제출 전 데이터 필터링
  const completeTerms = useCallback(async () => {
    const ok = await trigger(["privacyPolicyAgreed", "marketingConsent"]);
    if (ok) {
      const data = getValues();
      const selectedData = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        privacyPolicyAgreed: data.privacyPolicyAgreed,
        termsOfServiceAgreed: data.termsOfServiceAgreed,
        contentPolicyAgreed: data.contentPolicyAgreed,
        marketingConsent: data.marketingConsent,
      };
      onSubmit(selectedData);
    }
  }, [trigger, onSubmit]);

  return {
    step,
    onNext,
    openTermDetail,
    onAgreeTerm,
    completeTerms,
    termName,
  };
};
