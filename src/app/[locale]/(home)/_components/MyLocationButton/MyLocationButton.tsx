"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { LocationPermissionBottomSheet } from "../PermissionBottomSheet/PermissionBottomSheet";
import useMyLocationButton from "../../_hooks/useMyLocationButton/useMyLocationButton";

interface MyLocationButtonProps {
  /** 바텀시트의 현재 높이를 읽는 함수. 내 위치로 이동할 때 시트에 가리는 만큼 중심을 보정한다. */
  getSheetHeight?: () => number;
}

const MyLocationButton = ({ getSheetHeight }: MyLocationButtonProps) => {
  const t = useTranslations("MyLocationButton");
  const { handleMyLocationClick, isLocationPermissionSheetOpen, closeLocationPermissionSheet } =
    useMyLocationButton(getSheetHeight);

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
