import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import useAppMutation from "@/api/_base/query/useAppMutation";
import { useToast } from "@/context/ToastContext";
import { NoticeDetailResponse } from "../types/NoticeDetailType";

type LikeOptimisticContext = {
  previous?: NoticeDetailResponse;
};

export const useDeleteNoticeLike = (id: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const t = useTranslations("useDeleteNoticeLike");
  const queryKey = ["notice-detail", id] as const;

  return useAppMutation("auth", `/notices/${id}/like`, "delete", {
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<NoticeDetailResponse>(queryKey);

      queryClient.setQueryData<NoticeDetailResponse | undefined>(queryKey, (old) => {
        if (!old?.result) return old;

        if (!old.result.likeStatus) return old;
        const next = (old.result.likeCount ?? 0) - 1;

        return {
          ...old,
          result: {
            ...old.result,
            likeStatus: false,
            likeCount: Math.max(0, next),
          },
        };
      });

      return { previous };
    },
    onSuccess: () => {
      addToast(t("likeDeleteSuccess"), "success");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as LikeOptimisticContext | undefined;

      if (typedContext?.previous) {
        queryClient.setQueryData(queryKey, typedContext.previous);
      }

      addToast(t("likeDeleteError"), "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
