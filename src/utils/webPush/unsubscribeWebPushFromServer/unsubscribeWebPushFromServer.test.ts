import authApi from "@/api/_base/axios/authApi";
import { unsubscribeWebPushFromServer } from "./unsubscribeWebPushFromServer";

jest.mock("@/api/_base/axios/authApi", () => ({
  __esModule: true,
  default: {
    delete: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../isWebPushSupported/isWebPushSupported", () => ({
  isWebPushSupported: jest.fn(() => true),
}));

import { isWebPushSupported } from "../isWebPushSupported/isWebPushSupported";

describe("unsubscribeWebPushFromServer", () => {
  const prevNavigator = global.navigator;
  const mockDelete = authApi.delete as jest.Mock;
  const unsubscribe = jest.fn().mockResolvedValue(undefined);

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: prevNavigator,
      configurable: true,
      writable: true,
    });
    jest.clearAllMocks();
    (isWebPushSupported as jest.Mock).mockReturnValue(true);
  });

  it("isWebPushSupported가 false이면 API를 호출하지 않는다", async () => {
    (isWebPushSupported as jest.Mock).mockReturnValue(false);
    await unsubscribeWebPushFromServer();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("구독이 없으면 delete를 호출하지 않는다", async () => {
    Object.defineProperty(global, "navigator", {
      value: {
        serviceWorker: {
          getRegistration: jest.fn().mockResolvedValue({
            pushManager: { getSubscription: jest.fn().mockResolvedValue(null) },
          }),
        },
      },
      configurable: true,
      writable: true,
    });
    await unsubscribeWebPushFromServer();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("구독이 있으면 delete 후 unsubscribe한다", async () => {
    const endpoint = "https://push.example/ep";
    Object.defineProperty(global, "navigator", {
      value: {
        serviceWorker: {
          getRegistration: jest.fn().mockResolvedValue({
            pushManager: {
              getSubscription: jest.fn().mockResolvedValue({
                endpoint,
                unsubscribe,
              }),
            },
          }),
        },
      },
      configurable: true,
      writable: true,
    });

    await unsubscribeWebPushFromServer();

    expect(mockDelete).toHaveBeenCalledWith(
      `/push/subscribe?endpoint=${encodeURIComponent(endpoint)}`
    );
    expect(unsubscribe).toHaveBeenCalled();
  });
});
