"use client";

import { useEffect, useRef, useState } from "react";
import { useGeolocationPermissionGranted } from "@/hooks";
import { useMainKakaoMapStore } from "@/store";
import { getDistanceMeters } from "@/utils";

/** 좌표를 다시 반영할 최소 이동 거리. 이보다 작은 변화는 GPS 흔들림으로 보고 버린다. */
const MIN_MOVE_METERS = 10;

/**
 * 위치 권한이 허용된 동안 기기 GPS를 구독해, 지도에 표시할 사용자 위치와 진행 방향을 유지합니다.
 *
 * @returns `userLocation`(권한이 없으면 `null`)과 `heading`(북쪽 기준 시계방향 각도, 모르면 `null`)
 *
 * @remarks
 * - 권한이 `granted`일 때만 `watchPosition`을 걸고, 권한이 풀리거나 언마운트되면 `clearWatch`로 정리합니다.
 * - 첫 좌표는 `setUserGpsFromDevice`로 저장해 주소까지 갱신하고, 이후 좌표는 `setUserGpsLatLng`로 좌표만 갱신합니다. 추적 중에는 검색 placeholder 주소가 따라 바뀔 필요가 없습니다.
 * - `coords.heading`은 정지 상태이거나 기기가 방향을 모를 때 `null`이라, 마지막으로 받은 값을 유지합니다. 데스크톱 측위에서는 계속 `null`입니다.
 */
const useWatchUserLocation = () => {
  const userGpsLatLng = useMainKakaoMapStore((s) => s.userGpsLatLng);
  const setUserGpsFromDevice = useMainKakaoMapStore((s) => s.setUserGpsFromDevice);
  const setUserGpsLatLng = useMainKakaoMapStore((s) => s.setUserGpsLatLng);
  const isPermissionGranted = useGeolocationPermissionGranted();
  const [heading, setHeading] = useState<number | null>(null);
  const lastLatLngRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(
    function watchDevicePosition() {
      if (!isPermissionGranted) return;
      if (typeof navigator === "undefined" || !navigator.geolocation) return;

      const watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          if (coords.heading !== null && !Number.isNaN(coords.heading)) {
            setHeading(coords.heading);
          }

          const next = { lat: coords.latitude, lng: coords.longitude };
          const last = lastLatLngRef.current;
          if (last && getDistanceMeters(last, next) < MIN_MOVE_METERS) return;

          lastLatLngRef.current = next;
          if (last === null) {
            setUserGpsFromDevice(next);
            return;
          }
          setUserGpsLatLng(next);
        },
        () => {},
        { enableHighAccuracy: true }
      );

      return () => {
        lastLatLngRef.current = null;
        navigator.geolocation.clearWatch(watchId);
      };
    },
    [isPermissionGranted, setUserGpsFromDevice, setUserGpsLatLng]
  );

  return {
    userLocation: isPermissionGranted ? userGpsLatLng : null,
    heading,
  };
};

export default useWatchUserLocation;
