import { renderHook } from "@testing-library/react";
import useAppInfiniteQuery from "@/api/_base/query/useAppInfiniteQuery";
import useNotificationList from "./useNotificationList";
import { MOCK_ALERT_NOTIFICATION_REVIEW_ITEM } from "@/mock/data";

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("category=review"),
}));
jest.mock("@/api/_base/query/useAppInfiniteQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

it("후기 필터를 REVIEW로 요청하고 응답의 알림을 펼쳐 반환한다", () => {
  jest.mocked(useAppInfiniteQuery).mockReturnValue({
    data: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM],
  } as unknown as ReturnType<typeof useAppInfiniteQuery>);

  const { result } = renderHook(() => useNotificationList());

  expect(useAppInfiniteQuery).toHaveBeenCalledWith(
    "auth",
    ["notificationList", "review"],
    "/notifications?notificationType=REVIEW",
    expect.any(Object)
  );
  expect(result.current.data).toEqual([MOCK_ALERT_NOTIFICATION_REVIEW_ITEM]);
});
