import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { useAuthStore } from "@/store";
import { GetReportsResponseType, ReportItemType } from "../types/GetReportsResponseType";
import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import { ReportFilterStatus } from "@/types";

interface useGetUserReportsParams {
  status?: ReportFilterStatus;
  keyword?: string;
  size?: number;
}

export const useGetUserReports = ({ status, keyword, size = 10 }: useGetUserReportsParams) => {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);

  const queryParams = new URLSearchParams();

  if (keyword) queryParams.set("keyword", keyword);
  if (status && status !== "ALL") queryParams.set("status", status);
  queryParams.set("size", size.toString());

  return useAppInfiniteQuery<GetReportsResponseType, ApiBaseResponseType<null>, ReportItemType[]>(
    "auth",
    ["/reports/me", status, keyword],
    `/reports/me?${queryParams}`,
    {
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage.result.nextCursor ?? undefined,
      select: (data: InfiniteData<GetReportsResponseType>) =>
        data.pages.flatMap((page) => page.result.content),
      enabled: isAuthInitialized,
    }
  );
};
