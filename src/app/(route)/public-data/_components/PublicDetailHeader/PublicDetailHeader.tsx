"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DetailHeader } from "@/components/layout";
import { HeaderSearch } from "@/components/layout/DetailHeader/DetailHeaderParts";
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
          src="/public-data/public-detail-police24.svg"
          alt=""
          width={130}
          height={26}
          priority
        />
      }
    >
      <HeaderSearch onClick={() => router.push(SEARCH_PATH[type])} />
    </DetailHeader>
  );
};

export default PublicDetailHeader;
