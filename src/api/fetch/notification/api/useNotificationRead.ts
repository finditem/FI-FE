import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

const useNotificationRead = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const t = useTranslations("useNotificationRead");

  return useAppMutation("auth", "/notifications/read-batch", "put", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationList"] });
    },
    onError: () => {
      addToast(t("readError"), "error");
    },
  });
};

export default useNotificationRead;
