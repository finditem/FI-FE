"use client";

import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { GetUsersMeResponse } from "../types/UserMeType";
import { useToast } from "@/context/ToastContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const usePatchProfile = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useAppMutation<FormData, GetUsersMeResponse, AxiosError<ApiBaseResponseType<null>>>(
    "auth",
    "/users/me",
    "patch",
    {
      onSuccess: (updateProfile) => {
        addToast("프로필을 변경했어요", "success");
        queryClient.setQueryData(["users-me"], updateProfile);
      },
      onError: (error) => {
        const errorCode = error.response?.data.code;
        if (errorCode === "USER404-NOT_FOUND") {
          addToast("회원이 아니에요. 로그인을 해주세요", "warning");
          router.replace("/login?reason=session-expired");
        }
        if (errorCode === "AUTH409-NICKNAME_DUPLICATED") {
          addToast("이미 사용 중인 닉네임이에요. 다른 닉네임으로 다시 시도해 주세요", "warning");
        }
      },
    }
  );
};
