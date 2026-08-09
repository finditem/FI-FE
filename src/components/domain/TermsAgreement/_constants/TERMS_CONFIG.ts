import { useTranslations } from "next-intl";

export const TERMS_CONFIG = [
  { name: "over14Age", validation: { required: true } },
  { name: "privacyPolicyAgreed", validation: { required: true } },
  { name: "termsOfServiceAgreed", validation: { required: true } },
  { name: "marketingConsent", validation: { required: false } },
  { name: "contentPolicyAgreed", validation: { required: false } },
] as const;

export const useTermsConfig = () => {
  const t = useTranslations("TermsConfig");
  return TERMS_CONFIG.map((item) => ({ ...item, label: t(item.name) }));
};
