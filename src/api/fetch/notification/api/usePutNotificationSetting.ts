import useAppMutation from "@/api/_base/query/useAppMutation";
import {
  notificationSettingRequest,
  PutNotificationSetting,
} from "../types/notificationSettingType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";

export const usePutNotificationSetting = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useAppMutation<notificationSettingRequest, PutNotificationSetting, unknown>(
    "auth",
    "/notifications/settings",
    "put",
    {
      onSuccess: (response) =>
        queryClient.invalidateQueries({ queryKey: ["/notifications/settings"] }),
      onError: () => addToast("알림 설정 변경에 실패했어요", "warning"),
    }
  );
};
