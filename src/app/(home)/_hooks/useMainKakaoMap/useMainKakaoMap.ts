import { DEFAULT_LAT_LNG } from "@/constants";
import { useMainKakaoMapStore } from "@/store";
import {
  clearMainGeoSessionConfirmed,
  hasMainGeoSessionConfirmed,
  markMainGeoSessionConfirmed,
} from "@/utils/mainGeoSession";
import { useEffect, useRef, useState } from "react";

const useMainKakaoMap = () => {
  const {
    latLng,
    setLatLng,
    clearLatLng,
    levelResetSignal,
    mapLevel,
    setMapLevel,
    setUserGpsFromDevice,
    triggerLevelReset,
  } = useMainKakaoMapStore();
  const [isPermissionResolved, setIsPermissionResolved] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_LAT_LNG);
  const mapLevelRef = useRef(mapLevel);
  const prevLevelResetSignalRef = useRef(levelResetSignal);

  useEffect(() => {
    const applyGpsToMap = (next: { lat: number; lng: number }) => {
      triggerLevelReset();
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
  }, [clearLatLng, setLatLng, setUserGpsFromDevice, triggerLevelReset]);

  useEffect(() => {
    if (!isPermissionResolved) return;
    setMapCenter(latLng);
  }, [latLng, isPermissionResolved]);

  useEffect(() => {
    mapLevelRef.current = mapLevel;
  }, [mapLevel]);

  useEffect(() => {
    if (prevLevelResetSignalRef.current === levelResetSignal) return;
    prevLevelResetSignalRef.current = levelResetSignal;
    setMapLevel(Math.min(mapLevelRef.current, 6));
  }, [levelResetSignal, setMapLevel]);

  return {
    mapCenter,
    mapLevel,
    setMapLevel,
    setLatLng,
    isPermissionResolved,
  };
};

export default useMainKakaoMap;
