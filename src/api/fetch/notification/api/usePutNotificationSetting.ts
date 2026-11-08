import useAppMutation from "@/api/_base/query/useAppMutation";
import {
  notificationSettingRequest,
  PutNotificationSetting,
} from "../types/notificationSettingType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export const usePutNotificationSetting = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePutNotificationSetting");

  return useAppMutation<notificationSettingRequest, PutNotificationSetting, unknown>(
    "auth",
    "/notifications/settings",
    "put",
    {
      onSuccess: (response) =>
        queryClient.invalidateQueries({ queryKey: ["/notifications/settings"] }),
      onError: () => addToast(t("updateError"), "warning"),
    }
  );
};
