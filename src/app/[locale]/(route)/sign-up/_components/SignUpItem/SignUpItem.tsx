"use no memo";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { InputText, InputTextProps } from "@/components";
import { useFormContext, useController, RegisterOptions } from "react-hook-form";
import { FormType } from "../../types/FormType";

type SignUpFieldType = Omit<
  FormType,
  | "privacyPolicyAgreed"
  | "marketingConsent"
  | "termsOfServiceAgreed"
  | "contentPolicyAgreed"
  | "isEmailAuthVerified"
  | "isNicknameVerified"
>;

interface SignUpItemProps extends Omit<InputTextProps, "inputOption"> {
  inputOption: Omit<InputTextProps["inputOption"], "name"> & {
    name: keyof SignUpFieldType;
  };
  isVerified: boolean;
}

const SignUpItem = ({ isVerified, ...props }: SignUpItemProps) => {
  const t = useTranslations("SignUpItem");
  const { control } = useFormContext<SignUpFieldType>();

  const inputValidationRules: Record<
    keyof SignUpFieldType,
    RegisterOptions<SignUpFieldType>
  > = useMemo(
    () => ({
      email: {
        required: t("emailRequired"),
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t("emailInvalid") },
      },
      emailAuth: {
        required: t("emailAuthRequired"),
      },
      password: {
        required: t("passwordRequired"),
        pattern: {
          value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,16}$/,
          message: t("passwordInvalid"),
        },
      },
      passwordConfirm: {
        required: true,
        validate: (value, formValues: SignUpFieldType) =>
          value === formValues.password || t("passwordMismatch"),
        deps: ["password"],
      },
      nickname: {
        required: t("nicknameRequired"),
        pattern: {
          value: /^[a-zA-Z0-9가-힣]+$/,
          message: t("nicknameInvalidChars"),
        },
        minLength: {
          value: 2,
          message: t("nicknameLength"),
        },
        maxLength: {
          value: 10,
          message: t("nicknameLength"),
        },
      },
    }),
    [t]
  );

  const { inputOption, label, btnOption, caption } = props;
  const name = inputOption.name;

  const {
    field,
    fieldState: { error, isDirty },
  } = useController({
    name,
    control,
    rules: inputValidationRules[name],
  });

  const isFieldSuccess = isDirty && !error && !!field.value;

  const isSuccessState = name === "emailAuth" || name === "nickname" ? isVerified : isFieldSuccess;

  return (
    <div className="h-[96px]">
      <InputText
        inputOption={{
          ...inputOption,
          validation: inputValidationRules[name] as any,
        }}
        label={label}
        btnOption={btnOption}
        caption={{
          ...caption,
          isSuccess: isSuccessState,
          timer: caption?.timer,
        }}
      />
    </div>
  );
};

export default SignUpItem;
