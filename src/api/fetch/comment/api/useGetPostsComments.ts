import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { GetPostsCommentsData, GetPostsCommentsResponse } from "../types/GetPostsComments";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";

interface UseGetPostsCommentsParams {
  postId: number;
}

export const useGetPostsComments = ({ postId }: UseGetPostsCommentsParams) => {
  return useAppInfiniteQuery<GetPostsCommentsResponse, unknown, GetPostsCommentsData>(
    "auth",
    ["post-comments", postId],
    `/comments/posts/${postId}?postId=${postId}`,
    {
      enabled: !!postId,
      pageParamName: "page",
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.result.hasNext ? lastPage.result.nextPage : undefined,
      select: (data: InfiniteData<GetPostsCommentsResponse>) => {
        const lastPage = data.pages[data.pages.length - 1];
        const result = lastPage?.result;

        return {
          comments: data.pages.flatMap((page) => page.result?.comments ?? []),
          hasNext: result?.hasNext ?? false,
          nextPage: result?.nextPage ?? 0,
          remainingCount: result?.remainingCount ?? 0,
          totalCommentCount: result?.totalCommentCount ?? 0,
        };
      },
      placeholderData: keepPreviousData,
    }
  );
};
