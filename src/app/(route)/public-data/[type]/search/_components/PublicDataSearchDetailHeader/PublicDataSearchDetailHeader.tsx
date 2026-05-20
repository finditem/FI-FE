"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { DetailHeader } from "@/components";

const PublicDataSearchDetailHeader = () => {
  const params = useParams();
  const type = params.type === "found" ? "found" : "lost";

  return (
    <div>
      <DetailHeader
        title={
          <div className="flex items-center gap-2">
            <Image
              src="/public-data/public-search-police24.svg"
              alt=""
              width={95}
              height={26}
              priority
            />
            <p className="text-h2-bold text-layout-header-default">
              {type === "found" ? "습득물" : "분실물"} 검색
            </p>
          </div>
        }
      />
    </div>
  );
};

export default PublicDataSearchDetailHeader;
