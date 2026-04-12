import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { ActivityFilterValue } from "@/app/(route)/mypage/activities/_types/ActivityFilterType";
import { useAuthStore } from "@/store";
import { ActivityGroupItemType, MypageActivityResponse } from "../types/MypageActivityResponse";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";

interface useGetUserActivityParams {
  type?: ActivityFilterValue;
  startDate?: string | null;
  endDate?: string | null;
  keyword?: string;
  size?: number;
}

export const useGetUserActivity = ({
  type,
  startDate,
  endDate,
  keyword,
  size = 10,
}: useGetUserActivityParams) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.set("keyword", keyword);
  if (type) queryParams.set("type", type);
  if (startDate && endDate) {
    queryParams.set("startDate", startDate);
    queryParams.set("endDate", endDate);
  }

  queryParams.set("size", size.toString());
  return useAppInfiniteQuery<
    MypageActivityResponse,
    ApiBaseResponseType<null>,
    ActivityGroupItemType[]
  >(
    "auth",
    ["/users/me/activities", type, startDate, endDate, keyword],
    `/users/me/activities?${queryParams}`,
    {
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage.result.nextCursor ?? undefined,
      select: (data: InfiniteData<MypageActivityResponse>) =>
        data.pages.flatMap((page) => page.result.activities),
      enabled: isAuthInitialized,
    }
  );
};
