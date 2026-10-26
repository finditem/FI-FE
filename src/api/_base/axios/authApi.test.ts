import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import authApi from "./authApi";
import {
  refreshSession,
  resetClientSession,
  sessionTransport,
  startClientSession,
} from "../auth/authSession";
import { useAuthStore } from "@/store/useAuthStore/useAuthStore";
import { useAgreeStore } from "@/store/useAgreeStore/useAgreeStore";
import { AUTH_SESSION_ENDED_EVENT } from "@/constants/AUTH_EVENTS";
import {
  MOCK_AUTH_EXPIRED_RESPONSE,
  MOCK_AUTH_REFRESH_RESPONSE,
  MOCK_AUTH_USER,
} from "@/mock/data/auth.data";

const respond = (config: InternalAxiosRequestConfig, data: unknown) => ({
  data,
  status: 200,
  statusText: "OK",
  headers: new AxiosHeaders(),
  config,
});
const rejectStatus = (config: InternalAxiosRequestConfig, status: number) =>
  Promise.reject(
    new AxiosError("Request failed", "ERR_BAD_REQUEST", config, undefined, {
      ...respond(config, MOCK_AUTH_EXPIRED_RESPONSE),
      status,
    })
  );

describe("인증 API 세션 복구", () => {
  const originalAdapter = authApi.defaults.adapter;
  const originalSessionAdapter = sessionTransport.defaults.adapter;
  beforeEach(async () => {
    await startClientSession();
    useAuthStore.getState().setStatus("authenticated");
    window.history.replaceState(null, "", "/");
  });
  afterEach(() => {
    authApi.defaults.adapter = originalAdapter;
    sessionTransport.defaults.adapter = originalSessionAdapter;
    jest.restoreAllMocks();
  });

  it("동시 401 다섯 개와 Bootstrap 재발급은 재발급 한 건을 공유한다", async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const refresh = jest.fn(async (config: InternalAxiosRequestConfig) => {
      await pending;
      return respond(config, MOCK_AUTH_REFRESH_RESPONSE);
    });
    sessionTransport.defaults.adapter = refresh;
    const seen = new Set<string>();
    authApi.defaults.adapter = (async (config) => {
      if (!seen.has(config.url!)) {
        seen.add(config.url!);
        return rejectStatus(config, 401);
      }
      return respond(config, MOCK_AUTH_USER);
    }) as AxiosAdapter;
    const bootstrap = refreshSession();
    const requests = Array.from({ length: 5 }, (_, i) => authApi.get(`/users/me?request=${i}`));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(refresh).toHaveBeenCalledTimes(1);
    release();
    await expect(Promise.all([bootstrap, ...requests])).resolves.toHaveLength(6);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("이전 토큰 요청의 401이 늦게 도착하면 추가 재발급하지 않는다", async () => {
    let rejectLate!: () => void;
    const refresh = jest.fn(async (config: InternalAxiosRequestConfig) =>
      respond(config, MOCK_AUTH_REFRESH_RESPONSE)
    );
    sessionTransport.defaults.adapter = refresh;
    let first = true;
    authApi.defaults.adapter = (async (config) => {
      if (first) {
        first = false;
        return new Promise((_, reject) => {
          rejectLate = () => {
            rejectStatus(config, 401).catch(reject);
          };
        });
      }
      return respond(config, MOCK_AUTH_USER);
    }) as AxiosAdapter;
    const request = authApi.get("/users/me");
    await new Promise((resolve) => setTimeout(resolve, 0));
    await refreshSession();
    rejectLate();
    await expect(request).resolves.toHaveProperty("data", MOCK_AUTH_USER);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("메인에서 refresh 401이면 쿠키 정리와 세션 종료를 한 번만 실행한다", async () => {
    const ended = jest.fn();
    window.addEventListener(AUTH_SESSION_ENDED_EVENT, ended);
    useAgreeStore.getState().login(true);
    const transport = jest.fn(async (config: InternalAxiosRequestConfig) =>
      config.method === "delete" ? respond(config, null) : rejectStatus(config, 401)
    );
    sessionTransport.defaults.adapter = transport;
    const results = await Promise.allSettled([refreshSession(), refreshSession()]);
    expect(results.every((r) => r.status === "rejected")).toBe(true);
    expect(transport.mock.calls.filter(([config]) => config.method === "delete")).toHaveLength(1);
    expect(ended).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().status).toBe("anonymous");
    expect(useAgreeStore.getState().isLoggedIn).toBe(false);
    window.removeEventListener(AUTH_SESSION_ENDED_EVENT, ended);
  });

  it.each([403, 500])(
    "refresh %i는 세션을 만료시키지 않고 이후 다시 시도할 수 있다",
    async (status) => {
      sessionTransport.defaults.adapter = (config) => rejectStatus(config, status);
      await expect(refreshSession()).rejects.toHaveProperty("response.status", status);
      expect(useAuthStore.getState().status).toBe("authenticated");
      sessionTransport.defaults.adapter = async (config) =>
        respond(config, MOCK_AUTH_REFRESH_RESPONSE);
      await expect(refreshSession()).resolves.toEqual(MOCK_AUTH_REFRESH_RESPONSE);
    }
  );

  it("네트워크 오류도 강제 로그아웃하지 않는다", async () => {
    sessionTransport.defaults.adapter = async () => {
      throw new AxiosError("Network Error", "ERR_NETWORK");
    };
    await expect(refreshSession()).rejects.toHaveProperty("code", "ERR_NETWORK");
    expect(useAuthStore.getState().status).toBe("authenticated");
  });

  it("재발급 후에도 원요청이 401이면 추가 재시도 없이 종료한다", async () => {
    const transport = jest.fn(async (config: InternalAxiosRequestConfig) =>
      respond(config, MOCK_AUTH_REFRESH_RESPONSE)
    );
    sessionTransport.defaults.adapter = transport;
    const api = jest.fn((config: InternalAxiosRequestConfig) => rejectStatus(config, 401));
    authApi.defaults.adapter = api;
    await expect(authApi.get("/users/me")).rejects.toHaveProperty("response.status", 401);
    expect(api).toHaveBeenCalledTimes(2);
    expect(transport).toHaveBeenCalledTimes(2); // refresh + 쿠키 삭제
    expect(useAuthStore.getState().status).toBe("anonymous");
  });

  it("권한 오류 403과 잘못된 로그인은 재발급하지 않는다", async () => {
    const refresh = jest.fn();
    sessionTransport.defaults.adapter = refresh;
    authApi.defaults.adapter = (config) => rejectStatus(config, 403);
    await expect(authApi.get("/users/me")).rejects.toHaveProperty("response.status", 403);
    authApi.defaults.adapter = (config) => rejectStatus(config, 401);
    await expect(authApi.post("/auth/login")).rejects.toHaveProperty("response.status", 401);
    expect(refresh).not.toHaveBeenCalled();
  });

  it("로그아웃 전에 시작한 요청이 늦게 성공해도 이전 데이터를 반환하지 않는다", async () => {
    let release!: () => void;
    authApi.defaults.adapter = (config) =>
      new Promise((resolve) => {
        release = () => resolve(respond(config, MOCK_AUTH_USER));
      });
    const request = authApi.get("/users/me");
    await new Promise((resolve) => setTimeout(resolve, 0));
    resetClientSession();
    release();
    await request.catch((error) => expect(axios.isCancel(error)).toBe(true));
  });

  it("게스트의 인증 요청은 로그인 안내용 401을 반환하고 네트워크 재발급을 반복하지 않는다", async () => {
    const adapter = jest.fn();
    authApi.defaults.adapter = adapter;
    sessionTransport.defaults.adapter = adapter;
    resetClientSession();
    await expect(authApi.post("/posts/1/favorites")).rejects.toHaveProperty("response.status", 401);
    expect(adapter).not.toHaveBeenCalled();
  });
});
