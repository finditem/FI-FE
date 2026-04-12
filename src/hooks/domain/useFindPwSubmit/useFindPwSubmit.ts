import { useState } from "react";
import { ApiFindPwType, useApiFindPw } from "@/api/fetch/auth";
import { FIND_PW_ERROR } from "@/constants";
import useErrorToast from "../useErrorToast/useErrorToast";
import { useToast } from "@/context/ToastContext";

const useFindPwSubmit = () => {
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
          handlerApiError(FIND_PW_ERROR, errorCode);
        } else {
          addToast("예상치 못한 에러가 발생했어요", "error");
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
