import useAppQuery from "@/api/_base/query/useAppQuery";
import {
  NotificationListResponse,
  NotificationUnreadListResult,
} from "../types/notificationListType";

/**
 * 안 읽은 알림 첫 페이지를 조회합니다. 안 읽음 점과 첫 진입 토스트의 기준입니다.
 *
 * @remarks
 * - query key가 `["notificationList"]`로 시작하므로, 읽음·삭제·SSE 수신으로 목록을 무효화하면 이 조회도 다시 실행됩니다.
 * - 서버가 `unreadOnly`를 무시하는 경우에도 결과가 맞도록 `isRead`로 한 번 더 거릅니다.
 * - 응답이 페이지 단위라 첫 페이지 밖의 알림은 `items`에 없습니다. `hasNext`로 더 있는지만 알 수 있습니다.
 *
 * @param enabled - 로그인 상태일 때만 `true`로 넘깁니다.
 *
 * @author suhyeon
 *
 * @example
 * const { data, refetch } = useNotificationUnreadList(isAuthenticated);
 */
const useNotificationUnreadList = (enabled: boolean) => {
  return useAppQuery<NotificationListResponse, unknown, NotificationUnreadListResult>(
    "auth",
    ["notificationList", "unreadOnly"],
    "/notifications?unreadOnly=true",
    {
      enabled,
      select: (data) => ({
        items: data.result.content.filter((notification) => !notification.isRead),
        hasNext: data.result.hasNext,
      }),
    }
  );
};

export default useNotificationUnreadList;
