/**
 * 구글 애널리틱스(GA4)로 커스텀 이벤트를 전송하는 최하위 베이스 함수입니다.
 *
 * * @remarks
 * 개발 환경(`development`)일 경우, GA4 대시보드의 DebugView에서 실시간으로
 * 이벤트를 모니터링할 수 있도록 `debug_mode: true` 파라미터가 자동으로 주입됩니다.
 *
 * @param action - GA4 대시보드에 표시될 이벤트 이름 (예: 'search', 'post_complete')
 * @param params - 이벤트와 함께 전송할 부가 정보 객체 (Key-Value 형태)
 *
 * @author suhyeon
 */

/**
 * * @example
 * ```typescript
 * trackingEvent('search', { search_term: '노트북' });
 * ```
 */

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, any>) => void;
  }
}

// GA4 스펙에 맞게 유연한 객체 타입을 받도록 확장
export const trackingEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    const isProd = process.env.NODE_ENV === "production";

    window.gtag("event", action, {
      ...params,
      debug_mode: !isProd,
    });
  }
};
