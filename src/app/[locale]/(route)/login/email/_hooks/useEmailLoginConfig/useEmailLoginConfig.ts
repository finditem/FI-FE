import { useTranslations } from "next-intl";

export const useEmailLoginConfig = () => {
  const t = useTranslations("EmailLoginConfig");

  return [
    {
      inputOption: {
        name: "email",
        type: "text",
        placeholder: t("emailPlaceholder"),
        validation: {
          required: true,
        },
      },
      label: t("emailLabel"),
    },
    {
      inputOption: {
        name: "password",
        type: "password",
        placeholder: t("passwordPlaceholder"),
        validation: {
          required: true,
        },
      },
      label: t("passwordLabel"),
    },
  ] as const;
};
