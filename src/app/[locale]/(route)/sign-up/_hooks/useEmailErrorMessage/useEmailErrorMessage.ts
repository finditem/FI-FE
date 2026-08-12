import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { buildErrorMap } from "@/utils";
import { EMAIL_ERROR_STATUS } from "../../_constants/SIGNUP_ERROR_MESSAGE";

export const useEmailErrorMessage = () => {
  const t = useTranslations("EmailErrorMessage");
  return useMemo(() => buildErrorMap(EMAIL_ERROR_STATUS, t), [t]);
};
