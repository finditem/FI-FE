import { useMemo } from "react";
import { useTranslations } from "next-intl";

export const useSignUpInputConfig = () => {
  const t = useTranslations("SignUpInputConfig");

  return useMemo(
    () =>
      [
        {
          inputOption: {
            name: "email",
            type: "text",
            placeholder: t("emailPlaceholder"),
            maxLength: 256,
          },
          label: t("emailLabel"),
          btnOption: {
            btnLabel: t("emailBtnLabel"),
          },
          caption: {},
        },
        {
          inputOption: {
            name: "emailAuth",
            type: "text",
            placeholder: t("emailAuthPlaceholder"),
            maxLength: 6,
          },
          btnOption: {
            btnLabel: t("emailAuthBtnLabel"),
          },
          caption: {
            successMessage: t("emailAuthSuccessMessage"),
          },
          label: t("emailAuthLabel"),
        },
        {
          inputOption: {
            name: "password",
            type: "password",
            maxLength: 16,
            placeholder: t("passwordPlaceholder"),
          },
          btnOption: {},
          caption: {
            rule: t("passwordRule"),
            successMessage: t("passwordSuccessMessage"),
          },
          label: t("passwordLabel"),
        },
        {
          inputOption: {
            name: "passwordConfirm",
            type: "password",
            placeholder: t("passwordConfirmPlaceholder"),
            maxLength: 16,
          },
          btnOption: {},
          caption: {
            successMessage: t("passwordConfirmSuccessMessage"),
          },
          label: t("passwordConfirmLabel"),
        },
        {
          inputOption: {
            name: "nickname",
            type: "text",
            placeholder: t("nicknamePlaceholder"),
            maxLength: 10,
          },
          btnOption: {
            btnLabel: t("nicknameBtnLabel"),
          },
          caption: {
            rule: t("nicknameRule"),
            successMessage: t("nicknameSuccessMessage"),
          },
          label: t("nicknameLabel"),
        },
      ] as const,
    [t]
  );
};
