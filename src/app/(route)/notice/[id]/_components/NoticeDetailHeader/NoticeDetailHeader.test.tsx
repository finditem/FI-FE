import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoticeDetailHeader from "./NoticeDetailHeader";
import { useGetNoticeDetail } from "@/api/fetch/notice";
import { useGetUsersMe } from "@/api/fetch/user";
import {
  MOCK_NOTICE_DETAIL_HEADER_TEST_HOOK_RESULT,
  MOCK_USERS_ME_TEST_ROLE_ADMIN,
  MOCK_USERS_ME_TEST_ROLE_USER,
} from "@/mock/data";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("@/hooks", () => ({
  useClickOutside: jest.fn(() => ({ current: null })),
}));

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: jest.fn(),
}));

jest.mock("@/api/fetch/notice", () => ({
  useGetNoticeDetail: jest.fn(),
}));

jest.mock("./_internal/NoticeDeleteModal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="notice-delete-modal" /> : null,
}));

jest.mock("@/components/domain", () => ({
  ContentShareModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="content-share-modal" /> : null,
}));

describe("NoticeDetailHeader ([id])", () => {
  beforeEach(() => {
    mockPush.mockClear();
    (useGetNoticeDetail as jest.Mock).mockReturnValue({
      data: { result: MOCK_NOTICE_DETAIL_HEADER_TEST_HOOK_RESULT },
    });
  });

  const setupUser = (role: "ADMIN" | "USER") => {
    (useGetUsersMe as jest.Mock).mockReturnValue({
      data: {
        result: role === "ADMIN" ? MOCK_USERS_ME_TEST_ROLE_ADMIN : MOCK_USERS_ME_TEST_ROLE_USER,
      },
    });
  };

  it("공유 버튼 클릭 시 공유 모달을 엽니다", async () => {
    const user = userEvent.setup();
    setupUser("USER");
    render(<NoticeDetailHeader id={7} />);

    await user.click(
      within(screen.getByLabelText("헤더 액션")).getByRole("button", { name: "공지사항 공유" })
    );

    expect(screen.getByTestId("content-share-modal")).toBeInTheDocument();
  });

  it("비관리자일 때 케밥(메뉴) 트리거는 보이지 않습니다", () => {
    setupUser("USER");
    render(<NoticeDetailHeader id={1} />);

    expect(within(screen.getByLabelText("헤더 액션")).getAllByRole("button")).toHaveLength(1);
  });

  it("관리자일 때 메뉴에서 수정 클릭 시 작성 페이지로 이동합니다", async () => {
    const user = userEvent.setup();
    setupUser("ADMIN");
    render(<NoticeDetailHeader id={42} />);

    const actions = screen.getByLabelText("헤더 액션");
    const [, menuTrigger] = within(actions).getAllByRole("button");
    await user.click(menuTrigger);

    await user.click(screen.getByRole("button", { name: "게시글 수정하기" }));

    expect(mockPush).toHaveBeenCalledWith("/admin/notice/write/42");
  });

  it("관리자일 때 메뉴에서 삭제 클릭 시 삭제 모달을 엽니다", async () => {
    const user = userEvent.setup();
    setupUser("ADMIN");
    render(<NoticeDetailHeader id={5} />);

    const actions = screen.getByLabelText("헤더 액션");
    const [, menuTrigger] = within(actions).getAllByRole("button");
    await user.click(menuTrigger);

    await user.click(screen.getByRole("button", { name: "게시글 삭제하기" }));

    expect(screen.getByTestId("notice-delete-modal")).toBeInTheDocument();
  });
});
