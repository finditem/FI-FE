import { useTranslations } from "next-intl";
import { Button, Icon, PopupLayout } from "@/components";
import { useToast } from "@/context/ToastContext";
import { useMainKakaoMapStore } from "@/store";
import { clearMainGeoSessionConfirmed, markMainGeoSessionConfirmed } from "@/utils/mainGeoSession";
import { useState } from "react";
import usePermissionConfig from "../../_hooks/usePermissionConfig/usePermissionConfig";
import usePermissionItem from "../../_hooks/usePermissionItem/usePermissionItem";
import { syncWebPushSubscription } from "@/utils";
import { usePutNotificationSetting } from "@/api/fetch/notification";

interface DetailPermissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  state: "Alert" | "Location";
}

const DetailPermissionSheet = ({ isOpen, onClose, state }: DetailPermissionSheetProps) => {
  const t = useTranslations("PermissionBottomSheet");
  const permissionConfig = usePermissionConfig();
  const { iconName, title, description, agreeBtnText } = permissionConfig[state];

  const { addToast } = useToast();
  const { mutate: updateNotification } = usePutNotificationSetting();

  const handleRequestPermission = async () => {
    if (state === "Location") {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        addToast(t("browserNoLocation"), "warning");
        onClose();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const next = { lat: coords.latitude, lng: coords.longitude };
          useMainKakaoMapStore.getState().triggerLevelReset();
          useMainKakaoMapStore.getState().setUserGpsFromDevice(next);
          useMainKakaoMapStore.getState().setLatLng(next);
          markMainGeoSessionConfirmed();
          onClose();
        },
        (error) => {
          useMainKakaoMapStore.getState().triggerLevelReset();
          useMainKakaoMapStore.getState().clearLatLng();
          if (error.code === error.PERMISSION_DENIED) {
            clearMainGeoSessionConfirmed();
            addToast(t("locationPermissionDenied"), "warning");
          }
          onClose();
        }
      );
    } else if (state === "Alert") {
      if (typeof window === "undefined" || !("Notification" in window)) {
        addToast(t("browserNoNotification"), "warning");
        onClose();
        return;
      }

      if (Notification.permission === "granted") {
        updateNotification(
          { browserNotificationEnabled: true },
          {
            onSuccess: () => {
              void syncWebPushSubscription().catch(() =>
                addToast(t("notificationRegisterFailed"), "warning")
              );
            },
          }
        );
        onClose();
        return;
      }

      if (Notification.permission === "denied") {
        addToast(t("notificationPermissionBlocked"), "warning");
        onClose();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateNotification(
          { browserNotificationEnabled: true },
          {
            onSuccess: () => {
              void syncWebPushSubscription().catch(() =>
                addToast(t("notificationRegisterFailed"), "warning")
              );
            },
          }
        );
      }
      onClose();
    }
  };

  return (
    <PopupLayout
      className="w-full gap-10 px-5 py-[64px] flex-col-center"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Icon name={iconName} size={78} />

      <div className="gap-3 flex-col-center">
        <h3 className="text-h3-semibold text-layout-header-default">{title}</h3>
        <p className="whitespace-pre-line text-center text-body2-medium text-layout-body-default">
          {description}
        </p>
      </div>

      <div className="w-full gap-3 flex-col-center">
        <Button className="w-full" onClick={handleRequestPermission}>
          {agreeBtnText}
        </Button>
        <button
          className="w-full py-2 text-body2-semibold text-neutralInversed-strong-default"
          onClick={onClose}
        >
          {t("skipForNow")}
        </button>
      </div>
    </PopupLayout>
  );
};

interface PermissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PermissionSheet = ({ isOpen, onClose }: PermissionSheetProps) => {
  const t = useTranslations("PermissionBottomSheet");
  const permissionItem = usePermissionItem();
  const [isDetailPermissionSheet, setIsDetailPermissionSheet] = useState<{
    open: boolean;
    state: "Alert" | "Location";
  }>({ open: false, state: "Location" });

  const handleDetailClose = () => {
    if (isDetailPermissionSheet.state === "Location") {
      setIsDetailPermissionSheet({ open: true, state: "Alert" });
    } else {
      setIsDetailPermissionSheet((prev) => ({ ...prev, open: false }));
      onClose();
    }
  };

  if (isDetailPermissionSheet.open) {
    return (
      <DetailPermissionSheet
        isOpen={isDetailPermissionSheet.open}
        onClose={handleDetailClose}
        state={isDetailPermissionSheet.state}
      />
    );
  }

  return (
    <PopupLayout
      className="w-full px-5 py-[64px] flex-col-center"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full flex-col items-center gap-10 rounded-[20px] bg-white p-4">
        <h3 className="text-h3-semibold text-layout-header-default">
          {t("allowPermissionsTitle")}
        </h3>

        <div className="flex w-full flex-col gap-6 rounded-[20px] p-5 bg-fill-neutral-subtle-default">
          {permissionItem.map((item) => (
            <div className="flex w-full gap-[18px]" key={item.type}>
              <Icon name={item.iconName} size={44} />
              <div className="flex flex-col gap-[2px]">
                <span className="text-body1-semibold text-layout-header-default">{item.title}</span>
                <span className="text-body1-semibold text-layout-body-default">
                  {item.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={() =>
            setIsDetailPermissionSheet((prev) => ({
              ...prev,
              open: true,
            }))
          }
        >
          {t("confirm")}
        </Button>
      </div>
    </PopupLayout>
  );
};

export const LocationPermissionBottomSheet = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => <DetailPermissionSheet isOpen={isOpen} onClose={onClose} state="Location" />;

export default PermissionSheet;
