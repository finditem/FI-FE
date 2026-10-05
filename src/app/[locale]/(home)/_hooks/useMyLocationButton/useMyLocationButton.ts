import { DEFAULT_MAP_ZOOM } from "@/constants";
import { useMainNaverMapStore } from "@/store";
import {
  clearMainGeoSessionConfirmed,
  hasMainGeoSessionConfirmed,
  markMainGeoSessionConfirmed,
} from "@/utils/mainGeoSession";
import { useCallback, useEffect, useState } from "react";

const useMyLocationButton = () => {
  const {
    userGpsLatLng,
    setLatLng,
    setUserGpsFromDevice,
    clearLatLng,
    triggerZoomReset,
    setMapZoom,
  } = useMainNaverMapStore();
  const [isLocationPermissionSheetOpen, setIsLocationPermissionSheetOpen] = useState(false);

  useEffect(() => {
    const checkGeolocationPermission = async () => {
      if (!navigator.geolocation) {
        clearLatLng();
        return;
      }

      if (!navigator.permissions) return;

      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        clearLatLng();
        clearMainGeoSessionConfirmed();
      }
    };

    void checkGeolocationPermission();
  }, [clearLatLng]);

  // 지금 줌과 상관없이 기본 줌으로 맞춘다. 축소해 둔 상태여도 내 위치 주변이 같은 배율로 보인다.
  const moveToMyLocation = (latLng: { lat: number; lng: number }) => {
    setMapZoom(DEFAULT_MAP_ZOOM);
    setLatLng(latLng);
  };

  const requestDeviceLocation = useCallback(() => {
    if (!navigator.geolocation) {
      clearLatLng();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const next = { lat: coords.latitude, lng: coords.longitude };
        setUserGpsFromDevice(next);
        moveToMyLocation(next);
        markMainGeoSessionConfirmed();
      },
      (error) => {
        triggerZoomReset();
        clearLatLng();
        if (error.code === error.PERMISSION_DENIED) {
          clearMainGeoSessionConfirmed();
        }
      }
    );
  }, [clearLatLng, moveToMyLocation, setUserGpsFromDevice, triggerZoomReset]);

  const handleMyLocationClick = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      clearLatLng();
      return;
    }

    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "granted") {
          // 권한이 있으면 useWatchUserLocation이 위치를 계속 갱신하고 있으므로 그 좌표로 바로 이동한다.
          // getCurrentPosition은 데스크톱에서 응답까지 10초 넘게 걸리기도 해서 버튼이 먹통처럼 보인다.
          if (userGpsLatLng) {
            moveToMyLocation(userGpsLatLng);
            return;
          }
          requestDeviceLocation();
          return;
        }
        if (result.state === "denied") {
          setIsLocationPermissionSheetOpen(true);
          return;
        }
        if (hasMainGeoSessionConfirmed()) {
          requestDeviceLocation();
          return;
        }
        setIsLocationPermissionSheetOpen(true);
        return;
      } catch {
        if (hasMainGeoSessionConfirmed()) {
          requestDeviceLocation();
          return;
        }
        setIsLocationPermissionSheetOpen(true);
        return;
      }
    }

    if (hasMainGeoSessionConfirmed()) {
      requestDeviceLocation();
      return;
    }

    setIsLocationPermissionSheetOpen(true);
  };

  const closeLocationPermissionSheet = useCallback(() => {
    setIsLocationPermissionSheetOpen(false);
  }, []);

  return {
    handleMyLocationClick,
    isLocationPermissionSheetOpen,
    closeLocationPermissionSheet,
  };
};

export default useMyLocationButton;
