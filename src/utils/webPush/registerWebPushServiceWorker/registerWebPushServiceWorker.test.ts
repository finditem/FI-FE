import { registerWebPushServiceWorker } from "./registerWebPushServiceWorker";

jest.mock("../shouldRegisterWebPushServiceWorker/shouldRegisterWebPushServiceWorker", () => ({
  shouldRegisterWebPushServiceWorker: jest.fn(() => true),
}));

import { shouldRegisterWebPushServiceWorker } from "../shouldRegisterWebPushServiceWorker/shouldRegisterWebPushServiceWorker";

describe("registerWebPushServiceWorker", () => {
  const prevNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: prevNavigator,
      configurable: true,
      writable: true,
    });
    jest.restoreAllMocks();
    (shouldRegisterWebPushServiceWorker as jest.Mock).mockReturnValue(true);
  });

  it("navigator에 serviceWorker가 없으면 null이다", async () => {
    Object.defineProperty(global, "navigator", {
      value: {},
      configurable: true,
      writable: true,
    });
    await expect(registerWebPushServiceWorker()).resolves.toBeNull();
  });

  it("shouldRegister가 false이면 null이고 register는 호출되지 않는다", async () => {
    (shouldRegisterWebPushServiceWorker as jest.Mock).mockReturnValue(false);
    const register = jest.fn();
    Object.defineProperty(global, "navigator", {
      value: { serviceWorker: { register } },
      configurable: true,
      writable: true,
    });
    await expect(registerWebPushServiceWorker()).resolves.toBeNull();
    expect(register).not.toHaveBeenCalled();
  });

  it("등록에 성공하면 Registration을 반환한다", async () => {
    const reg = { scope: "/" } as ServiceWorkerRegistration;
    const register = jest.fn().mockResolvedValue(reg);
    Object.defineProperty(global, "navigator", {
      value: { serviceWorker: { register } },
      configurable: true,
      writable: true,
    });
    await expect(registerWebPushServiceWorker()).resolves.toBe(reg);
    expect(register).toHaveBeenCalledWith("/sw.js", { scope: "/" });
  });

  it("등록이 reject되면 null이다", async () => {
    const register = jest.fn().mockRejectedValue(new Error("fail"));
    Object.defineProperty(global, "navigator", {
      value: { serviceWorker: { register } },
      configurable: true,
      writable: true,
    });
    await expect(registerWebPushServiceWorker()).resolves.toBeNull();
  });
});
