import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAccountContainer from "./DeleteAccountContainer";

const mockUseGetUsersMe = jest.fn();

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: () => mockUseGetUsersMe(),
}));

jest.mock("../DeleteAccountReason/DeleteAccountReason", () => ({
  __esModule: true,
  default: ({ onNext, socialUser }: { onNext: () => void; socialUser?: boolean }) => (
    <div>
      <span>탈퇴 이유 선택:{String(socialUser ?? false)}</span>
      <button onClick={onNext}>다음으로</button>
    </div>
  ),
}));

jest.mock("../DeleteAccountPassword/DeleteAccountPassword", () => ({
  __esModule: true,
  default: ({ onBack }: { onBack: () => void }) => (
    <div>
      <span>비밀번호 확인</span>
      <button onClick={onBack}>이전으로</button>
    </div>
  ),
}));

describe("DeleteAccountContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetUsersMe.mockReturnValue({ data: undefined });
  });

  it("초기 상태에서 DeleteAccountReason이 렌더된다", () => {
    render(<DeleteAccountContainer />);
    expect(screen.getByText(/탈퇴 이유 선택/)).toBeInTheDocument();
    expect(screen.queryByText("비밀번호 확인")).not.toBeInTheDocument();
  });

  it("onNext 호출 시 DeleteAccountPassword가 렌더된다", () => {
    render(<DeleteAccountContainer />);
    fireEvent.click(screen.getByRole("button", { name: "다음으로" }));
    expect(screen.getByText("비밀번호 확인")).toBeInTheDocument();
    expect(screen.queryByText(/탈퇴 이유 선택/)).not.toBeInTheDocument();
  });

  it("onBack 호출 시 DeleteAccountReason으로 돌아온다", () => {
    render(<DeleteAccountContainer />);
    fireEvent.click(screen.getByRole("button", { name: "다음으로" }));
    fireEvent.click(screen.getByRole("button", { name: "이전으로" }));
    expect(screen.getByText(/탈퇴 이유 선택/)).toBeInTheDocument();
  });

  it("socialUser=true이면 DeleteAccountReason에 socialUser=true가 전달된다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: { result: { socialUser: true } },
    });
    render(<DeleteAccountContainer />);
    expect(screen.getByText("탈퇴 이유 선택:true")).toBeInTheDocument();
  });

  it("socialUser=false이면 DeleteAccountReason에 socialUser=false가 전달된다", () => {
    mockUseGetUsersMe.mockReturnValue({
      data: { result: { socialUser: false } },
    });
    render(<DeleteAccountContainer />);
    expect(screen.getByText("탈퇴 이유 선택:false")).toBeInTheDocument();
  });
});
