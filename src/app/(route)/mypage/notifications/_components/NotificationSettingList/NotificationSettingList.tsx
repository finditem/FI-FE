"use client";

import { ToggleButton } from "@/components/common";
import { NOTIFICATION_CONFIG } from "../../_constants/NOTIFICATION_ITEM";
import NotificationSettingItem from "../NotificationSettingItem/NotificationSettingItem";
import { useGetNotificationSetting } from "@/api/fetch/notification";
import { LoadingState } from "@/components/state";
import { useToggleClick } from "../../_hooks/useToggleClick";
import { DEFAULT_NOTIFICATION_SETTING } from "../../_constants/DEFAULT_NOTIFICATION_SETTING";
import { useEffect } from "react";

const NotificationSettingList = () => {
  const { data: notificationData, isLoading } = useGetNotificationSetting({ enabled: true });

  const { handleToggle } = useToggleClick(notificationData?.result);

  const toggleState = notificationData?.result ?? DEFAULT_NOTIFICATION_SETTING;

  useEffect(() => {
    if (toggleState?.browserNotificationEnabled && Notification.permission === "denied") {
      handleToggle("browserNotificationEnabled");
    }
  }, [toggleState?.browserNotificationEnabled, handleToggle]);

  if (isLoading) return <LoadingState />;

  return (
    <ul className="w-full py-4">
      <li className="w-full px-5 py-2">
        <div className="flex h-11 w-full items-center justify-between">
          <h3 className="text-h3-semibold text-neutral-normal-default">알림 설정</h3>
          <ToggleButton
            ariaLabel="전체 알림 설정"
            toggleState={toggleState?.browserNotificationEnabled ?? false}
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
              browserNotification={toggleState?.browserNotificationEnabled ?? false}
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
