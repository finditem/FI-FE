import usePutNotificationSetting from "@/api/fetch/notification/api/usePutNotificationSetting";
import { Button, Icon } from "@/components/common";
import { PopupLayout } from "@/components/domain";
import { useToast } from "@/context/ToastContext";
import { useMainKakaoMapStore } from "@/store";
import { useState } from "react";
import { PERMISSION_CONFIG, PERMISSION_ITEM } from "../../_constants/PERMISSION_CONFIG";

interface DetailPermissionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  state: "Alert" | "Location";
}

const DetailPermissionSheet = ({ isOpen, onClose, state }: DetailPermissionSheetProps) => {
  const { iconName, title, description, agreeBtnText } = PERMISSION_CONFIG[state];

  const { addToast } = useToast();
  const { mutate: updateNotification } = usePutNotificationSetting();

  const handleRequestPermission = async () => {
    if (state === "Location") {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        addToast("위치 기능을 지원하지 않는 브라우저에요", "warning");
        onClose();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const next = { lat: coords.latitude, lng: coords.longitude };
          useMainKakaoMapStore.getState().triggerLevelReset();
          useMainKakaoMapStore.getState().setUserGpsFromDevice(next);
          useMainKakaoMapStore.getState().setLatLng(next);
          onClose();
        },
        (error) => {
          useMainKakaoMapStore.getState().triggerLevelReset();
          useMainKakaoMapStore.getState().clearLatLng();
          if (error.code === error.PERMISSION_DENIED) {
            addToast("위치 권한이 거부되었습니다. 설정에서 허용해주세요.", "warning");
          }
          onClose();
        }
      );
    } else if (state === "Alert") {
      if (typeof window === "undefined" || !("Notification" in window)) {
        addToast("이 브라우저는 알림 기능을 지원하지 않아요", "warning");
        onClose();
        return;
      }

      if (Notification.permission === "granted") {
        updateNotification({ browserNotificationEnabled: true });
        onClose();
        return;
      }

      if (Notification.permission === "denied") {
        addToast("알림 권한이 차단되어 있어요. 브라우저 설정에서 허용해 주세요", "warning");
        onClose();
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateNotification({ browserNotificationEnabled: true });
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
          다음에 할래요.
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
          서비스 사용을 위해 아래 권한을 허용해 주세요.
        </h3>

        <div className="flex w-full flex-col gap-6 rounded-[20px] p-5 bg-fill-neutral-subtle-default">
          {PERMISSION_ITEM.map((item) => (
            <div className="flex w-full gap-[18px]" key={item.title}>
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
          확인
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
