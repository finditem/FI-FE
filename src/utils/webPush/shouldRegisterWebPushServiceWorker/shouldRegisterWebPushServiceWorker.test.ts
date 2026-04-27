import { shouldRegisterWebPushServiceWorker } from "./shouldRegisterWebPushServiceWorker";

describe("shouldRegisterWebPushServiceWorker", () => {
  const original = process.env.NEXT_PUBLIC_API_MOCKING;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_MOCKING = original;
  });

  it("NEXT_PUBLIC_API_MOCKING이 enabled이면 false다", () => {
    process.env.NEXT_PUBLIC_API_MOCKING = "enabled";
    expect(shouldRegisterWebPushServiceWorker()).toBe(false);
  });

  it("모킹이 아니면 true다", () => {
    process.env.NEXT_PUBLIC_API_MOCKING = "disabled";
    expect(shouldRegisterWebPushServiceWorker()).toBe(true);
  });
});
