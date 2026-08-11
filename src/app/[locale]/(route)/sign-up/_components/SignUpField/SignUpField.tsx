"use no memo";

import { useTranslations } from "next-intl";
import { useSignUpInputConfig } from "../../_constants/SIGNUP_INPUT_CONFIG";
import { DetailHeader, FooterButton } from "@/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useSignUpBtnClick } from "../../_hooks/useSignUpBtnClick";
import { useEffect } from "react";
import SignUpItem from "../SignUpItem/SignUpItem";

const SignUpField = ({ onNext }: { onNext: () => void }) => {
  const t = useTranslations("SignUpField");
  const signUpInputConfig = useSignUpInputConfig();
  const {
    control,
    trigger,
    setFocus,
    formState: { isValid },
  } = useFormContext();

  const isEmailAuthVerifiedForm = useWatch({ control, name: "isEmailAuthVerified" });
  const isNicknameVerifiedForm = useWatch({ control, name: "isNicknameVerified" });

  const {
    isEmailDisabled,
    isEmailAuthDisabled,
    isEmailAuthVerified: isEmailAuthVerifiedLocal,
    handlerToClick,
    isNicknameVerified: isNicknameVerifiedLocal,
    isNicknameDisabled,
    EmailPending,
    EmailCodePending,
    timer,
  } = useSignUpBtnClick();

  const finalEmailVerified = isEmailAuthVerifiedForm || isEmailAuthVerifiedLocal;
  const finalNicknameVerified = isNicknameVerifiedForm || isNicknameVerifiedLocal;

  const handleVerified = (name: string) => {
    if (name === "emailAuth") return finalEmailVerified;
    if (name === "nickname") return finalNicknameVerified;
    return false;
  };

  const isNextEnabled = isValid && finalEmailVerified && finalNicknameVerified;

  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    void trigger("passwordConfirm");
  }, [password, trigger]);

  const handleDisabled = (name: string) => {
    if (name === "emailAuth") return isEmailAuthDisabled;
    else if (name === "email") return isEmailDisabled;
    else if (name === "nickname") return isNicknameDisabled;
  };

  const handleBtnDisabled = (name: string) => {
    if (name === "emailAuth") return EmailCodePending;
    else if (name === "email") return EmailPending || timer > 0;
  };

  const handleTimer = (name: string) => {
    if (name === "emailAuth" && timer > 0) return timer;
  };

  return (
    <>
      <DetailHeader title={t("title")} />
      <div className="flex w-full flex-1 flex-col gap-5 px-4 py-5 h-hfb-base tablet:px-[80px]">
        {signUpInputConfig.map((item) => (
          <SignUpItem
            key={item.inputOption.name}
            {...item}
            isVerified={handleVerified(item.inputOption.name)}
            inputOption={{
              disabled: handleDisabled(item.inputOption.name),
              autoFocus: item.inputOption.name === "email",
              ...item.inputOption,
            }}
            btnOption={{
              ...item.btnOption,
              btnOnClick: () => handlerToClick(item.inputOption.name, setFocus),
              disabled: handleBtnDisabled(item.inputOption.name),
            }}
            caption={{
              ...item.caption,
              timer: handleTimer(item.inputOption.name),
            }}
          />
        ))}
      </div>

      <FooterButton aria-label={t("nextAriaLabel")} onClick={onNext} disabled={!isNextEnabled}>
        {t("next")}
      </FooterButton>
    </>
  );
};

export default SignUpField;
