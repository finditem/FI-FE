"use client";

import { ToggleButton, LoadingState } from "@/components";
import { NOTIFICATION_CONFIG } from "../../_constants/NOTIFICATION_ITEM";
import NotificationSettingItem from "../NotificationSettingItem/NotificationSettingItem";
import { useGetNotificationSetting } from "@/api/fetch/notification";
import { useToggleClick } from "../../_hooks/useToggleClick";
import { useBrowserNotificationPermission } from "../../_hooks/useBrowserNotificationPermission";
import { DEFAULT_NOTIFICATION_SETTING } from "../../_constants/DEFAULT_NOTIFICATION_SETTING";
import { isBrowserNotificationEffectivelyEnabled } from "../../_utils/isBrowserNotificationEffectivelyEnabled";
import { useEffect } from "react";

const NotificationSettingList = () => {
  const { data: notificationData, isLoading } = useGetNotificationSetting({ enabled: true });

  const { handleToggle } = useToggleClick(notificationData?.result);

  const toggleState = notificationData?.result ?? DEFAULT_NOTIFICATION_SETTING;
  const notificationPermission = useBrowserNotificationPermission();
  const isBrowserNotificationOn = isBrowserNotificationEffectivelyEnabled(
    toggleState.browserNotificationEnabled,
    notificationPermission
  );

  useEffect(() => {
    if (toggleState?.browserNotificationEnabled && notificationPermission === "denied") {
      handleToggle("browserNotificationEnabled");
    }
  }, [toggleState?.browserNotificationEnabled, notificationPermission, handleToggle]);

  if (isLoading) return <LoadingState />;

  return (
    <ul className="w-full py-4">
      <li className="w-full px-5 py-2">
        <div className="flex h-11 w-full items-center justify-between">
          <h3 className="text-h3-semibold text-neutral-normal-default">알림 설정</h3>
          <ToggleButton
            ariaLabel="전체 알림 설정"
            toggleState={isBrowserNotificationOn}
            onClick={() => handleToggle("browserNotificationEnabled")}
          />
        </div>
      </li>

      <div className="mb-4 flex flex-col gap-[2px]">
        {NOTIFICATION_CONFIG.map((item) => {
          const isCategorySelector = item.value === "enabledCategories";
          const currentState = toggleState[item.value];

          return (
            <NotificationSettingItem
              key={item.value}
              item={item}
              browserNotification={isBrowserNotificationOn}
              isOn={isCategorySelector ? false : (currentState as boolean)}
              notificationStatus={toggleState}
            />
          );
        })}
      </div>
    </ul>
  );
};

export default NotificationSettingList;
