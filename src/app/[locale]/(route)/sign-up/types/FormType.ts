export interface FormType {
  email: string;
  emailAuth: number;
  password: string;
  passwordConfirm: string;
  nickname: string;
  privacyPolicyAgreed: boolean;
  termsOfServiceAgreed: boolean;
  contentPolicyAgreed: boolean;
  marketingConsent: boolean;
  isEmailAuthVerified?: boolean;
  isNicknameVerified?: boolean;
}
