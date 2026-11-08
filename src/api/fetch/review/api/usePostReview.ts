"use client";

import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";
import { ReviewCreateRequest, ReviewIdResponse } from "../types/ReviewCreateType";

interface UsePostReviewOptions {
  onSuccess?: () => void;
}

/**
 * 찾기 완료 건에 대해 후기를 작성한다. 성공 시 해당 채팅방 상세 캐시를 무효화해
 * canWriteReview 등 완료 상태가 최신화되도록 한다.
 *
 * @example
 * ```ts
 * const { mutate: postReview, isPending } = usePostReview(roomId, { onSuccess: () => setIsCompleteOpen(true) });
 * postReview({ findCompletionId, emotion: "MOVED", helpTypes: ["KIND_AND_WARM"], content });
 * ```
 */
export const usePostReview = (roomId: number, options?: UsePostReviewOptions) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("usePostReview");

  return useAppMutation<
    ReviewCreateRequest,
    ApiBaseResponseType<ReviewIdResponse>,
    AxiosError<ApiBaseResponseType<null>>
  >("auth", "/reviews", "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatRoomDetail", roomId] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      if (error.response?.data.code === "REVIEW409-ALREADY_WRITTEN") {
        addToast(t("alreadyWritten"), "warning");
        return;
      }
      addToast(t("submitError"), "error");
    },
  });
};
