import { renderHook } from "@testing-library/react";
import useAppQuery from "@/api/_base/query/useAppQuery";
import useNotificationUnreadList from "./useNotificationUnreadList";
import {
  MOCK_ALERT_NOTIFICATION_REVIEW_ITEM,
  MOCK_ALERT_NOTIFICATION_UNREAD_MIXED_RESPONSE,
} from "@/mock/data";

jest.mock("@/api/_base/query/useAppQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

it("목록 무효화에 함께 걸리는 키로 unreadOnly 조회를 요청하고, 읽은 알림을 걸러 반환한다", () => {
  renderHook(() => useNotificationUnreadList(true));

  const [apiType, queryKey, url, options] = jest.mocked(useAppQuery).mock.calls[0];
  expect(apiType).toBe("auth");
  expect(queryKey).toEqual(["notificationList", "unreadOnly"]);
  expect(url).toBe("/notifications?unreadOnly=true");
  expect(options?.enabled).toBe(true);

  const select = options?.select as (data: unknown) => unknown;
  expect(select(MOCK_ALERT_NOTIFICATION_UNREAD_MIXED_RESPONSE)).toEqual({
    items: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM],
    hasNext: true,
  });
});
