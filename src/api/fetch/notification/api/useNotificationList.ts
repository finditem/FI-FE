import { InfiniteData } from "@tanstack/react-query";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import { NotificationListResponse, NotificationListItem } from "../types/notificationListType";
import { useSearchParams } from "next/navigation";

const useNotificationList = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const category = categoryParam && categoryParam !== "all" ? categoryParam : undefined;

  const url = category
    ? `/notifications?notificationType=${encodeURIComponent(category?.toUpperCase())}`
    : "/notifications";

  return useAppInfiniteQuery<NotificationListResponse, unknown, NotificationListItem[]>(
    "auth",
    ["notificationList", category ?? "all"],
    url,
    {
      getNextPageParam: (lastPage) =>
        lastPage.result.hasNext ? lastPage.result.nextCursor : undefined,
      select: (data: InfiniteData<NotificationListResponse>) =>
        data.pages.flatMap((page) => page.result.content),
    }
  );
};

export default useNotificationList;
