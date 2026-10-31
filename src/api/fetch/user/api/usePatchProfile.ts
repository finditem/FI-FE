"use client";

import { USERS_ME_QUERY_KEY } from "@/constants/USER_QUERY_KEYS";
import useAppMutation from "@/api/_base/query/useAppMutation";
import type { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import type { GetUsersMeResponse } from "../types/UserMeType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { AxiosError } from "axios";

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
        queryClient.setQueryData(USERS_ME_QUERY_KEY, updateProfile);
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
