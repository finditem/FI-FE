import authApi from "@/api/_base/axios/authApi";
import publicApi from "@/api/_base/axios/publicApi";
import { syncWebPushSubscription } from "./syncWebPushSubscription";

jest.mock("@/api/_base/axios/publicApi", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock("@/api/_base/axios/authApi", () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

jest.mock("../isWebPushSupported/isWebPushSupported", () => ({
  isWebPushSupported: jest.fn(() => true),
}));

jest.mock("../registerWebPushServiceWorker/registerWebPushServiceWorker", () => ({
  registerWebPushServiceWorker: jest.fn(),
}));

import { isWebPushSupported } from "../isWebPushSupported/isWebPushSupported";
import { registerWebPushServiceWorker } from "../registerWebPushServiceWorker/registerWebPushServiceWorker";

describe("syncWebPushSubscription", () => {
  const mockGet = publicApi.get as jest.Mock;
  const mockPost = authApi.post as jest.Mock;
  const subscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (isWebPushSupported as jest.Mock).mockReturnValue(true);
    subscribe.mockResolvedValue({
      toJSON: () => ({
        endpoint: "https://ep",
        keys: { p256dh: "dh", auth: "au" },
      }),
    });
    (registerWebPushServiceWorker as jest.Mock).mockResolvedValue({
      pushManager: { subscribe },
    });
    mockGet.mockResolvedValue({
      data: { isSuccess: true, result: { publicKey: "YQ" } },
    });
    mockPost.mockResolvedValue({ data: { isSuccess: true } });
  });

  it("isWebPushSupported가 false이면 API를 호출하지 않는다", async () => {
    (isWebPushSupported as jest.Mock).mockReturnValue(false);
    await syncWebPushSubscription();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("등록이 없으면 VAPID 요청을 하지 않는다", async () => {
    (registerWebPushServiceWorker as jest.Mock).mockResolvedValue(null);
    await syncWebPushSubscription();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it("성공 시 subscribe와 post를 호출한다", async () => {
    await syncWebPushSubscription();
    expect(mockGet).toHaveBeenCalledWith("/push/vapid-key");
    expect(subscribe).toHaveBeenCalledWith(
      expect.objectContaining({
        userVisibleOnly: true,
        applicationServerKey: expect.any(Uint8Array),
      })
    );
    expect(mockPost).toHaveBeenCalledWith("/push/subscribe", {
      endpoint: "https://ep",
      keys: { p256dh: "dh", auth: "au" },
    });
  });

  it("VAPID 실패 시 예외다", async () => {
    mockGet.mockResolvedValue({ data: { isSuccess: false } });
    await expect(syncWebPushSubscription()).rejects.toThrow("Failed to load VAPID public key");
  });

  it("구독 JSON이 불완전하면 예외다", async () => {
    subscribe.mockResolvedValue({
      toJSON: () => ({ endpoint: "", keys: {} }),
    });
    await expect(syncWebPushSubscription()).rejects.toThrow("Invalid PushSubscription keys");
  });

  it("서버 등록 실패 시 예외다", async () => {
    mockPost.mockResolvedValue({ data: { isSuccess: false } });
    await expect(syncWebPushSubscription()).rejects.toThrow(
      "Failed to register push subscription on server"
    );
  });
});
