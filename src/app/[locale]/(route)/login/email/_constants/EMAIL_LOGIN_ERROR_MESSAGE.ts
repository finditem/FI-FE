import { useMemo } from "react";
import { useTranslations } from "next-intl";

const EMAIL_LOGIN_ERROR_STATUS = {
  COMMON400: "warning",
  "AUTH401-INVALID_CREDENTIALS": "warning",
  COMMON500: "error",
  ERR_BAD_REQUEST: "warning",
} as const;

export const useEmailLoginErrorMessage = () => {
  const t = useTranslations("EmailLoginErrorMessage");

  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(EMAIL_LOGIN_ERROR_STATUS).map(([code, status]) => [
          code,
          { message: t(code), status },
        ])
      ),
    [t]
  );
};
