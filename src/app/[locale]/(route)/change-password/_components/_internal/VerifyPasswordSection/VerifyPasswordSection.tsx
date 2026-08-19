"use client";
"use no memo";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { usePostVerifyPassword } from "@/api/fetch/user";
import { InputText, SnackBar } from "@/components";
import { useTranslations } from "next-intl";

const VerifyPasswordSection = () => {
  const t = useTranslations("ChangePassword");
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
        message: t("passwordMismatch"),
      });
    }
  };

  const buttonDisabled = isPending || isVerifySuccess || !getValues("currentPassword");

  return (
    <>
      <section className="flex min-h-[92px] flex-col gap-2">
        <InputText
          label={t("currentPasswordLabel")}
          inputOption={{
            name: "currentPassword",
            type: "password",
            autoFocus: true,
            placeholder: t("currentPasswordPlaceholder"),
            minLength: 8,
            maxLength: 16,
            disabled: isVerifySuccess,
            validation: {
              required: true,
            },
          }}
          btnOption={{
            btnLabel: t("verifyPassword"),
            btnOnClick: handleToVerifyPassword,
            disabled: buttonDisabled,
          }}
          caption={{
            isSuccess: isVerifySuccess,
            successMessage: t("passwordMatch"),
          }}
        />
      </section>

      {showSnackBar && (
        <SnackBar
          message={t("forgotPassword")}
          actionLabel={t("findPassword")}
          actionHandler={() => router.push("/find-pw")}
        />
      )}
    </>
  );
};

export default VerifyPasswordSection;
