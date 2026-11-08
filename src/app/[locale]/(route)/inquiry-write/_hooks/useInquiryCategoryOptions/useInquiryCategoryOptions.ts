import { INQUIRY_WRITE_CATEGORY_OPTIONS } from "@/constants";
import { useTranslations } from "next-intl";

const useInquiryCategoryOptions = () => {
  const t = useTranslations("InquiryWrite.categories");

  return INQUIRY_WRITE_CATEGORY_OPTIONS.map(({ value }) => ({
    value,
    label: t(value),
  }));
};

export default useInquiryCategoryOptions;
