export const EMAIL_LOGIN_CONFIG = [
  {
    inputOption: {
      name: "email",
      type: "text",
      placeholder: "이메일을 입력해주세요.",
      validation: {
        required: true,
      },
    },
    label: "아이디(이메일)",
  },
  {
    inputOption: {
      name: "password",
      type: "password",
      placeholder: "비밀번호를 입력해주세요.",
      validation: {
        required: true,
      },
    },
    label: "비밀번호",
  },
] as const;
