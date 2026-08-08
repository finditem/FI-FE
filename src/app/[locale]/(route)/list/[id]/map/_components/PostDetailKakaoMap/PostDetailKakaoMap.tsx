"use client";

import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { Icon, BaseKakaoMap } from "@/components";
import { cn, getMapLevelByRadius } from "@/utils";

const DEFAULT_MAP_QUERY = {
  address: "서울특별시 중구 세종대로 110 서울특별시청",
  lat: 37.566370748,
  lng: 126.977918341,
  radius: 1000,
} as const;

const radiusSchema = z.union([z.literal(1000), z.literal(3000), z.literal(5000)]);
const emptyToUndefined = (value: unknown) => (value === null || value === "" ? undefined : value);
const mapQuerySchema = z.object({
  lat: z.preprocess(
    emptyToUndefined,
    z.coerce.number().finite().min(-90).max(90).catch(DEFAULT_MAP_QUERY.lat)
  ),
  lng: z.preprocess(
    emptyToUndefined,
    z.coerce.number().finite().min(-180).max(180).catch(DEFAULT_MAP_QUERY.lng)
  ),
  radius: z.preprocess(
    emptyToUndefined,
    z.coerce.number().pipe(radiusSchema).catch(DEFAULT_MAP_QUERY.radius)
  ),
  address: z.string().trim().min(1).catch(DEFAULT_MAP_QUERY.address),
});

const decodeAddress = (address: string) => {
  try {
    return decodeURIComponent(address);
  } catch {
    return address;
  }
};

const PostDetailKakaoMap = () => {
  const searchParams = useSearchParams();

  const rawData = mapQuerySchema.parse({
    lat: searchParams.get("lat"),
    lng: searchParams.get("lng"),
    radius: searchParams.get("radius"),
    address: decodeAddress(searchParams.get("address") || DEFAULT_MAP_QUERY.address),
  });

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
          <span className="text-h3-semibold text-flatGray-700">{rawData.address}</span>
        </div>
      </BaseKakaoMap>
    </section>
  );
};

export default PostDetailKakaoMap;
