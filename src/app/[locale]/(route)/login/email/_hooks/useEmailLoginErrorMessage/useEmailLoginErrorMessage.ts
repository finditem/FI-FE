import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { EMAIL_LOGIN_ERROR_STATUS } from "../../_constants/EMAIL_LOGIN_ERROR_MESSAGE";

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
