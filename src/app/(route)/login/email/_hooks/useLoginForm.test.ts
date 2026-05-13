import { renderHook, act } from "@testing-library/react";
import useLoginForm from "./useLoginForm";

const mockRouterReplace = jest.fn();
const mockAddToast = jest.fn();
const mockHandlerApiError = jest.fn();
const mockEmailLoginMutate = jest.fn();
const mockQueryClientClear = jest.fn();
const mockHandleSubmit = jest.fn();
const mockSetValue = jest.fn();
const mockUseApiEmailLogin = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("@/hooks/domain", () => ({
  useErrorToast: () => ({ handlerApiError: mockHandlerApiError }),
}));

jest.mock("@/api/fetch/auth/api/useApiEmailLogin", () => ({
  __esModule: true,
  default: () => mockUseApiEmailLogin(),
}));

jest.mock("cookies-next", () => ({
  getCookie: jest.fn(() => undefined),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ clear: mockQueryClientClear }),
}));

jest.mock("@/constants", () => ({
  AUTH_LOGIN_SUCCESS_EVENT: "auth-login-success",
}));

jest.mock("react-hook-form", () => ({
  useFormContext: () => ({
    handleSubmit: mockHandleSubmit,
    setValue: mockSetValue,
  }),
}));

describe("useLoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiEmailLogin.mockReturnValue({ mutate: mockEmailLoginMutate, isPending: false });
    mockHandleSubmit.mockImplementation((fn: Function) => (e?: any) => {
      e?.preventDefault?.();
      return fn;
    });
  });

  it("isPending 값을 반환한다", () => {
    mockUseApiEmailLogin.mockReturnValue({ mutate: mockEmailLoginMutate, isPending: true });
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.isPending).toBe(true);
  });

  describe("이메일 유효성 검사", () => {
    it("이메일 형식이 올바르지 않으면 경고 토스트가 표시된다", () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => fn({ email: "invalid-email", password: "pw", rememberId: false })
      );
      const { result } = renderHook(() => useLoginForm());
      act(() => {
        result.current.onSubmitLogin();
      });
      expect(mockAddToast).toHaveBeenCalledWith("아이디에 이메일을 입력해주세요.", "warning");
    });

    it("이메일 형식이 올바르지 않으면 API가 호출되지 않는다", () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => fn({ email: "not-email", password: "pw", rememberId: false })
      );
      const { result } = renderHook(() => useLoginForm());
      act(() => {
        result.current.onSubmitLogin();
      });
      expect(mockEmailLoginMutate).not.toHaveBeenCalled();
    });
  });

  describe("로그인 성공", () => {
    beforeEach(() => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () =>
          fn({ email: "test@test.com", password: "Password1!", rememberId: false })
      );
      mockEmailLoginMutate.mockImplementation((_data: any, { onSuccess }: any) => onSuccess());
    });

    it("성공 시 queryClient.clear가 호출된다", () => {
      const { result } = renderHook(() => useLoginForm());
      act(() => {
        result.current.onSubmitLogin();
      });
      expect(mockQueryClientClear).toHaveBeenCalled();
    });

    it("성공 시 router.replace('/')가 호출된다", () => {
      const { result } = renderHook(() => useLoginForm());
      act(() => {
        result.current.onSubmitLogin();
      });
      expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });
  });

  describe("로그인 실패", () => {
    it("에러 코드가 있으면 handlerApiError가 호출된다", () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () =>
          fn({ email: "test@test.com", password: "Password1!", rememberId: false })
      );
      const error = { response: { data: { code: "AUTH401-INVALID_CREDENTIALS" } } };
      mockEmailLoginMutate.mockImplementation((_data: any, { onError }: any) => onError(error));
      const { result } = renderHook(() => useLoginForm());
      act(() => {
        result.current.onSubmitLogin();
      });
      expect(mockHandlerApiError).toHaveBeenCalled();
    });
  });
});
