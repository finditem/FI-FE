export const SIGNUP_ERROR_STATUS = {
  "AUTH409-EMAIL_DUPLICATED": "warning",
  "AUTH400-EMAIL_INVALID": "warning",
  "AUTH400-WEAK_PASSWORD": "warning",
  "AUTH409-EMAIL_RECENTLY_DELETED": "success",
  "AUTH400-EMAIL_NOT_VERIFIED": "warning",
  "AUTH400-EMAIL_VERIFY_FAILED": "warning",
  COMMON400: "error",
} as const;

export const EMAIL_ERROR_STATUS = {
  "AUTH409-EMAIL_DUPLICATED": "warning",
  _EMAIL_RECENTLY_DELETED: "warning",
  "AUTH500-EMAIL_SEND_FAILED": "warning",
} as const;

export const EMAIL_CHECK_CODE_STATUS = {
  _INVALID_CREDENTIALS: "warning",
  "AUTH400-EMAIL_VERIFY_FAILED": "warning",
} as const;
