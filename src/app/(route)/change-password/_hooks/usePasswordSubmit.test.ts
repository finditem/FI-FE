import { renderHook, act } from "@testing-library/react";
import { usePasswordSubmit } from "./usePasswordSubmit";

const mockRouterPush = jest.fn();
const mockMutateAsync = jest.fn();
const mockUseGetUsersMe = jest.fn();
const mockUsePostChangePassword = jest.fn();
const mockWatch = jest.fn();
const mockErrors: Record<string, any> = {};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock("@/api/fetch/user", () => ({
  useGetUsersMe: () => mockUseGetUsersMe(),
  usePostChangePassword: () => mockUsePostChangePassword(),
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    watch: mockWatch,
    formState: { errors: mockErrors },
  }),
}));

describe("usePasswordSubmit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset errors
    Object.keys(mockErrors).forEach((k) => delete mockErrors[k]);
    mockUseGetUsersMe.mockReturnValue({ data: { result: { role: "USER" } } });
    mockUsePostChangePassword.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false });
    mockWatch.mockReturnValue(["Password1!", "Password1!"]);
    mockMutateAsync.mockResolvedValue({});
  });

  describe("buttonDisabled", () => {
    it("newPassword와 newPasswordConfirm이 일치하면 버튼이 활성화된다", () => {
      mockWatch.mockReturnValue(["Password1!", "Password1!"]);
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(false);
    });

    it("newPassword가 비어있으면 버튼이 비활성화된다", () => {
      mockWatch.mockReturnValue(["", "Password1!"]);
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(true);
    });

    it("newPasswordConfirm이 비어있으면 버튼이 비활성화된다", () => {
      mockWatch.mockReturnValue(["Password1!", ""]);
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(true);
    });

    it("newPassword와 newPasswordConfirm이 다르면 버튼이 비활성화된다", () => {
      mockWatch.mockReturnValue(["Password1!", "Different1!"]);
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(true);
    });

    it("isPending이면 버튼이 비활성화된다", () => {
      mockUsePostChangePassword.mockReturnValue({ mutateAsync: mockMutateAsync, isPending: true });
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(true);
    });

    it("newPassword 에러가 있으면 버튼이 비활성화된다", () => {
      mockErrors.newPassword = { message: "형식이 올바르지 않습니다." };
      mockWatch.mockReturnValue(["Password1!", "Password1!"]);
      const { result } = renderHook(() => usePasswordSubmit());
      expect(result.current.buttonDisabled).toBe(true);
    });
  });

  describe("handlePasswordChange", () => {
    it("mutateAsync가 newPassword, newPasswordConfirm과 함께 호출된다", async () => {
      mockWatch.mockReturnValue(["Password1!", "Password1!"]);
      const { result } = renderHook(() => usePasswordSubmit());
      await act(async () => {
        await result.current.handlePasswordChange({ preventDefault: jest.fn() } as any);
      });
      expect(mockMutateAsync).toHaveBeenCalledWith({
        newPassword: "Password1!",
        newPasswordConfirm: "Password1!",
      });
    });

    it("role이 ADMIN이면 /admin으로 이동한다", async () => {
      mockUseGetUsersMe.mockReturnValue({ data: { result: { role: "ADMIN" } } });
      const { result } = renderHook(() => usePasswordSubmit());
      await act(async () => {
        await result.current.handlePasswordChange({ preventDefault: jest.fn() } as any);
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/admin");
    });

    it("role이 USER이면 /mypage로 이동한다", async () => {
      mockUseGetUsersMe.mockReturnValue({ data: { result: { role: "USER" } } });
      const { result } = renderHook(() => usePasswordSubmit());
      await act(async () => {
        await result.current.handlePasswordChange({ preventDefault: jest.fn() } as any);
      });
      expect(mockRouterPush).toHaveBeenCalledWith("/mypage");
    });
  });
});
