import { useMainKakaoMapStore } from "@/store";
import {
  clearMainGeoSessionConfirmed,
  hasMainGeoSessionConfirmed,
  markMainGeoSessionConfirmed,
} from "@/utils/mainGeoSession";
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
        clearMainGeoSessionConfirmed();
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
        markMainGeoSessionConfirmed();
      },
      (error) => {
        triggerLevelReset();
        clearLatLng();
        if (error.code === error.PERMISSION_DENIED) {
          clearMainGeoSessionConfirmed();
        }
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
