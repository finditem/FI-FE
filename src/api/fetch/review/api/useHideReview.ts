"use client";

import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useToast } from "@/context/ToastContext";

interface UseHideReviewOptions {
  onSuccess?: () => void;
}

/**
 * 현재 사용자의 후기 목록에서 후기를 숨긴다. 숨긴 후기는 상대방 목록에는 영향을 주지 않으며 복구할
 * 수 없으므로, 성공한 뒤 후기 목록 캐시를 무효화한다.
 *
 * @example
 * ```ts
 * const { mutate: hideReview, isPending } = useHideReview(reviewId, {
 *   onSuccess: () => removeReviewFromCurrentList(reviewId),
 * });
 * hideReview(undefined);
 * ```
 */
export const useHideReview = (reviewId: number, options?: UseHideReviewOptions) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("useHideReview");

  return useAppMutation<
    undefined,
    ApiBaseResponseType<null>,
    AxiosError<ApiBaseResponseType<null>>
  >("auth", `/reviews/${reviewId}/hide`, "post", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/users/me/reviews"] });
      addToast(t("hideSuccess"), "success");
      options?.onSuccess?.();
    },
    onError: () => {
      addToast(t("hideError"), "error");
    },
  });
};
