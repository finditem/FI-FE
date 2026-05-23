import { useToast } from "@/context/ToastContext";
import { ToastType } from "@/types";
import { useFormContext } from "react-hook-form";

const useErrorToast = () => {
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
      addToast("예상치 못한 에러가 발생했어요", "error");
    }
  };

  return { handlerApiError };
};

export default useErrorToast;
