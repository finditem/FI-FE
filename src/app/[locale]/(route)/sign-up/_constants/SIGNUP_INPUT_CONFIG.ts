export const SIGNUP_INPUT_CONFIG = [
  {
    inputOption: {
      name: "email",
      type: "text",
      placeholder: "이메일을 입력해 주세요.",
      maxLength: 256,
    },
    label: "아이디(이메일)",
    btnOption: {
      btnLabel: "인증번호 발송",
    },
    caption: {},
  },
  {
    inputOption: {
      name: "emailAuth",
      type: "text",
      placeholder: "인증번호를 입력해 주세요.",
      maxLength: 6,
    },
    btnOption: {
      btnLabel: "인증번호 확인",
    },
    caption: {
      successMessage: "인증되었습니다.",
    },
    label: "이메일 인증",
  },
  {
    inputOption: {
      name: "password",
      type: "password",
      maxLength: 16,
      placeholder: "비밀번호을 입력해 주세요.",
    },
    btnOption: {},
    caption: {
      rule: "8~16자리, 대문자/소문자/숫자/특수 문자 포함",
      successMessage: "대문자/소문자/숫자/특수 문자 포함 8~16자리 사이",
    },
    label: "비밀번호",
  },
  {
    inputOption: {
      name: "passwordConfirm",
      type: "password",
      placeholder: "비밀번호 한번 더 입력해 주세요.",
      maxLength: 16,
    },
    btnOption: {},
    caption: {
      successMessage: "비밀번호가 일치합니다.",
    },
    label: "비밀번호 확인",
  },
  {
    inputOption: {
      name: "nickname",
      type: "text",
      placeholder: "닉네임을 입력해 주세요.",
      maxLength: 10,
    },
    btnOption: {
      btnLabel: "중복 확인",
    },
    caption: {
      rule: "2~10자, 특수문자/금칙어 제한",
      successMessage: "사용할 수 있는 닉네임입니다.",
    },
    label: "닉네임",
  },
] as const;
