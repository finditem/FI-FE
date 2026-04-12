import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/context/ToastContext";
import useAppMutation from "@/api/_base/query/useAppMutation";
import {
  PostFavoritesWriteRequestBody,
  PostFavoritesWriteResponse,
} from "../types/PostFavoritesType";
import { GetDetailPostResponse } from "../types/PostDetailType";

type FavoriteOptimisticContext = {
  previous?: GetDetailPostResponse;
};

export const useDeletePostFavorites = (id: number) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const queryKey = ["post-detail", id] as const;

  return useAppMutation<PostFavoritesWriteRequestBody, PostFavoritesWriteResponse>(
    "auth",
    `/posts/${id}/favorites`,
    "delete",
    {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<GetDetailPostResponse>(queryKey);

        queryClient.setQueryData<GetDetailPostResponse | undefined>(queryKey, (old) => {
          if (!old?.result) return old;

          if (!old.result.favoriteStatus) return old;
          const next = (old.result.favoriteCount ?? 0) - 1;

          return {
            ...old,
            result: {
              ...old.result,
              favoriteStatus: false,
              favoriteCount: Math.max(0, next),
            },
          };
        });

        return { previous };
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["/users/me/favorites"] }),
          queryClient.invalidateQueries({ queryKey: ["posts"] }),
        ]);
        addToast("즐겨찾기가 삭제되었어요.", "success");
      },
      onError: (_error, _variables, context) => {
        const typedContext = context as FavoriteOptimisticContext | undefined;

        if (typedContext?.previous) {
          queryClient.setQueryData(queryKey, typedContext.previous);
        }

        addToast("즐겨찾기 삭제에 실패했어요.", "error");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    },
    { sendDeleteBody: true }
  );
};
