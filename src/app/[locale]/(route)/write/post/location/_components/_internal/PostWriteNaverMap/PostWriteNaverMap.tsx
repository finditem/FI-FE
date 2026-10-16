"use client";

import { useState } from "react";
import { BaseNaverMap } from "@/components";
import { Radius } from "@/types";
import { getMapZoomByRadius } from "@/utils";

interface PostWriteNaverMapProps {
  lat: number;
  lng: number;
  radius: Radius;
  onCenterChange?: (center: { lat: number; lng: number }) => void;
}

const PostWriteNaverMap = ({ lat, lng, radius, onCenterChange }: PostWriteNaverMapProps) => {
  const [center, setCenter] = useState({ lat, lng });

  const zoom = getMapZoomByRadius(radius);

  return (
    <BaseNaverMap
      center={center}
      zoom={zoom}
      draggable
      showCircle
      showCenterMarker
      radius={radius}
      minZoom={11}
      onDragEnd={(nextCenter) => {
        setCenter(nextCenter);
        onCenterChange?.(nextCenter);
      }}
    />
  );
};

export default PostWriteNaverMap;
