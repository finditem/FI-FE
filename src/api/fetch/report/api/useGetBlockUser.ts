import { InfiniteData, keepPreviousData } from "@tanstack/react-query";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { BlockUserItem, BlockUserResponse } from "../types/BlockUserResponse";

export const useGetBlockUser = (size: number = 10) => {
  const params = new URLSearchParams();
  params.set("size", String(size));

  if (size) params.set("size", String(size));

  return useAppInfiniteQuery<BlockUserResponse, unknown, BlockUserItem[]>(
    "auth",
    ["user-block-list"],
    `/reports/block?${params.toString()}`,
    {
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage.result.nextCursor ?? undefined,
      select: (data: InfiniteData<BlockUserResponse>) =>
        data.pages.flatMap((page) => page.result.content),
    }
  );
};
