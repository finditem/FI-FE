import { isWebPushSupported } from "./isWebPushSupported";

describe("isWebPushSupported", () => {
  afterEach(() => {
    Object.defineProperty(Window.prototype, "isSecureContext", {
      configurable: true,
      get: () => true,
    });
  });

  it("비보안 컨텍스트면 false다", () => {
    Object.defineProperty(Window.prototype, "isSecureContext", {
      configurable: true,
      get: () => false,
    });
    expect(isWebPushSupported()).toBe(false);
  });

  it("PushManager가 없으면 false다", () => {
    const w = window as Window & { PushManager?: unknown };
    const prev = w.PushManager;
    delete w.PushManager;
    expect(isWebPushSupported()).toBe(false);
    w.PushManager = prev;
  });

  it("조건을 모두 만족하면 true다", () => {
    const w = window as Window & { PushManager?: object };
    if (!("serviceWorker" in navigator)) {
      Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: {} });
    }
    w.PushManager = w.PushManager ?? {};
    expect(isWebPushSupported()).toBe(true);
  });
});
