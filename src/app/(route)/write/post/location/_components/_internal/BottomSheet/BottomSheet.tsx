import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components";
import { useWriteStore } from "@/store";
import { cn } from "@/utils";
import { Radius } from "@/types";
import { DISTANCE_OPTIONS } from "./DISTANCE_OPTIONS";

type LocationInfo = {
  address: string | null;
  fullAddress: string | null;
  lat: number | null;
  lng: number | null;
};

type RadiusState = {
  radius: Radius;
  setRadius: (radius: Radius) => void;
};

interface BottomSheetProps {
  locationInfo: LocationInfo;
  radiusState: RadiusState;
}

const BottomSheet = ({ locationInfo, radiusState }: BottomSheetProps) => {
  const { address, fullAddress, lat, lng } = locationInfo;
  const { radius, setRadius } = radiusState;
  const router = useRouter();
  const searchParams = useSearchParams();

  const isApplyDisabled = lat === null || lng === null || radius === null || address === null;

  const {
    setLatLng: setWriteLatLng,
    setRadius: setWriteRadius,
    setAddress: setWriteAddress,
    setFullAddress: setWriteFullAddress,
  } = useWriteStore();

  const commitLocationRange = () => {
    if (isApplyDisabled) return;

    setWriteLatLng(lat, lng);
    setWriteRadius(radius);
    setWriteAddress(address);
    setWriteFullAddress(fullAddress);

    router.back();
  };

  return (
    <section className="rounded-t-[20px] px-5 py-10 flex-col-center">
      <div className="mb-12 gap-4 flex-col-center">
        <div className="gap-2 flex-center">
          <h2 className="text-h2-medium text-layout-header-default">
            {address || "선택한 위치"} 근처
          </h2>
          <span className="text-h1-medium text-brand-normal-default">{radius / 1000}km</span>
        </div>

        <div className="w-full gap-[14px] py-[14px] flex-center">
          {DISTANCE_OPTIONS.map((option) => (
            <Button
              key={option.radius}
              type="button"
              role="radio"
              aria-checked={option.value === radius}
              variant="outlined"
              className={cn(
                "min-h-11 text-body1-semibold transition-colors hover:bg-gray-100",
                option.value === radius
                  ? "!border-brand-normal-default !text-brand-normal-default"
                  : "!border-neutral-normal-default !text-neutral-normal-default"
              )}
              onClick={() => setRadius(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <Button className="min-h-11 w-full" onClick={commitLocationRange} disabled={isApplyDisabled}>
        적용하기
      </Button>
    </section>
  );
};

export default BottomSheet;
