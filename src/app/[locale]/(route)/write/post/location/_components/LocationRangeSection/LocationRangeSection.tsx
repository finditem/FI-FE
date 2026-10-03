"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Radius } from "@/types";
import { BottomSheet, PostWriteNaverMap } from "../_internal";
import { getNaverAddress } from "@/utils";
import { useToast } from "@/context/ToastContext";

interface LocationRangeSectionProps {
  address: string | null;
  fullAddress: string | null;
  initialLat?: number;
  initialLng?: number;
}

const LocationRangeSection = ({
  address,
  fullAddress,
  initialLat,
  initialLng,
}: LocationRangeSectionProps) => {
  const t = useTranslations("LocationRangeSection");
  const { addToast } = useToast();

  const [radius, setRadius] = useState<Radius>(3000);

  const [currentCoord, setCurrentCoord] = useState({
    lat: initialLat ?? 37.566370748,
    lng: initialLng ?? 126.977918341,
  });

  const [currentAddress, setCurrentAddress] = useState(address);
  const [currentFullAddress, setCurrentFullAddress] = useState(fullAddress);

  const handleCenterChange = async (center: { lat: number; lng: number }) => {
    setCurrentCoord(center);

    try {
      const { address: newAddress, fullAddress: newFullAddress } = await getNaverAddress(
        center.lat,
        center.lng
      );
      if (newFullAddress) {
        setCurrentFullAddress(newFullAddress);
        setCurrentAddress(newAddress);
      }
    } catch {
      addToast(t("addressLoadError"), "error");
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-350px)] w-full">
        <PostWriteNaverMap
          lat={currentCoord.lat}
          lng={currentCoord.lng}
          radius={radius}
          onCenterChange={handleCenterChange}
        />
      </div>

      <BottomSheet
        locationInfo={{
          address: currentAddress,
          fullAddress: currentFullAddress,
          ...currentCoord,
        }}
        radiusState={{ radius, setRadius }}
      />
    </>
  );
};

export default LocationRangeSection;
