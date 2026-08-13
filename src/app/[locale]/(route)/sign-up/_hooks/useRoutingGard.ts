import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const useRoutingGard = () => {
  const t = useTranslations("RoutingGard");
  const router = useRouter();

  const searchParams = useSearchParams();
  const gardStep = searchParams.get("step") ?? "1";

  const [maxStep, setMaxStep] = useState<number>(1);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("signup-max-step");
    if (stored) {
      setMaxStep(Number(stored));
    }
  }, []);

  useEffect(() => {
    const isStep = gardStep === "1" || gardStep === "2";
    if (!isStep) {
      router.replace(`/sign-up?step=1`);
    }
    if (Number(gardStep) > maxStep) {
      alert(t("invalidAccess"));
      router.replace(`/sign-up?step=${maxStep}`);
    }
  }, [gardStep, maxStep, router, t]);

  // 외부 함수로 maxStep 업데이트
  const updateMaxStep = (nextStep: number) => {
    setMaxStep((prev) => {
      const newStep = nextStep > prev ? nextStep : prev;
      window.sessionStorage.setItem("signup-max-step", String(newStep));
      return newStep;
    });
  };

  return {
    updateMaxStep,
  };
};
