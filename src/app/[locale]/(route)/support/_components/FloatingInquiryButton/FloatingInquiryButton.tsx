import Link from "next/link";
import { useTranslations } from "next-intl";

const FloatingInquiryButton = () => {
  const t = useTranslations("FloatingInquiryButton");

  return (
    <div className="fixed bottom-5 right-5">
      <Link
        href="/inquiry-write"
        className="rounded-2xl px-[34px] py-4 text-body1-semibold text-white bg-fill-brand-normal-default flex-center"
      >
        {t("label")}
      </Link>
    </div>
  );
};

export default FloatingInquiryButton;
