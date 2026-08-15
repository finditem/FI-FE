"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { LocationPermissionBottomSheet } from "../PermissionBottomSheet/PermissionBottomSheet";
import useMyLocationButton from "../../_hooks/useMyLocationButton/useMyLocationButton";

const MyLocationButton = () => {
  const t = useTranslations("MyLocationButton");
  const { handleMyLocationClick, isLocationPermissionSheetOpen, closeLocationPermissionSheet } =
    useMyLocationButton();

  return (
    <>
      <button
        aria-label={t("myLocationLabel")}
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
