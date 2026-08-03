"use client";

import { useState } from "react";
import { BaseKakaoMap } from "@/components";
import { Radius } from "@/types";
import { getMapLevelByRadius } from "@/utils";

interface PostWriteKakaoMapProps {
  lat: number;
  lng: number;
  radius: Radius;
  onCenterChange?: (center: { lat: number; lng: number }) => void;
}

const PostWriteKakaoMap = ({ lat, lng, radius, onCenterChange }: PostWriteKakaoMapProps) => {
  const [center, setCenter] = useState({ lat, lng });

  const level = getMapLevelByRadius(radius);

  return (
    <BaseKakaoMap
      center={center}
      level={level}
      draggable
      showCircle
      showCenterMarker
      radius={radius}
      minLevel={9}
      onDragEnd={(nextCenter) => {
        setCenter(nextCenter);
        onCenterChange?.(nextCenter);
      }}
    />
  );
};

export default PostWriteKakaoMap;
