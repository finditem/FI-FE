import { isBrowserNotificationEffectivelyEnabled } from "./isBrowserNotificationEffectivelyEnabled";

describe("isBrowserNotificationEffectivelyEnabled", () => {
  it("API가 켜져 있고 브라우저 권한이 granted일 때만 true", () => {
    expect(isBrowserNotificationEffectivelyEnabled(true, "granted")).toBe(true);
    expect(isBrowserNotificationEffectivelyEnabled(true, "denied")).toBe(false);
    expect(isBrowserNotificationEffectivelyEnabled(true, "default")).toBe(false);
    expect(isBrowserNotificationEffectivelyEnabled(false, "granted")).toBe(false);
  });
});
