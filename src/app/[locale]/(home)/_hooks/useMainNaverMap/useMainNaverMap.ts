import { useMainNaverMapStore } from "@/store";
import {
  clearMainGeoSessionConfirmed,
  hasMainGeoSessionConfirmed,
  markMainGeoSessionConfirmed,
} from "@/utils/mainGeoSession";
import { useEffect, useRef, useState } from "react";

const useMainNaverMap = () => {
  const {
    latLng,
    setLatLng,
    clearLatLng,
    zoomResetSignal,
    mapZoom,
    setMapZoom,
    setUserGpsFromDevice,
    triggerZoomReset,
  } = useMainNaverMapStore();
  const [isPermissionResolved, setIsPermissionResolved] = useState(false);
  const mapZoomRef = useRef(mapZoom);
  const prevZoomResetSignalRef = useRef(zoomResetSignal);

  useEffect(() => {
    const applyGpsToMap = (next: { lat: number; lng: number }) => {
      triggerZoomReset();
      setUserGpsFromDevice(next);
      setLatLng(next);
      markMainGeoSessionConfirmed();
    };

    const syncCenterByPermission = async () => {
      if (!navigator.geolocation) {
        setIsPermissionResolved(true);
        return;
      }

      if (!navigator.permissions) {
        if (hasMainGeoSessionConfirmed()) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              applyGpsToMap({ lat: coords.latitude, lng: coords.longitude });
              setIsPermissionResolved(true);
            },
            (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                clearMainGeoSessionConfirmed();
                clearLatLng();
              }
              setIsPermissionResolved(true);
            }
          );
          return;
        }
        setIsPermissionResolved(true);
        return;
      }

      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });

        if (permission.state === "denied") {
          clearMainGeoSessionConfirmed();
          clearLatLng();
          setIsPermissionResolved(true);
          return;
        }

        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              applyGpsToMap({ lat: coords.latitude, lng: coords.longitude });
              setIsPermissionResolved(true);
            },
            () => {
              clearLatLng();
              setIsPermissionResolved(true);
            }
          );
          return;
        }

        setIsPermissionResolved(true);
      } catch {
        setIsPermissionResolved(true);
      }
    };

    void syncCenterByPermission();
  }, [clearLatLng, setLatLng, setUserGpsFromDevice, triggerZoomReset]);

  useEffect(() => {
    mapZoomRef.current = mapZoom;
  }, [mapZoom]);

  useEffect(() => {
    if (prevZoomResetSignalRef.current === zoomResetSignal) return;
    prevZoomResetSignalRef.current = zoomResetSignal;
    // 너무 축소된 상태면 줌 14(반경 1km 배율, 카카오 레벨 6)까지 확대한다. 이미 더 확대돼 있으면 그대로 둔다.
    setMapZoom(Math.max(mapZoomRef.current, 14));
  }, [zoomResetSignal, setMapZoom]);

  return {
    mapCenter: latLng,
    mapZoom,
    setMapZoom,
    setLatLng,
    isPermissionResolved,
  };
};

export default useMainNaverMap;
