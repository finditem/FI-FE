import { MypagePostsResponseType } from "../types/MypagePostsResponseType";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { CategoryType, ItemStatus, PostType } from "@/types";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import { PostItem } from "../../post";
import { useAuthStore } from "@/store";
import { SortFilterValue } from "@/components";

interface useGetUsersMePostsParams {
  postType?: PostType;
  postStatus?: ItemStatus;
  category?: CategoryType;
  sortType?: SortFilterValue;
  startDate?: string | null;
  endDate?: string | null;
  keyword?: string;
  size?: number;
}

export const useGetUsersMePosts = ({
  postType,
  postStatus,
  category,
  sortType = "LATEST",
  startDate,
  endDate,
  keyword,
  size = 10,
}: useGetUsersMePostsParams) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const queryParams = new URLSearchParams();

  if (postType) queryParams.set("postType", postType);
  if (postStatus) queryParams.set("postStatus", postStatus);
  if (category) queryParams.set("category", category);
  if (startDate && endDate) {
    queryParams.set("startDate", startDate);
    queryParams.set("endDate", endDate);
  }
  if (keyword) queryParams.set("keyword", keyword);

  queryParams.set("size", size.toString());

  return useAppInfiniteQuery<MypagePostsResponseType, ApiBaseResponseType<null>, PostItem[]>(
    "auth",
    [
      "/users/me/posts",
      postType,
      postStatus,
      category,
      sortType,
      startDate,
      endDate,
      keyword,
      size,
    ],
    `/users/me/posts?${queryParams}`,
    {
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage.result.nextCursor ?? undefined,
      select: (data: InfiniteData<MypagePostsResponseType>) =>
        data.pages.flatMap((page) => page.result.postList),
      enabled: isAuthInitialized,
    }
  );
};
