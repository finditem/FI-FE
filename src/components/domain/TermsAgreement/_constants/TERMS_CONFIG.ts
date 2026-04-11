export const TERMS_CONFIG = [
  { name: "over14Age", label: "만 14세 이상입니다. (필수)", validation: { required: true } },
  {
    name: "privacyPolicyAgreed",
    label: "개인정보 수집 및 이용 동의 (필수)",
    validation: { required: true },
  },
  { name: "termsOfServiceAgreed", label: "약관 이용 동의 (필수)", validation: { required: true } },
  { name: "marketingConsent", label: "마케팅 수신 동의 (선택)", validation: { required: false } },
  {
    name: "contentPolicyAgreed",
    label: "콘텐츠 활동 동의 (선택)",
    validation: { required: false },
  },
] as const;
