export const FIND_PW_ERROR = {
  COMMON400: { message: "잘못된 요청이에요", status: "warning" },
  "USER404-NOT_FOUND": { message: "등록되지 않은 이메일이에요", status: "warning" },
  "AUTH400-SOCIAL_ACCOUNT": { message: "해당 이메일은 소셜 로그인 계정이에요", status: "warning" },
  "AUTH500-EMAIL_SEND_FAILED": {
    message: "이메일 발송에 실패했어요. 잠시 후 다시 시도해 주세요",
    status: "warning",
  },
} as const;
