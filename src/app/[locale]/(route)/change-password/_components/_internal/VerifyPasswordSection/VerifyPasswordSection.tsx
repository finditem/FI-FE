"use client";
"use no memo";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { usePostVerifyPassword } from "@/api/fetch/user";
import { InputText, SnackBar } from "@/components";

const VerifyPasswordSection = () => {
  const router = useRouter();

  const { getValues, setError, clearErrors } = useFormContext();
  const { mutateAsync, isPending } = usePostVerifyPassword();

  const [isVerifySuccess, setIsVerifySuccess] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleToVerifyPassword = async () => {
    const currentPassword = getValues("currentPassword");

    try {
      await mutateAsync({ currentPassword });

      clearErrors("currentPassword");
      setIsVerifySuccess(true);
    } catch {
      setIsVerifySuccess(false);
      setShowSnackBar(true);

      setError("currentPassword", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  };

  const buttonDisabled = isPending || isVerifySuccess || !getValues("currentPassword");

  return (
    <>
      <section className="flex min-h-[92px] flex-col gap-2">
        <InputText
          label="현재 비밀번호"
          inputOption={{
            name: "currentPassword",
            type: "password",
            autoFocus: true,
            placeholder: "현재 비밀번호를 입력해주세요.",
            minLength: 8,
            maxLength: 16,
            disabled: isVerifySuccess,
            validation: {
              required: true,
            },
          }}
          btnOption={{
            btnLabel: "비밀번호 확인",
            btnOnClick: handleToVerifyPassword,
            disabled: buttonDisabled,
          }}
          caption={{
            isSuccess: isVerifySuccess,
            successMessage: "비밀번호가 일치합니다.",
          }}
        />
      </section>

      {showSnackBar && (
        <SnackBar
          message="비밀번호를 잊어버리셨나요?"
          actionLabel="비밀번호 찾기"
          actionHandler={() => router.push("/find-pw")}
        />
      )}
    </>
  );
};

export default VerifyPasswordSection;
