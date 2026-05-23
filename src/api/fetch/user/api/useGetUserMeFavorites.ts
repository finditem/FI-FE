import { MypagePostsResponseType } from "../types/MypagePostsResponseType";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType, PostType } from "@/types";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { PostItem } from "../../post";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import { useAuthStore } from "@/store";
import { SortFilterValue } from "@/components";

interface useGetUserMeFavoritesProps {
  address?: string;
  postType?: PostType;
  category?: CategoryType;
  sortType?: SortFilterValue;
  keyword?: string;
  size?: number;
}

export const useGetUserMeFavorites = ({
  address,
  postType,
  category,
  sortType = "LATEST",
  keyword,
  size = 10,
}: useGetUserMeFavoritesProps) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const queryParams = new URLSearchParams();
  queryParams.set("address", address ?? "");

  if (postType) queryParams.set("postType", postType);
  if (category) queryParams.set("category", category);
  if (keyword) queryParams.set("keyword", keyword);

  queryParams.set("size", size.toString());

  return useAppInfiniteQuery<MypagePostsResponseType, ApiBaseResponseType<null>, PostItem[]>(
    "auth",
    ["/users/me/favorites", address, postType, category, sortType, keyword, size],
    `/users/me/favorites?${queryParams}`,
    {
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage.result.nextCursor ?? undefined,
      select: (data: InfiniteData<MypagePostsResponseType>) =>
        data.pages.flatMap((page) => page.result.postList),
      enabled: isAuthInitialized,
    }
  );
};
