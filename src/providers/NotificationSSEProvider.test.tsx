import { act, render } from "@testing-library/react";
import { NotificationSSEProvider } from "./NotificationSSEProvider";
import { useNotificationSSE, useNotificationUnreadList } from "@/api/fetch/notification";
import { MOCK_ALERT_NOTIFICATION_REVIEW_ITEM } from "@/mock/data";
import { saveNotificationToastSeenAt } from "@/utils";

const mockPush = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockShowSnackBar = jest.fn();
const mockSetUnread = jest.fn();
const mockAddUnreadType = jest.fn();
const mockSetUnreadTypes = jest.fn();
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
  useNotificationUnreadList: jest.fn(() => ({ data: undefined, refetch: jest.fn() })),
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
      setUnreadNotificationTypes: mockSetUnreadTypes,
    }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

const getSSEOptions = () => jest.mocked(useNotificationSSE).mock.calls[0][0]!;

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

it("connect 후 조회가 끝나기 전에 온 알림은 토스트 없이 점만 켜고, 조회가 끝나면 미확인 알림 요약 토스트를 띄운다", async () => {
  let resolveRefetch!: (value: unknown) => void;
  const mockRefetch = jest.fn(() => new Promise((resolve) => (resolveRefetch = resolve)));
  jest.mocked(useNotificationUnreadList).mockReturnValue({
    data: undefined,
    refetch: mockRefetch,
  } as unknown as ReturnType<typeof useNotificationUnreadList>);

  render(<NotificationSSEProvider>content</NotificationSSEProvider>);
  const { onConnect, onNotification } = getSSEOptions();

  act(() => onConnect?.(""));
  act(() => onNotification?.(MOCK_ALERT_NOTIFICATION_REVIEW_ITEM));

  expect(mockRefetch).toHaveBeenCalledTimes(1);
  expect(mockSetUnread).toHaveBeenCalledWith(true);
  expect(mockShowSnackBar).not.toHaveBeenCalled();

  await act(async () => {
    resolveRefetch({
      isSuccess: true,
      data: { items: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM], hasNext: false },
    });
  });

  expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ["notificationList"] });
  expect(mockShowSnackBar).toHaveBeenCalledTimes(1);
  expect(mockShowSnackBar).toHaveBeenCalledWith(
    "확인하지 않은 알림 1건이 있어요",
    "알림 페이지로 이동",
    expect.any(Function)
  );
});

it("이미 토스트로 보여 준 시각 이전의 미확인 알림만 있으면 요약 토스트를 다시 띄우지 않는다", async () => {
  saveNotificationToastSeenAt(MOCK_ALERT_NOTIFICATION_REVIEW_ITEM.createdAt);
  jest.mocked(useNotificationUnreadList).mockReturnValue({
    data: undefined,
    refetch: jest.fn().mockResolvedValue({
      isSuccess: true,
      data: { items: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM], hasNext: false },
    }),
  } as unknown as ReturnType<typeof useNotificationUnreadList>);

  render(<NotificationSSEProvider>content</NotificationSSEProvider>);

  await act(async () => getSSEOptions().onConnect?.(""));

  expect(mockShowSnackBar).not.toHaveBeenCalled();
});

it("조회 결과로 점을 맞추고, 같은 번호와 시각으로 다시 온 알림은 토스트를 띄우지 않으며 시각이 바뀌면 띄운다", () => {
  jest.mocked(useNotificationUnreadList).mockReturnValue({
    data: { items: [MOCK_ALERT_NOTIFICATION_REVIEW_ITEM], hasNext: false },
    refetch: jest.fn(),
  } as unknown as ReturnType<typeof useNotificationUnreadList>);

  render(<NotificationSSEProvider>content</NotificationSSEProvider>);
  const { onNotification } = getSSEOptions();

  expect(mockSetUnreadTypes).toHaveBeenCalledWith(["REVIEW"]);
  expect(mockSetUnread).toHaveBeenCalledWith(true);

  act(() => onNotification?.(MOCK_ALERT_NOTIFICATION_REVIEW_ITEM));
  expect(mockShowSnackBar).not.toHaveBeenCalled();

  act(() =>
    onNotification?.({
      ...MOCK_ALERT_NOTIFICATION_REVIEW_ITEM,
      createdAt: "2026-01-15T11:00:00.000Z",
    })
  );
  expect(mockShowSnackBar).toHaveBeenCalledWith(
    "후기가 도착했어요.",
    "찾길 후기로 이동",
    expect.any(Function)
  );
});
