export const EMAIL_LOGIN_ERROR_MESSAGE = {
  COMMON400: {
    message: "잘못된 요청이에요. 다시 시도해 주세요.",
    status: "warning",
  },
  "AUTH401-INVALID_CREDENTIALS": {
    message: "아이디 또는 비밀번호가 일치하지 않아요",
    status: "warning",
  },
  COMMON500: {
    message: "서버에러로 관리자에게 문의 해주세요.",
    status: "error",
  },
  ERR_BAD_REQUEST: {
    message: "잘못된 요청이에요.",
    status: "warning",
  },
} as const;
