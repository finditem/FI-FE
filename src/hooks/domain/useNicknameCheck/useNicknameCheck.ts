import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useToast } from "@/context/ToastContext";
import { useApiCheckNickname } from "@/api/fetch/auth";

/**
 * 닉네임 중복 확인 로직을 관리, 닉네임 중복 확인 api를 호출 후 그에 맞는 토스트와 caption을 보여주는 커스텀 훅입니다.
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
