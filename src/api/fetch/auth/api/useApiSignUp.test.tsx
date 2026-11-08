import { act, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { useApiSignUp } from "./useApiSignUp";
import publicApi from "@/api/_base/axios/publicApi";
import authApi from "@/api/_base/axios/authApi";
import {
  isSessionTerminal,
  resetClientSession,
  sessionTransport,
  startClientSession,
} from "@/api/_base/auth/authSession";
import { MOCK_AUTH_SIGN_UP_REQUEST, MOCK_AUTH_SIGN_UP_RESPONSE } from "@/mock/data";

it("게스트 홈 방문으로 세션이 종료되어도 회원가입 요청을 전송한다", async () => {
  await startClientSession();
  resetClientSession();
  expect(isSessionTerminal()).toBe(true);

  const originalPublicAdapter = publicApi.defaults.adapter;
  const originalAuthAdapter = authApi.defaults.adapter;
  const originalSessionAdapter = sessionTransport.defaults.adapter;
  const publicRequest = jest.fn(async (config: InternalAxiosRequestConfig) => ({
    data: MOCK_AUTH_SIGN_UP_RESPONSE,
    config,
    status: 200,
    statusText: "OK",
    headers: new AxiosHeaders(),
  }));
  const authRequest = jest.fn(publicRequest);
  const sessionRequest = jest.fn(publicRequest);
  publicApi.defaults.adapter = publicRequest;
  authApi.defaults.adapter = authRequest;
  sessionTransport.defaults.adapter = sessionRequest;
  const client = new QueryClient();

  const { result, unmount } = renderHook(() => useApiSignUp(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });

  try {
    await act(async () => {
      await expect(result.current.mutateAsync(MOCK_AUTH_SIGN_UP_REQUEST)).resolves.toEqual(
        MOCK_AUTH_SIGN_UP_RESPONSE
      );
    });
    expect(publicRequest).toHaveBeenCalledTimes(1);
    expect(publicRequest).toHaveBeenCalledWith(
      expect.objectContaining({ url: "auth/signup", method: "post" })
    );
    expect(JSON.parse(publicRequest.mock.calls[0][0].data)).toEqual(MOCK_AUTH_SIGN_UP_REQUEST);
    expect(authRequest).not.toHaveBeenCalled();
    expect(sessionRequest).not.toHaveBeenCalled();
    expect(isSessionTerminal()).toBe(true);
  } finally {
    unmount();
    client.clear();
    publicApi.defaults.adapter = originalPublicAdapter;
    authApi.defaults.adapter = originalAuthAdapter;
    sessionTransport.defaults.adapter = originalSessionAdapter;
    await startClientSession();
  }
});
