"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { DetailHeader, HeaderSearch } from "@/components";
import { SEARCH_PATH } from "../PUBLIC_DATA_CONST";

const PublicDetailHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawType = searchParams.get("type");
  const type = rawType === "found" ? "found" : "lost";

  return (
    <DetailHeader
      title={
        <Image
          src="/public-data/public-detail-police24.webp"
          alt=""
          width={130}
          height={26}
          priority
          unoptimized
        />
      }
    >
      <HeaderSearch onClick={() => router.push(SEARCH_PATH[type])} />
    </DetailHeader>
  );
};

export default PublicDetailHeader;
