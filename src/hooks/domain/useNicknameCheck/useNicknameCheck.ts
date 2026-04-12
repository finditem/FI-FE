import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useToast } from "@/context/ToastContext";
import { useApiCheckNickname } from "@/api/fetch/auth";

const useNicknameCheck = () => {
  const [nicknameValue, setNicknameValue] = useState("");
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isNicknameDisabled, setIsNicknameDisabled] = useState(false);

  const { addToast } = useToast();
  const { getValues, control, setError, setValue } = useFormContext();

  const currentNickname = useWatch({
    control,
    name: "nickname",
  });

  useEffect(() => {
    if (isNicknameDisabled) return;
    setIsNicknameVerified(false);
  }, [currentNickname, isNicknameDisabled]);

  const { data, isSuccess, isError, error } = useApiCheckNickname(nicknameValue);

  const handleClickNickname = (name: string) => {
    const nickname = getValues(name).trim();

    if (nickname.length < 2) {
      setError("nickname", {
        message: "2~10자 사이의 닉네임을 입력해 주세요.",
      });
      addToast("2~10자 사이의 닉네임을 입력해 주세요", "warning");
      return;
    }

    setIsNicknameVerified(false);
    setNicknameValue(nickname);
  };

  // api 호출 후
  useEffect(() => {
    if (isSuccess) {
      setIsNicknameVerified(true);
      setIsNicknameDisabled(true);
      setValue("isNicknameVerified", true, { shouldValidate: true });

      addToast("사용할 수 있는 닉네임이에요.", "success");
    } else if (isError) {
      setIsNicknameVerified(false);
      const errorCode = error.response?.data.code;

      if (errorCode === "NICKNAME_INVALID") {
        setError("nickname", {
          message: "사용할 수 없는 단어가 포함되어 있어요.",
        });
        addToast("사용할 수 없는 단어가 포함되어 있어요", "warning");
      } else if (errorCode === "NICKNAME_DUPLICATE") {
        setError("nickname", {
          message: "이미 사용 중인 닉네임이에요.",
        });
        addToast("이미 사용중인 닉네임이에요", "warning");
      } else {
        addToast("예상치 못한 오류가 발생했어요", "error");
      }
    }
  }, [data, isSuccess, isError, error, setError, addToast]);

  return {
    handleClickNickname,
    isNicknameVerified,
    nicknameValue,
    isNicknameDisabled,
  };
};

export default useNicknameCheck;
