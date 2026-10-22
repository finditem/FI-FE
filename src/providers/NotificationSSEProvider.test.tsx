import { act, render } from "@testing-library/react";
import { NotificationSSEProvider } from "./NotificationSSEProvider";
import { useNotificationSSE } from "@/api/fetch/notification";
import { MOCK_ALERT_NOTIFICATION_REVIEW_ITEM } from "@/mock/data";

const mockPush = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockShowSnackBar = jest.fn();
const mockSetUnread = jest.fn();
const mockAddUnreadType = jest.fn();
const mockRouter = { push: mockPush };

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/alert",
}));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));
jest.mock("@/api/fetch/notification", () => ({
  ...jest.requireActual("@/api/fetch/notification"),
  useNotificationSSE: jest.fn(() => ({ connect: jest.fn() })),
}));
jest.mock("@/hooks", () => ({ useFaviconNotification: jest.fn() }));
jest.mock("@/context/SnackBarContext", () => ({
  useSnackBar: () => ({ showSnackBar: mockShowSnackBar }),
}));
jest.mock("@/store", () => ({
  useAuthStore: (select: (state: unknown) => unknown) => select({ isAuthInitialized: true }),
  useNotificationStore: (select: (state: unknown) => unknown) =>
    select({
      hasUnreadNotification: false,
      setHasUnreadNotification: mockSetUnread,
      addUnreadNotificationType: mockAddUnreadType,
    }),
}));

it("리뷰 SSE를 수신하면 배지와 목록을 갱신하고 후기 토스트에서 받은 후기로 이동한다", () => {
  render(<NotificationSSEProvider>content</NotificationSSEProvider>);
  const { onNotification } = jest.mocked(useNotificationSSE).mock.calls[0][0]!;

  act(() => onNotification?.(MOCK_ALERT_NOTIFICATION_REVIEW_ITEM));

  expect(mockSetUnread).toHaveBeenCalledWith(true);
  expect(mockAddUnreadType).toHaveBeenCalledWith("REVIEW");
  expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["notificationList"] });
  expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["/users/me/reviews"] });
  expect(mockShowSnackBar).toHaveBeenCalledWith(
    "후기가 도착했어요.",
    "찾길 후기로 이동",
    expect.any(Function)
  );
  mockShowSnackBar.mock.calls[0][2]();
  expect(mockPush).toHaveBeenCalledWith("/mypage/reviews");
});
