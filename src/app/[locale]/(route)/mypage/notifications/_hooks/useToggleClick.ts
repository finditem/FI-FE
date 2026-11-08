import { NotificationSettingType } from "../_types/NotificationType";
import { NotificationSetting, usePutNotificationSetting } from "@/api/fetch/notification";
import { useToast } from "@/context/ToastContext";
import { syncWebPushSubscription, unsubscribeWebPushFromServer } from "@/utils";
import { useTranslations } from "next-intl";

export const useToggleClick = (notificationData?: NotificationSetting) => {
  const { mutate: notificationMutate, isPending } = usePutNotificationSetting();
  const { addToast } = useToast();
  const t = useTranslations("NotificationToggle");

  const handleToggle = async (settingName: NotificationSettingType) => {
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
        addToast(t("unsupportedBrowser"), "warning");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        addToast(t("permissionDenied"), "warning");
        return;
      }

      notificationMutate(
        { browserNotificationEnabled: true },
        {
          onSuccess: () => {
            void syncWebPushSubscription().catch(() => {
              addToast(t("registrationFailed"), "warning");
            });
          },
        }
      );
      return;
    }

    notificationMutate({ [settingName]: nextState });
  };

  return {
    handleToggle,
    isPending,
  };
};
