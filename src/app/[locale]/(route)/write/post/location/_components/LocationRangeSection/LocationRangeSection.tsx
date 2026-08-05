"use client";

import { useState } from "react";
import { Radius } from "@/types";
import { BottomSheet, PostWriteKakaoMap } from "../_internal";
import { getKakaoLocalCoord2Address } from "@/api/fetch/kakao";
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
      const data = await getKakaoLocalCoord2Address(center.lat, center.lng);
      if (data.documents && data.documents.length > 0) {
        const addressDoc = data.documents[0].road_address || data.documents[0].address;

        const newFullAddress = addressDoc.address_name;
        const newAddress = addressDoc.region_3depth_name || addressDoc.region_2depth_name;

        setCurrentFullAddress(newFullAddress);
        setCurrentAddress(newAddress);
      }
    } catch {
      addToast("위치 정보를 불러오는데 실패했어요", "error");
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-350px)] w-full">
        <PostWriteKakaoMap
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
