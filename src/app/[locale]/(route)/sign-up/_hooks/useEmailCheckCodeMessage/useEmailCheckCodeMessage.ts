import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { buildErrorMap } from "@/utils";
import { EMAIL_CHECK_CODE_STATUS } from "../../_constants/SIGNUP_ERROR_MESSAGE";

export const useEmailCheckCodeMessage = () => {
  const t = useTranslations("EmailCheckCodeMessage");
  return useMemo(() => buildErrorMap(EMAIL_CHECK_CODE_STATUS, t), [t]);
};
