import { useMemo } from "react";
import { useTranslations } from "next-intl";

const FIND_PW_ERROR_CODES = [
  "COMMON400",
  "USER404-NOT_FOUND",
  "AUTH400-SOCIAL_ACCOUNT",
  "AUTH500-EMAIL_SEND_FAILED",
] as const;

export const useFindPwErrorMessage = () => {
  const t = useTranslations("FindPwErrorMessage");

  return useMemo(
    () =>
      Object.fromEntries(
        FIND_PW_ERROR_CODES.map((code) => [code, { message: t(code), status: "warning" as const }])
      ),
    [t]
  );
};
