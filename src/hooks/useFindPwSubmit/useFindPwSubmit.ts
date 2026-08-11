import { useState } from "react";
import { useTranslations } from "next-intl";
import { ApiFindPwType, useApiFindPw } from "@/api/fetch/auth";
import { useFindPwErrorMessage } from "@/constants";
import useErrorToast from "../useErrorToast/useErrorToast";
import { useToast } from "@/context/ToastContext";

const useFindPwSubmit = () => {
  const t = useTranslations("FindPwSubmit");
  const findPwErrorMessage = useFindPwErrorMessage();
  const [email, setEmail] = useState("");
  const { mutate: FindPwMutate, isPending } = useApiFindPw();
  const { handlerApiError } = useErrorToast();
  const { addToast } = useToast();

  const onSubmitFindPassword = (data: ApiFindPwType) => {
    FindPwMutate(data, {
      onSuccess: () => {
        setEmail(data.email);
      },
      onError: (error) => {
        const errorCode = error.response?.data.code;
        if (errorCode) {
          handlerApiError(findPwErrorMessage, errorCode);
        } else {
          addToast(t("unexpectedError"), "error");
        }
      },
    });
  };

  return {
    onSubmitFindPassword,
    isPending,
    email,
  };
};

export default useFindPwSubmit;
