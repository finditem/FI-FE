"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import usePoliceBanner from "../../../../_hooks/usePoliceBanner/usePoliceBanner";
import { trackClick112LostItem } from "@/utils/analytics/analytics";

const PoliceSection = () => {
  const t = useTranslations("PoliceSection");
  const { href, title, logoAlt } = usePoliceBanner();

  return (
    <section>
      <Link
        href={href}
        onClick={() => trackClick112LostItem("home")}
        className="h-[84px] w-full rounded-2xl bg-[#E5EFFF] px-6 py-[17px] flex-center"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-h3-semibold text-layout-header-default">{title}</p>
            <p className="text-body2-medium text-layout-body-default">
              {t.rich("bannerSubtitle", {
                em: (chunks) => <span className="font-semibold text-flatGreen-600">{chunks}</span>,
              })}
            </p>
          </div>
          <Image src="/main/police24-icon.svg" alt={logoAlt} width={48} height={13} />
        </div>
      </Link>
    </section>
  );
};

export default PoliceSection;
