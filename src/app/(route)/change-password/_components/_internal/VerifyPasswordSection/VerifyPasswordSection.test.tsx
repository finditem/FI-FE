import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import VerifyPasswordSection from "./VerifyPasswordSection";

const mockRouterPush = jest.fn();
const mockGetValues = jest.fn();
const mockSetError = jest.fn();
const mockClearErrors = jest.fn();
const mockMutateAsync = jest.fn();
const mockUsePostVerifyPassword = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    getValues: mockGetValues,
    setError: mockSetError,
    clearErrors: mockClearErrors,
  }),
}));

jest.mock("@/api/fetch/user", () => ({
  usePostVerifyPassword: () => mockUsePostVerifyPassword(),
}));

jest.mock("@/components/common", () => ({
  InputText: ({ label, btnOption }: any) => (
    <div>
      <label>{label}</label>
      <button type="button" onClick={btnOption?.btnOnClick} disabled={btnOption?.disabled}>
        {btnOption?.btnLabel}
      </button>
    </div>
  ),
  SnackBar: ({ message, actionLabel, actionHandler }: any) => (
    <div data-testid="snackbar">
      <span>{message}</span>
      <button type="button" onClick={actionHandler}>
        {actionLabel}
      </button>
    </div>
  ),
}));

describe("<VerifyPasswordSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetValues.mockReturnValue("currentPassword123!");
    mockUsePostVerifyPassword.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false });
  });

  it("'현재 비밀번호' 레이블이 렌더된다", () => {
    render(<VerifyPasswordSection />);
    expect(screen.getByText("현재 비밀번호")).toBeInTheDocument();
  });

  it("'비밀번호 확인' 버튼이 렌더된다", () => {
    render(<VerifyPasswordSection />);
    expect(screen.getByRole("button", { name: "비밀번호 확인" })).toBeInTheDocument();
  });

  describe("비밀번호 확인 성공", () => {
    it("검증 성공 시 clearErrors가 호출된다", async () => {
      mockMutateAsync.mockResolvedValue({});
      render(<VerifyPasswordSection />);
      fireEvent.click(screen.getByRole("button", { name: "비밀번호 확인" }));
      await waitFor(() => {
        expect(mockClearErrors).toHaveBeenCalledWith("currentPassword");
      });
    });
  });

  describe("비밀번호 확인 실패", () => {
    it("검증 실패 시 setError가 호출된다", async () => {
      mockMutateAsync.mockRejectedValue(new Error("wrong password"));
      render(<VerifyPasswordSection />);
      fireEvent.click(screen.getByRole("button", { name: "비밀번호 확인" }));
      await waitFor(() => {
        expect(mockSetError).toHaveBeenCalledWith(
          "currentPassword",
          expect.objectContaining({ message: "비밀번호가 일치하지 않습니다." })
        );
      });
    });

    it("검증 실패 시 SnackBar가 표시된다", async () => {
      mockMutateAsync.mockRejectedValue(new Error("wrong password"));
      render(<VerifyPasswordSection />);
      fireEvent.click(screen.getByRole("button", { name: "비밀번호 확인" }));
      await waitFor(() => {
        expect(screen.getByTestId("snackbar")).toBeInTheDocument();
      });
    });

    it("SnackBar의 '비밀번호 찾기' 클릭 시 /find-pw로 이동한다", async () => {
      mockMutateAsync.mockRejectedValue(new Error("wrong password"));
      render(<VerifyPasswordSection />);
      fireEvent.click(screen.getByRole("button", { name: "비밀번호 확인" }));
      await waitFor(() => screen.getByTestId("snackbar"));
      fireEvent.click(screen.getByRole("button", { name: "비밀번호 찾기" }));
      expect(mockRouterPush).toHaveBeenCalledWith("/find-pw");
    });
  });
});
