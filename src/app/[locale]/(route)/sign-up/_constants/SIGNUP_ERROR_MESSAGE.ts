export const SIGNUP_ERROR_MESSAGE = {
  "AUTH409-EMAIL_DUPLICATED": {
    message: "이미 가입된 이메일이에요",
    status: "warning",
  },
  "AUTH400-EMAIL_INVALID": { message: "올바른 이메일 형식이 아니에요", status: "warning" },
  "AUTH400-WEAK_PASSWORD": { message: "비밀번호 규칙을 만족하지 않아요", status: "warning" },
  "AUTH409-EMAIL_RECENTLY_DELETED": {
    message: "최근 탈퇴한 이메일이에요. 7일 후 재가입 해주세요",
    status: "success",
  },
  "AUTH400-EMAIL_NOT_VERIFIED": {
    message: "이메일 인증이 완료되지 않았어요. 이메일 인증을 먼저 완료해주세요",
    status: "warning",
  },
  "AUTH400-EMAIL_VERIFY_FAILED": {
    message: "인증코드가 만료되었거나 일치하지 않아요",
    status: "warning",
  },
  COMMON400: { message: "잘못된 요청이에요", status: "error" },
} as const;

export const EMAIL_ERROR_MESSAGE = {
  "AUTH409-EMAIL_DUPLICATED": { message: "이미 존재하는 이메일이에요", status: "warning" },
  _EMAIL_RECENTLY_DELETED: {
    message: "최근 탈퇴한 이메일이에요. 7일 후 재가입 해주세요",
    status: "warning",
  },
  "AUTH500-EMAIL_SEND_FAILED": { message: "이메일 발송에 실패했어요", status: "warning" },
} as const;

export const EMAIL_CHECK_CODE_MESSAGE = {
  _INVALID_CREDENTIALS: { message: "인증번호가 일치하지 않아요", status: "warning" },
  "AUTH400-EMAIL_VERIFY_FAILED": {
    message: "인증번호가 만료되었거나 일치하지 않아요",
    status: "warning",
  },
} as const;
