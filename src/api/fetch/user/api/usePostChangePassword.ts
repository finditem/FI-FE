import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { useTranslations } from "next-intl";

interface ApiPostChangePasswordType {
  newPassword: string;
  newPasswordConfirm: string;
}

export const usePostChangePassword = () => {
  const { addToast } = useToast();
  const t = useTranslations("usePostChangePassword");

  return useAppMutation<ApiPostChangePasswordType, ApiBaseResponseType<string>>(
    "auth",
    "/users/me/password",
    "patch",
    {
      onSuccess: () => {
        addToast(t("changeSuccess"), "success");
      },
      onError: () => {
        addToast(t("changeError"), "error");
      },
    }
  );
};
