import { WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS } from "@/constants/WEB_PUSH";
import { unsubscribeWebPushFromServer } from "@/utils";

/**
 * 웹 푸시 해지를 제한 시간만 기다리고 로그아웃을 계속할 수 있게 합니다.
 * @remarks 해지 실패는 로그아웃을 막지 않으며, 완료 후 타이머를 해제합니다.
 * @example
 * await unsubscribeWebPushBeforeLogout();
 * @author suhyeon
 */
export async function unsubscribeWebPushBeforeLogout(): Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<void>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("web-push-unsubscribe-timeout")),
        WEB_PUSH_UNSUBSCRIBE_BEFORE_LOGOUT_TIMEOUT_MS
      );
    });
    await Promise.race([unsubscribeWebPushFromServer(), timeout]);
  } catch {
    // 웹 푸시 장애가 인증 세션 종료를 막지 않도록 계속 진행합니다.
  } finally {
    clearTimeout(timeoutId);
  }
}
