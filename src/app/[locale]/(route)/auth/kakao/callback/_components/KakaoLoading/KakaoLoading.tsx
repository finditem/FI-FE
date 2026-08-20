import { Icon } from "@/components";
import { useTranslations } from "next-intl";

const KakaoLoading = () => {
  const t = useTranslations("KakaoCallback");

  return (
    <div className="flex min-h-screen w-full flex-col-center">
      <div className="flex flex-col items-center gap-4">
        <Icon name="Loading" className="animate-spin" size={40} />
        <p className="text-body1-regular text-gray-700">{t("loading")}</p>
      </div>
    </div>
  );
};

export default KakaoLoading;
