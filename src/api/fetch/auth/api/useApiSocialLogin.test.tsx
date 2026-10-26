import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosHeaders } from "axios";
import { useApiSocialLogin } from "./useApiSocialLogin";
import authApi from "@/api/_base/axios/authApi";
import { startClientSession } from "@/api/_base/auth/authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import {
  MOCK_AUTH_SOCIAL_REQUEST,
  MOCK_AUTH_SOCIAL_RESPONSE,
  MOCK_AUTH_USER,
} from "@/mock/data/auth.data";

jest.mock("next/navigation", () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock("@/context/ToastContext", () => ({ useToast: () => ({ addToast: jest.fn() }) }));

it.each(["kakao", "apple"] as const)(
  "%s 로그인 완료 전에 사용자 캐시와 인증 상태를 확정한다",
  async (provider) => {
    await startClientSession();
    useAuthStore.getState().setStatus("anonymous");
    const original = authApi.defaults.adapter;
    authApi.defaults.adapter = async (config) => ({
      data: config.url === "/users/me" ? MOCK_AUTH_USER : MOCK_AUTH_SOCIAL_RESPONSE,
      config,
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
    });
    const client = new QueryClient();
    try {
      const { result, unmount } = renderHook(() => useApiSocialLogin(provider), {
        wrapper: ({ children }) => (
          <QueryClientProvider client={client}>{children}</QueryClientProvider>
        ),
      });
      await act(async () => {
        await result.current.mutateAsync(MOCK_AUTH_SOCIAL_REQUEST);
      });
      expect(client.getQueryData(["users-me"])).toEqual(MOCK_AUTH_USER);
      expect(useAuthStore.getState().status).toBe("authenticated");
      unmount();
    } finally {
      authApi.defaults.adapter = original;
      client.clear();
    }
  }
);
