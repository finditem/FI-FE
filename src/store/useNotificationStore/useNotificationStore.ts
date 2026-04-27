import { create } from "zustand";
import type { NotificationType } from "@/api/fetch/notification";

/**
 * 알림 탭·푸터 점 표시 등에 쓰는 미확인 알림 플래그 스토어입니다.
 *
 * @remarks
 * - `hasUnreadNotification`은 “한 건이라도 미읽음” 같은 상위 플래그이고, `unreadNotificationTypes`는 타입별 집합입니다.
 * - `addUnreadNotificationType`은 이미 있으면 상태를 바꾸지 않습니다.
 * - SSE 등에서는 `addUnreadNotificationType`, 목록 동기화 후에는 `setUnreadNotificationTypes`·`setHasUnreadNotification`을 함께 맞춥니다.
 * - 로그아웃 시 `resetUnreadNotificationState`로 둘 다 초기화합니다.
 *
 * @author hyungjun
 */

interface NotificationStore {
  /** 미확인 알림 존재 여부 */
  hasUnreadNotification: boolean;
  /** 미확인으로 취급 중인 알림 타입 목록(중복 없음) */
  unreadNotificationTypes: NotificationType[];
  /** 미확인 플래그 직접 설정 */
  setHasUnreadNotification: (hasUnreadNotification: boolean) => void;
  /** 미확인 타입 하나 추가(이미 있으면 무시) */
  addUnreadNotificationType: (type: NotificationType) => void;
  /** 서버·목록 기준으로 미확인 타입 집합 통째로 교체 */
  setUnreadNotificationTypes: (types: NotificationType[]) => void;
  /** 플래그·타입 집합 초기화 */
  resetUnreadNotificationState: () => void;
}

/**
 * @example
 * ```ts
 * const { addUnreadNotificationType, setUnreadNotificationTypes } = useNotificationStore();
 * addUnreadNotificationType("CHAT");
 * setUnreadNotificationTypes(["CHAT", "POST"]);
 * ```
 */

export const useNotificationStore = create<NotificationStore>((set) => ({
  hasUnreadNotification: false,
  unreadNotificationTypes: [],
  setHasUnreadNotification: (hasUnreadNotification) => set({ hasUnreadNotification }),
  addUnreadNotificationType: (type) =>
    set((state) => {
      if (state.unreadNotificationTypes.includes(type)) {
        return state;
      }
      return {
        unreadNotificationTypes: [...state.unreadNotificationTypes, type],
      };
    }),
  setUnreadNotificationTypes: (types) => set({ unreadNotificationTypes: types }),
  resetUnreadNotificationState: () =>
    set({
      hasUnreadNotification: false,
      unreadNotificationTypes: [],
    }),
}));
