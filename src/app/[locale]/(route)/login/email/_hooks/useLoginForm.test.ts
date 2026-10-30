import { renderHook, act } from "@testing-library/react";
import useLoginForm from "./useLoginForm";
import {
  MOCK_AUTH_ADMIN,
  MOCK_AUTH_INVALID_FORM,
  MOCK_AUTH_LOGIN_FORM,
  MOCK_AUTH_LOGIN_RESPONSE,
  MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE,
  MOCK_AUTH_USER,
  MOCK_AUTH_INVALID_CREDENTIALS_ERROR,
} from "@/mock/data/auth.data";

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const mockRouterReplace = jest.fn();
const mockRouterRefresh = jest.fn();
const mockAddToast = jest.fn();
const mockHandlerApiError = jest.fn();
const mockEmailLoginMutateAsync = jest.fn();
const mockQueryClientClear = jest.fn();
const mockHandleSubmit = jest.fn();
const mockSetValue = jest.fn();
const mockUseApiEmailLogin = jest.fn();
const mockAxiosGet = jest.fn();
const mockGetAdminUrl = jest.fn((path: string) => `https://a.finditem.kr${path}`);

jest.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: jest.fn().mockReturnValue(null) }),
}));

jest.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockRouterReplace, refresh: mockRouterRefresh }),
}));

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("@/hooks", () => ({
  useErrorToast: () => ({ handlerApiError: mockHandlerApiError }),
}));

jest.mock("@/api/fetch/auth/api/useApiEmailLogin", () => ({
  useApiEmailLogin: () => mockUseApiEmailLogin(),
}));

jest.mock("@/api/_base/axios/authApi", () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockAxiosGet(...args) },
}));

jest.mock("@/utils", () => ({
  ...jest.requireActual("@/utils"),
  getAdminUrl: (path: string) => mockGetAdminUrl(path),
}));

jest.mock("cookies-next", () => ({
  getCookie: jest.fn(() => undefined),
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    clear: mockQueryClientClear,
    cancelQueries: () => Promise.resolve(),
    fetchQuery: ({ queryFn }: { queryFn: (context: { signal: undefined }) => unknown }) =>
      queryFn({ signal: undefined }),
  }),
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
    mockUseApiEmailLogin.mockReturnValue({
      mutateAsync: mockEmailLoginMutateAsync,
      isPending: false,
    });
    mockHandleSubmit.mockImplementation((fn: Function) => (e?: any) => {
      e?.preventDefault?.();
      return Promise.resolve(fn);
    });
  });

  it("isPending 값을 반환한다", () => {
    mockUseApiEmailLogin.mockReturnValue({
      mutateAsync: mockEmailLoginMutateAsync,
      isPending: true,
    });
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.isPending).toBe(true);
  });

  describe("이메일 유효성 검사", () => {
    it("이메일 형식이 올바르지 않으면 경고 토스트가 표시된다", async () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => Promise.resolve(fn(MOCK_AUTH_INVALID_FORM))
      );
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockAddToast).toHaveBeenCalledWith("아이디에 이메일을 입력해주세요.", "warning");
    });

    it("이메일 형식이 올바르지 않으면 API가 호출되지 않는다", async () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => Promise.resolve(fn(MOCK_AUTH_INVALID_FORM))
      );
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockEmailLoginMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe("로그인 성공", () => {
    beforeEach(() => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => Promise.resolve(fn(MOCK_AUTH_LOGIN_FORM))
      );
      mockEmailLoginMutateAsync.mockResolvedValue(MOCK_AUTH_LOGIN_RESPONSE);
      mockAxiosGet.mockResolvedValue({ data: MOCK_AUTH_USER });
    });

    it("성공 시 queryClient.clear가 호출된다", async () => {
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockQueryClientClear).toHaveBeenCalled();
    });

    it("성공 시 router.replace('/')가 호출된다", async () => {
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });

    it("관리자 계정이면 관리자 앱으로 이동하고 운영 앱 라우팅은 하지 않는다", async () => {
      jest.spyOn(console, "error").mockImplementation(() => {});
      mockAxiosGet.mockResolvedValue({ data: MOCK_AUTH_ADMIN });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockAxiosGet.mock.calls[0][0]).toBe("/users/me");
      expect(mockGetAdminUrl).toHaveBeenCalledWith("/admin");
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });

    it("관리자라도 임시 비밀번호로 로그인하면 역할을 조회하지 않고 비밀번호 변경 페이지로 이동한다", async () => {
      mockEmailLoginMutateAsync.mockResolvedValue(MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE);
      mockAxiosGet.mockResolvedValue({ data: MOCK_AUTH_ADMIN });
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockAxiosGet).not.toHaveBeenCalled();
      expect(mockGetAdminUrl).not.toHaveBeenCalled();
      expect(mockRouterReplace).toHaveBeenCalledWith("/change-password?reason=temporary-password");
    });

    it("역할 조회에 실패하면 일반 사용자 흐름으로 이동한다", async () => {
      mockAxiosGet.mockRejectedValue(new Error("network"));
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockGetAdminUrl).not.toHaveBeenCalled();
      expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });
  });

  describe("임시 비밀번호로 로그인한 경우", () => {
    beforeEach(() => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => Promise.resolve(fn(MOCK_AUTH_LOGIN_FORM))
      );
      mockEmailLoginMutateAsync.mockResolvedValue(MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE);
    });

    it("비밀번호 변경 페이지로 이동한다", async () => {
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockRouterReplace).toHaveBeenCalledWith("/change-password?reason=temporary-password");
    });
  });

  describe("로그인 실패", () => {
    it("에러 코드가 있으면 handlerApiError가 호출된다", async () => {
      mockHandleSubmit.mockImplementation(
        (fn: Function) => () => Promise.resolve(fn(MOCK_AUTH_LOGIN_FORM))
      );
      mockEmailLoginMutateAsync.mockRejectedValue(MOCK_AUTH_INVALID_CREDENTIALS_ERROR);
      const { result } = renderHook(() => useLoginForm());
      await act(async () => {
        result.current.onSubmitLogin();
        await flushPromises();
      });
      expect(mockHandlerApiError).toHaveBeenCalled();
    });
  });
});
