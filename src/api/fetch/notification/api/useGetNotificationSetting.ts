import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetNotificationSetting } from "../types/notificationSettingType";

export const useGetNotificationSetting = (options?: { enabled?: boolean }) => {
  return useAppQuery<GetNotificationSetting, unknown>(
    "auth",
    ["/notifications/settings"],
    "/notifications/settings",
    options
  );
};
