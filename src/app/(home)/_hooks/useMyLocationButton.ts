import { useMainKakaoMapStore } from "@/store";
import { useCallback, useEffect, useState } from "react";

const useMyLocationButton = () => {
  const { setLatLng, setUserGpsFromDevice, clearLatLng, triggerLevelReset } =
    useMainKakaoMapStore();
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
      }
    };

    void checkGeolocationPermission();
  }, [clearLatLng]);

  const requestDeviceLocation = useCallback(() => {
    if (!navigator.geolocation) {
      clearLatLng();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        triggerLevelReset();
        const next = { lat: coords.latitude, lng: coords.longitude };
        setUserGpsFromDevice(next);
        setLatLng(next);
      },
      () => {
        triggerLevelReset();
        clearLatLng();
      }
    );
  }, [clearLatLng, setLatLng, setUserGpsFromDevice, triggerLevelReset]);

  const handleMyLocationClick = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      clearLatLng();
      return;
    }

    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "granted") {
          requestDeviceLocation();
          return;
        }
        setIsLocationPermissionSheetOpen(true);
        return;
      } catch {
        requestDeviceLocation();
        return;
      }
    }

    requestDeviceLocation();
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
