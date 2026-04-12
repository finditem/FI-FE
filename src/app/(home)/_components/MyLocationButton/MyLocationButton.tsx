"use client";

import { Icon } from "@/components/common";
import useMyLocationButton from "../../_hooks/useMyLocationButton";
import { LocationPermissionBottomSheet } from "../PermissionBottomSheet/PermissionBottomSheet";

const MyLocationButton = () => {
  const { handleMyLocationClick, isLocationPermissionSheetOpen, closeLocationPermissionSheet } =
    useMyLocationButton();

  return (
    <>
      <button
        aria-label="내 위치로 이동"
        onClick={handleMyLocationClick}
        className="absolute bottom-3 right-3 flex h-[38px] w-[38px] rounded-full bg-white shadow-lg flex-center"
      >
        <Icon name="MapMyLocation" size={20} />
      </button>

      <LocationPermissionBottomSheet
        isOpen={isLocationPermissionSheetOpen}
        onClose={closeLocationPermissionSheet}
      />
    </>
  );
};

export default MyLocationButton;
