"use client";
"use no memo";

import { useFormContext } from "react-hook-form";
import { InputText } from "@/components";

const PasswordConfirmSection = () => {
  const {
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  const newPassword = watch("newPassword");
  const error = errors?.newPassword;

  const message = "대문자/소문자/숫자/특수 문자 포함 8자리 이상";
  const isSuccess = !!newPassword && !error;

  return (
    <>
      <section className="flex min-h-[96px] flex-col gap-2">
        <InputText
          label="새 비밀번호"
          inputOption={{
            name: "newPassword",
            type: "password",
            required: true,
            placeholder: "새 비밀번호를 입력해주세요.",
            minLength: 8,
            maxLength: 16,
            validation: {
              required: true,
              deps: ["newPasswordConfirm"],
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,16}$/,
                message,
              },
              validate: (value: string) =>
                value !== getValues("currentPassword") ||
                "기존 비밀번호와 동일한 비밀번호는 사용할 수 없어요",
            },
          }}
          caption={{
            rule: message,
            successMessage: message,
            isSuccess,
          }}
        />
      </section>

      <section className="flex min-h-[96px] flex-col gap-2">
        <InputText
          label="새 비밀번호 확인"
          inputOption={{
            name: "newPasswordConfirm",
            type: "password",
            placeholder: "비밀번호를 한 번 더 입력해 주세요.",
            minLength: 8,
            maxLength: 16,
            validation: {
              required: true,
              validate: (value: string) =>
                value === getValues("newPassword") || "비밀번호가 일치하지 않습니다.",
            },
          }}
        />
      </section>
    </>
  );
};

export default PasswordConfirmSection;
