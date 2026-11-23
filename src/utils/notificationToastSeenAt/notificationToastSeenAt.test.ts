import {
  clearNotificationToastSeenAt,
  getNotificationToastSeenAt,
  saveNotificationToastSeenAt,
} from "./notificationToastSeenAt";

describe("notificationToastSeenAt", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("저장된 값이 없으면 null을 반환한다", () => {
    expect(getNotificationToastSeenAt()).toBeNull();
  });

  it("알림 생성 시각을 ms로 저장하고 읽는다", () => {
    saveNotificationToastSeenAt("2026-01-15T10:00:00.000Z");

    expect(getNotificationToastSeenAt()).toBe(Date.parse("2026-01-15T10:00:00.000Z"));
  });

  it("저장된 값보다 이전 시각이나 잘못된 값은 무시한다", () => {
    saveNotificationToastSeenAt("2026-01-15T10:00:00.000Z");
    saveNotificationToastSeenAt("2026-01-14T10:00:00.000Z");
    saveNotificationToastSeenAt("invalid");

    expect(getNotificationToastSeenAt()).toBe(Date.parse("2026-01-15T10:00:00.000Z"));
  });

  it("clear 후에는 null을 반환한다", () => {
    saveNotificationToastSeenAt("2026-01-15T10:00:00.000Z");
    clearNotificationToastSeenAt();

    expect(getNotificationToastSeenAt()).toBeNull();
  });

  it("저장소에 접근할 수 없으면 오류 없이 null을 반환한다", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(getNotificationToastSeenAt()).toBeNull();
    jest.restoreAllMocks();
  });
});
