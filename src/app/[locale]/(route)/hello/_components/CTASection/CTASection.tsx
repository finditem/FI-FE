import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";

const CTASection = () => {
  const t = useTranslations("HelloPage.cta");

  return (
    <section
      aria-labelledby="service-introduce-cta-title"
      className="w-full gap-5 px-9 py-[60px] text-center flex-col-center"
    >
      <Image
        src="/hello/CTA/service-CTA.svg"
        alt=""
        width={50}
        height={50}
        draggable={false}
        className="select-none"
      />
      <h3 className="text-h1-bold text-layout-header-default">{t("title")}</h3>
      <p className="text-body1-regular text-layout-body-default">{t("description")}</p>
      <Button
        as={Link}
        href="/"
        className={cn(
          "mt-[30px] min-h-[44px] w-full text-brand-subtle-default",
          "tablet:max-w-[696px]"
        )}
      >
        {t("button")}
      </Button>
    </section>
  );
};

export default CTASection;
