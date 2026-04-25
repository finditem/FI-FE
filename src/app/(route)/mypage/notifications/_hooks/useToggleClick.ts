import usePutNotificationSetting from "@/api/fetch/notification/api/usePutNotificationSetting";
import { NotificationSettingType } from "../_types/NotificationType";
import { NotificationSetting } from "@/api/fetch/notification";
import { useToast } from "@/context/ToastContext";
import { useCallback } from "react";
import { syncWebPushSubscription, unsubscribeWebPushFromServer } from "@/utils";

export const useToggleClick = (notificationData?: NotificationSetting) => {
  const { mutate: notificationMutate, isPending } = usePutNotificationSetting();
  const { addToast } = useToast();

  const handleToggle = useCallback(
    async (settingName: NotificationSettingType) => {
      if (isPending || !notificationData) return;

      const currentStatus = notificationData?.[settingName];
      const nextState = !currentStatus;

      if (settingName === "browserNotificationEnabled" && nextState === false) {
        notificationMutate(
          { browserNotificationEnabled: false },
          {
            onSuccess: () => {
              void unsubscribeWebPushFromServer().catch(() => {});
            },
          }
        );
        return;
      }

      if (settingName === "browserNotificationEnabled" && nextState === true) {
        if (!("Notification" in window)) {
          addToast("이 브라우저는 알림 기능을 지원하지 않아요", "warning");
          return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          addToast("알림 권한이 거절되었어요", "warning");
          return;
        }

        notificationMutate(
          { browserNotificationEnabled: true },
          {
            onSuccess: () => {
              void syncWebPushSubscription().catch(() => {
                addToast("브라우저 알림 등록에 실패했어요", "warning");
              });
            },
          }
        );
        return;
      }

      notificationMutate({ [settingName]: nextState });
    },
    [isPending, notificationData, addToast, notificationMutate]
  );

  return {
    handleToggle,
    isPending,
  };
};
