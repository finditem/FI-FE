"use no memo";

import { InputText } from "@/components/common";
import { InputTextProps } from "@/components/common/Input/InputText/InputText";
import { useFormContext, useController, RegisterOptions } from "react-hook-form";
import { FormType } from "../../types/FormType";

const inputValidationRules: Record<keyof SignUpFieldType, RegisterOptions<SignUpFieldType>> = {
  email: {
    required: "이메일을 입력해 주세요.",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "이메일 형식을 입력해 주세요." },
  },
  emailAuth: {
    required: "이메일 인증이 필요해요.",
  },
  password: {
    required: "비밀번호를 입력해 주세요.",
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{8,16}$/,
      message: "대문자/소문자/숫자/특수 문자 포함 8자리 이상을 입력해 주세요.",
    },
  },
  passwordConfirm: {
    required: true,
    validate: (value, formValues: SignUpFieldType) =>
      value === formValues.password || "비밀번호가 일치하지 않습니다.",
    deps: ["password"],
  },
  nickname: {
    required: "닉네임을 입력해 주세요.",
    pattern: {
      value: /^[a-zA-Z0-9가-힣]+$/,
      message: "자음·모음 및 특수문자는 입력할 수 없습니다.",
    },
    minLength: {
      value: 2,
      message: "2~10자 사이의 닉네임을 입력해 주세요.",
    },
    maxLength: {
      value: 10,
      message: "2~10자 사이의 닉네임을 입력해 주세요.",
    },
  },
};

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
  const { control } = useFormContext<SignUpFieldType>();

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
