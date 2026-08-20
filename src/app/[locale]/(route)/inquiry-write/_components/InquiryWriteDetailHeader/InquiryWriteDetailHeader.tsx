import { DetailHeader, HeaderPost } from "@/components";
import { useTranslations } from "next-intl";

interface InquiryWriteDetailHeaderProps {
  isDisabled: boolean;
  onSubmit: () => void;
}

const InquiryWriteDetailHeader = ({ isDisabled, onSubmit }: InquiryWriteDetailHeaderProps) => {
  const t = useTranslations("InquiryWrite");

  return (
    <div className="sticky top-0 z-30 border-b border-labelsVibrant-quaternary bg-white">
      <DetailHeader title={t("headerTitle")}>
        <HeaderPost aria-label={t("submitAriaLabel")} disabled={isDisabled} onClick={onSubmit} />
      </DetailHeader>
      <h1 className="sr-only">{t("heading")}</h1>
    </div>
  );
};

export default InquiryWriteDetailHeader;
