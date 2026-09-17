"use client";

import { AxiosError } from "axios";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { PostPostsWriteResponse } from "../types/PostWriteType";
import {
  PostEditLimitErrorResult,
  POST_EDIT_LIMIT_COUNT,
  POST_EDIT_RATE_LIMIT_CODE,
} from "../types/PostEditLimitType";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

interface UsePutPostOptions {
  /** 1분 내 수정 횟수 제한에 걸렸을 때 해제 시각(ISO 8601)과 함께 호출된다. */
  onEditLimitExceeded?: (unlockAt: string) => void;
}

export const usePutPost = (postId: number, options?: UsePutPostOptions) => {
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations("usePutPost");

  return useAppMutation<
    FormData,
    PostPostsWriteResponse,
    AxiosError<ApiBaseResponseType<PostEditLimitErrorResult | null>>
  >("auth", `/posts/${postId}`, "put", {
    onSuccess: async (data) => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["post-detail", postId] }),
        queryClient.invalidateQueries({ queryKey: ["post-translation", postId] }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["/users/me/posts"] }),
      ]);
      addToast(t("updateSuccess"), "success");
      router.replace(`/list/${data.result.id}`);
    },
    onError: (error) => {
      if (error.response?.data.code === POST_EDIT_RATE_LIMIT_CODE) {
        const retryAfterSeconds = error.response.data.result?.retryAfterSeconds ?? 0;
        const unlockAt = new Date(Date.now() + retryAfterSeconds * 1000).toISOString();
        options?.onEditLimitExceeded?.(unlockAt);
        addToast(t("limitExceededToast", { count: POST_EDIT_LIMIT_COUNT }), "warning");
        return;
      }
      addToast(t("updateError"), "error");
    },
  });
};
