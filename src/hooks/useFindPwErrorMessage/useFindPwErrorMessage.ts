import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { FIND_PW_ERROR_CODES } from "@/constants/FIND_PW_ERROR";

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
