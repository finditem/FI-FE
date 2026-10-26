import { render, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import AuthBootstrap from "./authBootStrap";
import { sessionTransport, startClientSession } from "@/api/_base/auth/authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import {
  MOCK_AUTH_EXPIRED_RESPONSE,
  MOCK_AUTH_REFRESH_RESPONSE,
  MOCK_AUTH_USER,
} from "@/mock/data/auth.data";

const mockRouter = { replace: jest.fn() };
const mockDisconnectChat = jest.fn();
const mockDisconnectSSE = jest.fn();
jest.mock("@/i18n/navigation", () => ({ usePathname: () => "/", useRouter: () => mockRouter }));
jest.mock("@/api/fetch/chatRoom/api/chatSocket", () => ({
  disconnectChatSocket: () => mockDisconnectChat(),
}));
jest.mock("@/api/fetch/notification/api/notificationSSEClient", () => ({
  disconnectNotificationSSE: () => mockDisconnectSSE(),
}));
const response = (config: InternalAxiosRequestConfig, data: unknown, status = 200) => ({
  data,
  config,
  status,
  statusText: "",
  headers: new AxiosHeaders(),
});

describe("전역 인증 초기화", () => {
  let client: QueryClient;
  const adapter = sessionTransport.defaults.adapter;
  beforeEach(async () => {
    jest.clearAllMocks();
    await startClientSession();
    useAuthStore.getState().setStatus("checking");
    useAgreeStore.getState().login(true);
    client = new QueryClient();
    client.setQueryData(["users-me"], MOCK_AUTH_USER);
  });
  afterEach(() => {
    client.clear();
    sessionTransport.defaults.adapter = adapter;
  });

  it("메인에서 refresh 401이면 캐시·약관 상태·실시간 연결을 함께 정리한다", async () => {
    sessionTransport.defaults.adapter = async (config) => {
      if (config.method === "delete") return response(config, null);
      throw new AxiosError(
        "expired",
        "ERR_BAD_REQUEST",
        config,
        undefined,
        response(config, MOCK_AUTH_EXPIRED_RESPONSE, 401)
      );
    };
    render(
      <QueryClientProvider client={client}>
        <AuthBootstrap hasToken />
      </QueryClientProvider>
    );
    await waitFor(() => expect(useAuthStore.getState().status).toBe("anonymous"));
    expect(client.getQueryData(["users-me"])).toBeUndefined();
    expect(useAgreeStore.getState().isLoggedIn).toBe(false);
    expect(mockDisconnectChat).toHaveBeenCalledTimes(1);
    expect(mockDisconnectSSE).toHaveBeenCalledTimes(1);
  });

  it("초기 통신 장애는 세션을 지우지 않고 포커스 복귀 시 복구한다", async () => {
    sessionTransport.defaults.adapter = async () => {
      throw new AxiosError("network", "ERR_NETWORK");
    };
    render(
      <QueryClientProvider client={client}>
        <AuthBootstrap hasToken />
      </QueryClientProvider>
    );
    await waitFor(() => expect(useAuthStore.getState().status).toBe("unavailable"));
    expect(client.getQueryData(["users-me"])).toEqual(MOCK_AUTH_USER);
    expect(useAgreeStore.getState().isLoggedIn).toBe(true);
    sessionTransport.defaults.adapter = async (config) =>
      response(config, MOCK_AUTH_REFRESH_RESPONSE);
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });
    await waitFor(() => expect(useAuthStore.getState().status).toBe("authenticated"));
  });
});
