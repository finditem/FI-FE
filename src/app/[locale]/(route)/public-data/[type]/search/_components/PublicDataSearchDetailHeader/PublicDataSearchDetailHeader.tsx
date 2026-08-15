"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { DetailHeader } from "@/components";

const PublicDataSearchDetailHeader = () => {
  const t = useTranslations("PublicDataSearchDetailHeader");
  const params = useParams();
  const type = params.type === "found" ? "found" : "lost";

  return (
    <div>
      <DetailHeader
        title={
          <div className="flex items-center gap-2">
            <Image
              src="/public-data/public-search-police24.webp"
              alt=""
              width={95}
              height={26}
              priority
              unoptimized
            />
            <p className="text-h2-bold text-layout-header-default">
              {type === "found" ? t("foundTitle") : t("lostTitle")}
            </p>
          </div>
        }
      />
    </div>
  );
};

export default PublicDataSearchDetailHeader;
