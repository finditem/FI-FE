import { useNotificationStore } from "./useNotificationStore";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.getState().resetUnreadNotificationState();
  });

  it("초기에는 미확인 플래그가 false이고 타입 목록이 비어 있습니다", () => {
    expect(useNotificationStore.getState().hasUnreadNotification).toBe(false);
    expect(useNotificationStore.getState().unreadNotificationTypes).toEqual([]);
  });

  it("addUnreadNotificationType은 중복 타입을 넣지 않습니다", () => {
    useNotificationStore.getState().addUnreadNotificationType("CHAT");
    useNotificationStore.getState().addUnreadNotificationType("CHAT");
    expect(useNotificationStore.getState().unreadNotificationTypes).toEqual(["CHAT"]);
  });

  it("서로 다른 타입을 여러 번 추가하면 집합에 누적됩니다", () => {
    useNotificationStore.getState().addUnreadNotificationType("CHAT");
    useNotificationStore.getState().addUnreadNotificationType("COMMENT");
    expect(useNotificationStore.getState().unreadNotificationTypes).toEqual(["CHAT", "COMMENT"]);
  });

  it("setUnreadNotificationTypes는 목록을 통째로 교체합니다", () => {
    useNotificationStore.getState().addUnreadNotificationType("CHAT");
    useNotificationStore.getState().setUnreadNotificationTypes(["NOTICE", "SYSTEM"]);
    expect(useNotificationStore.getState().unreadNotificationTypes).toEqual(["NOTICE", "SYSTEM"]);
  });

  it("setHasUnreadNotification으로 플래그를 바꿀 수 있습니다", () => {
    useNotificationStore.getState().setHasUnreadNotification(true);
    expect(useNotificationStore.getState().hasUnreadNotification).toBe(true);
    useNotificationStore.getState().setHasUnreadNotification(false);
    expect(useNotificationStore.getState().hasUnreadNotification).toBe(false);
  });

  it("resetUnreadNotificationState는 플래그와 타입을 모두 초기화합니다", () => {
    useNotificationStore.getState().setHasUnreadNotification(true);
    useNotificationStore.getState().addUnreadNotificationType("CHAT");
    useNotificationStore.getState().resetUnreadNotificationState();
    expect(useNotificationStore.getState().hasUnreadNotification).toBe(false);
    expect(useNotificationStore.getState().unreadNotificationTypes).toEqual([]);
  });
});
