"use client";
"use no memo";

import { useFormContext } from "react-hook-form";
import { InputText } from "@/components";
import { useTranslations } from "next-intl";

const PasswordConfirmSection = () => {
  const t = useTranslations("ChangePassword");
  const {
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  const newPassword = watch("newPassword");
  const error = errors?.newPassword;

  const message = t("passwordRule");
  const isSuccess = !!newPassword && !error;

  return (
    <>
      <section className="flex min-h-[96px] flex-col gap-2">
        <InputText
          label={t("newPasswordLabel")}
          inputOption={{
            name: "newPassword",
            type: "password",
            required: true,
            placeholder: t("newPasswordPlaceholder"),
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
                value !== getValues("currentPassword") || t("sameAsCurrentPassword"),
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
          label={t("newPasswordConfirmLabel")}
          inputOption={{
            name: "newPasswordConfirm",
            type: "password",
            placeholder: t("newPasswordConfirmPlaceholder"),
            minLength: 8,
            maxLength: 16,
            validation: {
              required: true,
              validate: (value: string) =>
                value === getValues("newPassword") || t("passwordMismatch"),
            },
          }}
        />
      </section>
    </>
  );
};

export default PasswordConfirmSection;
