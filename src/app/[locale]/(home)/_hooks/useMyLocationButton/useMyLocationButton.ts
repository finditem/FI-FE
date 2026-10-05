import { DEFAULT_MAP_ZOOM } from "@/constants";
import { MAIN_SEARCH_HEADER_ID } from "../../_components/HOME_CONST";
import { useMainNaverMapStore } from "@/store";
import {
  clearMainGeoSessionConfirmed,
  hasMainGeoSessionConfirmed,
  markMainGeoSessionConfirmed,
} from "@/utils/mainGeoSession";
import { useCallback, useEffect, useState } from "react";
import { offsetLatLngByPixels } from "../../_utils/mapOffsetUtils";

/**
 * @param getSheetHeight - 바텀시트의 현재 높이를 읽는 함수. 넘기면 내 위치가 헤더와 시트에 가리지 않는 지도 영역 가운데에 오도록 중심을 보정한다.
 */
const useMyLocationButton = (getSheetHeight?: () => number) => {
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
  // 지도는 화면 위 검색 헤더와 아래 바텀시트 뒤까지 깔려 있다. 둘 사이 보이는 영역의 가운데에 내 위치가 오도록
  // (시트 높이 - 헤더 하단) / 2만큼 중심을 내린다. 시트가 헤더보다 낮으면 값이 음수가 되어 중심을 올린다.
  // 이동하는 시점에 한 번만 맞추고, 이후 시트 높이가 바뀌어도 다시 옮기지 않는다.
  const moveToMyLocation = (latLng: { lat: number; lng: number }) => {
    const headerBottom =
      document.getElementById(MAIN_SEARCH_HEADER_ID)?.getBoundingClientRect().bottom ?? 0;
    const offsetY = ((getSheetHeight?.() ?? 0) - headerBottom) / 2;
    setMapZoom(DEFAULT_MAP_ZOOM);
    setLatLng(offsetLatLngByPixels(latLng, offsetY, DEFAULT_MAP_ZOOM));
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
