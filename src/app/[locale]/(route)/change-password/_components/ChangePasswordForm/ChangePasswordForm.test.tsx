import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChangePasswordForm from "./ChangePasswordForm";

const mockUsePasswordSubmit = jest.fn();

jest.mock("../../_hooks/usePasswordSubmit", () => ({
  usePasswordSubmit: () => mockUsePasswordSubmit(),
}));

jest.mock("../_internal", () => ({
  VerifyPasswordSection: () => <div data-testid="verify-password-section">현재 비밀번호 확인</div>,
  PasswordConfirmSection: () => <div data-testid="password-confirm-section">새 비밀번호 입력</div>,
}));

jest.mock("@/components/domain", () => ({
  FooterButton: ({ children, disabled, type }: any) => (
    <button type={type} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe("<ChangePasswordForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePasswordSubmit.mockReturnValue({
      handlePasswordChange: jest.fn((e) => e.preventDefault()),
      buttonDisabled: false,
    });
  });

  describe("기본 렌더링", () => {
    it("VerifyPasswordSection이 렌더된다", () => {
      render(<ChangePasswordForm />);
      expect(screen.getByTestId("verify-password-section")).toBeInTheDocument();
    });

    it("PasswordConfirmSection이 렌더된다", () => {
      render(<ChangePasswordForm />);
      expect(screen.getByTestId("password-confirm-section")).toBeInTheDocument();
    });

    it("'변경 완료' 버튼이 렌더된다", () => {
      render(<ChangePasswordForm />);
      expect(screen.getByRole("button", { name: "변경 완료" })).toBeInTheDocument();
    });
  });

  describe("버튼 상태", () => {
    it("buttonDisabled=false이면 변경 완료 버튼이 활성화된다", () => {
      mockUsePasswordSubmit.mockReturnValue({
        handlePasswordChange: jest.fn(),
        buttonDisabled: false,
      });
      render(<ChangePasswordForm />);
      expect(screen.getByRole("button", { name: "변경 완료" })).not.toBeDisabled();
    });

    it("buttonDisabled=true이면 변경 완료 버튼이 비활성화된다", () => {
      mockUsePasswordSubmit.mockReturnValue({
        handlePasswordChange: jest.fn(),
        buttonDisabled: true,
      });
      render(<ChangePasswordForm />);
      expect(screen.getByRole("button", { name: "변경 완료" })).toBeDisabled();
    });
  });

  describe("폼 제출", () => {
    it("폼 제출 시 handlePasswordChange가 호출된다", () => {
      const mockHandlePasswordChange = jest.fn((e) => e.preventDefault());
      mockUsePasswordSubmit.mockReturnValue({
        handlePasswordChange: mockHandlePasswordChange,
        buttonDisabled: false,
      });
      const { container } = render(<ChangePasswordForm />);
      fireEvent.submit(container.querySelector("form")!);
      expect(mockHandlePasswordChange).toHaveBeenCalled();
    });
  });
});
