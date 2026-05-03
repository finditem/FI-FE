import { render, screen, fireEvent } from "@testing-library/react";
import AccountContainer from "./AccountContainer";

const mockAddToast = jest.fn();
const mockHandleLogout = jest.fn();
const mockUseGetUsersMe = jest.fn();

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: () => mockUseGetUsersMe(),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("@/hooks", () => ({
  useLogout: () => ({ handleLogout: mockHandleLogout, isPending: false }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("@/components/common", () => ({
  Icon: () => <span />,
  ProfileAvatar: () => <div />,
}));

describe("AccountContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUsersMe.mockReturnValue({ data: undefined, isError: false });
  });

  it("API 데이터가 없으면 기본 닉네임과 이메일을 표시한다", () => {
    render(<AccountContainer />);
    expect(screen.getByText("사용자 닉네임")).toBeInTheDocument();
    expect(screen.getByText("사용자 이메일")).toBeInTheDocument();
  });

  it("API 데이터가 있으면 닉네임과 이메일을 표시한다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: { result: { nickname: "테스트유저", email: "test@test.com", profileImg: "" } },
      isError: false,
    });
    render(<AccountContainer />);
    expect(screen.getByText("테스트유저")).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("isError=true이면 addToast가 호출된다", () => {
    mockUseGetUsersMe.mockReturnValue({ data: undefined, isError: true });
    render(<AccountContainer />);
    expect(mockAddToast).toHaveBeenCalledWith("프로필 조회에 실패했어요", "warning");
  });

  it("계정 설정 메뉴 링크들이 렌더된다", () => {
    render(<AccountContainer />);
    expect(screen.getByRole("link", { name: "비밀번호 변경" })).toHaveAttribute(
      "href",
      "/change-password"
    );
    expect(screen.getByRole("link", { name: "회원 탈퇴" })).toHaveAttribute(
      "href",
      "/mypage/delete-account"
    );
  });

  it("로그아웃 버튼 클릭 시 handleLogout이 호출된다", () => {
    render(<AccountContainer />);
    fireEvent.click(screen.getByRole("button", { name: "로그아웃" }));
    expect(mockHandleLogout).toHaveBeenCalled();
  });
});
