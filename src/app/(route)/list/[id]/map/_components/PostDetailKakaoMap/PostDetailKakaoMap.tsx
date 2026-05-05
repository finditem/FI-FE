"use client";

import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/common";
import { BaseKakaoMap } from "@/components/domain";
import { cn, getMapLevelByRadius, parseNumber } from "@/utils";
import { Radius } from "@/types";

const PostDetailKakaoMap = () => {
  const searchParams = useSearchParams();

  let address = searchParams.get("address") || "서울특별시 중구 세종대로 110 서울특별시청";
  try {
    address = decodeURIComponent(address);
  } catch (error) {
    // no-op
  }

  const rawData = {
    lat: parseNumber(searchParams.get("lat"), 37.566370748),
    lng: parseNumber(searchParams.get("lng"), 126.977918341),
    radius: parseNumber(searchParams.get("radius"), 1000) as Radius,
    address,
  };

  return (
    <section className="relative h-full w-full">
      <h2 className="sr-only">지도 영역</h2>

      <BaseKakaoMap
        center={{ lat: rawData.lat, lng: rawData.lng }}
        level={getMapLevelByRadius(rawData.radius)}
        showCircle
        showCenterMarker
        radius={rawData.radius}
        minLevel={8}
        draggable
      >
        <div
          className={cn(
            "absolute bottom-9 left-1/2 z-10 flex w-[90%] -translate-x-1/2 gap-2 rounded-lg bg-white px-5 py-4 shadow-lg",
            "tablet:w-[50%]"
          )}
        >
          <Icon name="Position" className="text-brand-normal-default" />
          <span className="text-h3-semibold text-flatGray-700">{address}</span>
        </div>
      </BaseKakaoMap>
    </section>
  );
};

export default PostDetailKakaoMap;
