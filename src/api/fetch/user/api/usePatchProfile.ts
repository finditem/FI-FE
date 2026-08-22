"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetUsersMeResponse } from "../types/UserMeType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AxiosError } from "axios";

export const usePatchProfile = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("usePatchProfile");

  return useAppMutation<FormData, GetUsersMeResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    "/users/me",
    "patch",
    {
      onSuccess: (updateProfile) => {
        addToast(t("updateSuccess"), "success");
        queryClient.setQueryData(["users-me"], updateProfile);
      },
      onError: (error) => {
        const errorCode = error.response?.data.code;
        if (errorCode === "USER404-NOT_FOUND") {
          addToast(t("notMember"), "warning");
          router.replace("/login?reason=session-expired");
        }
        if (errorCode === "AUTH409-NICKNAME_DUPLICATED") {
          addToast(t("nicknameDuplicated"), "warning");
        }
      },
    }
  );
};
