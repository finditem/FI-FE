import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ToastType } from "@/types";

const SIGNUP_ERROR_STATUS = {
  "AUTH409-EMAIL_DUPLICATED": "warning",
  "AUTH400-EMAIL_INVALID": "warning",
  "AUTH400-WEAK_PASSWORD": "warning",
  "AUTH409-EMAIL_RECENTLY_DELETED": "success",
  "AUTH400-EMAIL_NOT_VERIFIED": "warning",
  "AUTH400-EMAIL_VERIFY_FAILED": "warning",
  COMMON400: "error",
} as const;

const EMAIL_ERROR_STATUS = {
  "AUTH409-EMAIL_DUPLICATED": "warning",
  _EMAIL_RECENTLY_DELETED: "warning",
  "AUTH500-EMAIL_SEND_FAILED": "warning",
} as const;

const EMAIL_CHECK_CODE_STATUS = {
  _INVALID_CREDENTIALS: "warning",
  "AUTH400-EMAIL_VERIFY_FAILED": "warning",
} as const;

const buildErrorMap = <T extends Record<string, ToastType>>(
  statusMap: T,
  t: (key: string) => string
): Record<keyof T, { message: string; status: ToastType }> =>
  Object.fromEntries(
    Object.entries(statusMap).map(([code, status]) => [code, { message: t(code), status }])
  ) as Record<keyof T, { message: string; status: ToastType }>;

export const useSignUpErrorMessage = () => {
  const t = useTranslations("SignUpErrorMessage");
  return useMemo(() => buildErrorMap(SIGNUP_ERROR_STATUS, t), [t]);
};

export const useEmailErrorMessage = () => {
  const t = useTranslations("EmailErrorMessage");
  return useMemo(() => buildErrorMap(EMAIL_ERROR_STATUS, t), [t]);
};

export const useEmailCheckCodeMessage = () => {
  const t = useTranslations("EmailCheckCodeMessage");
  return useMemo(() => buildErrorMap(EMAIL_CHECK_CODE_STATUS, t), [t]);
};
