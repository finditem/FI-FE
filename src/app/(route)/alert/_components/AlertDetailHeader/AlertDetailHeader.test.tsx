import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { useNotificationList } from "@/api/fetch/notification";
import { MOCK_ALERT_NOTIFICATION_ITEM } from "@/mock/data/alert.data";
import AlertDetailHeader from "./AlertDetailHeader";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

jest.mock("@/api/fetch/notification", () => ({
  ...jest.requireActual<typeof import("@/api/fetch/notification")>("@/api/fetch/notification"),
  useNotificationList: jest.fn(),
}));

const mockUseNotificationList = jest.mocked(useNotificationList);

describe("AlertDetailHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotificationList.mockReturnValue({
      data: [MOCK_ALERT_NOTIFICATION_ITEM],
      isPending: false,
    } as unknown as ReturnType<typeof useNotificationList>);
  });

  it("제목과 스크린 리더용 페이지 제목을 렌더링한다", () => {
    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    expect(screen.getByRole("heading", { level: 2, name: "알림" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "알림 페이지" })).toHaveClass("sr-only");
  });

  it("알림 목록이 있으면 삭제 진입 버튼이 활성화된다", () => {
    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    expect(screen.getByRole("button", { name: "삭제 화면 진입" })).not.toBeDisabled();
  });

  it("알림 목록이 비어 있으면 삭제 진입 버튼이 비활성화된다", () => {
    mockUseNotificationList.mockReturnValue({
      data: [],
      isPending: false,
    } as unknown as ReturnType<typeof useNotificationList>);

    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    expect(screen.getByRole("button", { name: "삭제 화면 진입" })).toBeDisabled();
  });

  it("목록 로딩 중이면 삭제 진입 버튼이 비활성화된다", () => {
    mockUseNotificationList.mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useNotificationList>);

    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    expect(screen.getByRole("button", { name: "삭제 화면 진입" })).toBeDisabled();
  });

  it("삭제 진입 클릭 시 setIsDeleteMode(true)를 호출한다", async () => {
    const user = userEvent.setup();
    const setIsDeleteMode = jest.fn();
    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={setIsDeleteMode} />);

    await user.click(screen.getByRole("button", { name: "삭제 화면 진입" }));

    expect(setIsDeleteMode).toHaveBeenCalledWith(true);
  });

  it("삭제 모드일 때 취소 클릭 시 setIsDeleteMode(false)를 호출한다", async () => {
    const user = userEvent.setup();
    const setIsDeleteMode = jest.fn();
    render(<AlertDetailHeader isDeleteMode setIsDeleteMode={setIsDeleteMode} />);

    await user.click(screen.getByRole("button", { name: "삭제 화면 취소" }));

    expect(setIsDeleteMode).toHaveBeenCalledWith(false);
  });

  it("알림 설정 클릭 시 알림 설정 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    render(<AlertDetailHeader isDeleteMode={false} setIsDeleteMode={jest.fn()} />);

    await user.click(screen.getByRole("button", { name: "알림 설정" }));

    expect(mockPush).toHaveBeenCalledWith("/mypage/notifications");
  });
});
