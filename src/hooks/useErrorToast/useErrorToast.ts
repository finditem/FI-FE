import { useToast } from "@/context/ToastContext";
import { ToastType } from "@/types";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

const useErrorToast = () => {
  const t = useTranslations("ErrorToast");
  const { addToast } = useToast();
  const { setError } = useFormContext();

  const handlerApiError = (
    errorConstant: Record<string, { message: string; status: ToastType }>,
    errorCode: string,
    name?: string
  ) => {
    const target = errorConstant[errorCode as keyof typeof errorConstant];
    if (target) {
      if (name) setError(name, { message: target.message });
      addToast(target.message, target.status);
    } else {
      addToast(t("unexpectedError"), "error");
    }
  };

  return { handlerApiError };
};

export default useErrorToast;
