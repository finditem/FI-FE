import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useToast } from "@/context/ToastContext";
import { useApiCheckNickname } from "@/api/fetch/auth";

/**
 * 닉네임 중복 확인 로직을 관리하며, API 응답에 따른 피드백(토스트, 메시지) 처리를 담당하는 훅입니다.
 *
 * @remarks
 * - API 호출 후 성공 시 폼 상태(`isNicknameVerified`)를 자동으로 업데이트합니다.
 * - 닉네임이 변경되면 인증 상태(`isNicknameVerified`)가 자동으로 초기화됩니다.
 *
 * @returns 닉네임 체크에 필요한 상태와 핸들러 객체
 * - `handleClickNickname`: 중복 확인 버튼 클릭 시 실행할 핸들러
 * - `isNicknameVerified`: 닉네임 중복 확인 완료 여부
 * - `nicknameValue`: 현재 검증을 시도한 닉네임 값
 * - `isNicknameDisabled`: 닉네임 입력창 비활성화 여부 (검증 성공 시 true)
 *
 * @author suhyeon
 */

/**
 * @example
 * ```tsx
 * const {
 *   handleClickNickname,
 *   isNicknameVerified,
 *   isNicknameDisabled
 * } = useNicknameCheck();
 *
 * <InputText
 *   inputOption={{
 *     name: "nickname",
 *     disabled: isNicknameDisabled
 *   }}
 *   btnOption={{
 *     btnLabel: "중복확인",
 *     btnOnClick: () => handleClickNickname("nickname")
 *   }}
 *   caption={{
 *     isSuccess: isNicknameVerified,
 *     successMessage: "사용 가능한 닉네임입니다."
 *   }}
 * />
 * ```
 */

const useNicknameCheck = () => {
  const t = useTranslations("NicknameCheck");
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
        message: t("lengthErrorMessage"),
      });
      addToast(t("lengthErrorToast"), "warning");
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

      addToast(t("verifiedToast"), "success");
    } else if (isError) {
      setIsNicknameVerified(false);
      const errorCode = error.response?.data.code;

      if (errorCode === "NICKNAME_INVALID") {
        setError("nickname", {
          message: t("invalidWordMessage"),
        });
        addToast(t("invalidWordToast"), "warning");
      } else if (errorCode === "NICKNAME_DUPLICATE") {
        setError("nickname", {
          message: t("duplicateMessage"),
        });
        addToast(t("duplicateToast"), "warning");
      } else {
        addToast(t("unexpectedError"), "error");
      }
    }
  }, [data, isSuccess, isError, error, setError, addToast, t]);

  return {
    handleClickNickname,
    isNicknameVerified,
    nicknameValue,
    isNicknameDisabled,
  };
};

export default useNicknameCheck;
