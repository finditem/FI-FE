import useAppQuery from "@/api/_base/query/useAppQuery";
import { GetNotificationSetting } from "../types/notificationSettingType";

const useGetNotificationSetting = (options?: { enabled?: boolean }) => {
  return useAppQuery<GetNotificationSetting, unknown>(
    "auth",
    ["/notifications/settings"],
    "/notifications/settings",
    options
  );
};

export default useGetNotificationSetting;
