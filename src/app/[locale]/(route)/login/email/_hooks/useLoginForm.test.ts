import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLoginForm from "./useLoginForm";
import useFooterNav from "@/components/layout/Footer/_hooks/useFooterNav";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { resetClientSession, startClientSession } from "@/api/_base/auth/authSession";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import {
  MOCK_AUTH_ADMIN,
  MOCK_AUTH_INVALID_FORM,
  MOCK_AUTH_LOGIN_FORM,
  MOCK_AUTH_LOGIN_RESPONSE,
  MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE,
  MOCK_AUTH_USER,
} from "@/mock/data/auth.data";

const mockRouter = { replace: jest.fn(), refresh: jest.fn() };
const mockAddToast = jest.fn();
const mockHandlerApiError = jest.fn();
const mockEmailLogin = jest.fn();
const mockGet = jest.fn();
const mockSubmit = jest.fn();
const mockGetAdminUrl = jest.fn((path: string) => `https://a.finditem.kr${path}`);
jest.mock("next/navigation", () => ({ useSearchParams: () => ({ get: () => null }) }));
jest.mock("@/i18n/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/",
  getPathname: ({ href }: { href: string }) => href,
}));
jest.mock("@/context/ToastContext", () => ({ useToast: () => ({ addToast: mockAddToast }) }));
jest.mock("@/hooks", () => ({
  useErrorToast: () => ({ handlerApiError: mockHandlerApiError }),
  useHiddenPath: () => false,
}));
jest.mock("@/api/fetch/auth/api/useApiEmailLogin", () => ({
  useApiEmailLogin: () => ({ mutateAsync: mockEmailLogin, isPending: false }),
}));
jest.mock("@/api/_base/axios/authApi", () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => mockGet(...args) },
}));
jest.mock("@/utils", () => ({
  getAdminUrl: (path: string) => mockGetAdminUrl(path),
  isValidCallbackUrl: () => false,
}));
jest.mock("cookies-next", () => ({
  getCookie: () => undefined,
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));
jest.mock("react-hook-form", () => ({
  useFormContext: () => ({ handleSubmit: mockSubmit, setValue: jest.fn() }),
}));

let client: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client }, children);

beforeEach(async () => {
  jest.clearAllMocks();
  await startClientSession();
  useAuthStore.getState().setStatus("anonymous");
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  mockSubmit.mockImplementation((callback) => () => callback(MOCK_AUTH_LOGIN_FORM));
  mockEmailLogin.mockResolvedValue(MOCK_AUTH_LOGIN_RESPONSE);
  mockGet.mockResolvedValue({ data: MOCK_AUTH_USER });
});
afterEach(() => {
  client.clear();
  jest.restoreAllMocks();
});

it("로그인 후 hasToken=false인 Footer도 마이페이지 방문 없이 채팅 이동을 허용한다", async () => {
  const { result } = renderHook(() => ({ login: useLoginForm(), footer: useFooterNav(false) }), {
    wrapper,
  });
  expect(
    result.current.footer.items.find((item) => item.href === "/chat")?.isLoginRequiredDisabled
  ).toBe(true);
  await act(async () => {
    result.current.login.onSubmitLogin();
  });
  await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
  expect(client.getQueryData(["users-me"])).toEqual(MOCK_AUTH_USER);
  expect(
    result.current.footer.items.find((item) => item.href === "/chat")?.isLoginRequiredDisabled
  ).toBe(false);
  const preventDefault = jest.fn();
  result.current.footer.items
    .find((item) => item.href === "/chat")!
    .onClick({ preventDefault } as never);
  expect(preventDefault).not.toHaveBeenCalled();
  expect(mockRouter.refresh).toHaveBeenCalled();
});

it("인증 확인 중에는 로그인 필요 안내를 표시하지 않는다", () => {
  useAuthStore.getState().setStatus("checking");
  const { result } = renderHook(() => useFooterNav(false), { wrapper });
  const preventDefault = jest.fn();
  act(() => {
    result.current.items
      .find((item) => item.href === "/chat")!
      .onClick({ preventDefault } as never);
  });
  expect(preventDefault).toHaveBeenCalled();
  expect(result.current.items.find((item) => item.href === "/chat")!.showLoginRequiredNotice).toBe(
    false
  );
});

it("이전 계정의 개인 캐시를 삭제하고 새 사용자 응답을 저장한다", async () => {
  client.setQueryData(["private-previous-user"], MOCK_AUTH_ADMIN);
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  await act(async () => {
    result.current.onSubmitLogin();
  });
  await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
  expect(client.getQueryData(["private-previous-user"])).toBeUndefined();
  expect(client.getQueryData(["users-me"])).toEqual(MOCK_AUTH_USER);
});

it("프로필 조회가 일시 실패해도 성공한 로그인을 취소하지 않는다", async () => {
  mockGet.mockRejectedValue(new Error("network"));
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  await act(async () => {
    result.current.onSubmitLogin();
  });
  await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith("/"));
  expect(useAuthStore.getState().status).toBe("authenticated");
});

it("임시 비밀번호는 역할 조회보다 비밀번호 변경을 우선한다", async () => {
  mockEmailLogin.mockResolvedValue(MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE);
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  await act(async () => {
    result.current.onSubmitLogin();
  });
  await waitFor(() =>
    expect(mockRouter.replace).toHaveBeenCalledWith("/change-password?reason=temporary-password")
  );
  expect(mockGet).not.toHaveBeenCalled();
});

it("로그인 완료 처리 중 로그아웃되면 이전 로그인 응답이 세션을 복원하지 않는다", async () => {
  mockEmailLogin.mockResolvedValue(MOCK_AUTH_TEMPORARY_LOGIN_RESPONSE);
  let release!: () => void;
  const cancel = jest.spyOn(client, "cancelQueries").mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        release = resolve;
      })
  );
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  act(() => {
    result.current.onSubmitLogin();
  });
  await waitFor(() => expect(cancel).toHaveBeenCalled());
  await act(async () => {
    resetClientSession();
    release();
  });
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(mockRouter.replace).not.toHaveBeenCalled();
  expect(useAuthStore.getState().status).toBe("anonymous");
  expect(useAgreeStore.getState().isLoggedIn).toBe(false);
});

it("관리자는 관리자 앱으로 이동한다", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  mockGet.mockResolvedValue({ data: MOCK_AUTH_ADMIN });
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  await act(async () => {
    result.current.onSubmitLogin();
  });
  await waitFor(() => expect(mockGetAdminUrl).toHaveBeenCalledWith("/admin"));
  expect(mockRouter.replace).not.toHaveBeenCalled();
});

it("이메일 검증 실패 시 로그인 요청을 보내지 않는다", async () => {
  mockSubmit.mockImplementation((callback) => () => callback(MOCK_AUTH_INVALID_FORM));
  const { result } = renderHook(() => useLoginForm(), { wrapper });
  await act(async () => {
    result.current.onSubmitLogin();
  });
  expect(mockEmailLogin).not.toHaveBeenCalled();
  expect(mockAddToast).toHaveBeenCalled();
});
