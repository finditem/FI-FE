import { useEffect } from "react";

const iconSizes = ["16x16", "32x32", "48x48"];

/**
 * 알림 상태에 따라 파비콘을 동적으로 교체하는 커스텀 훅입니다.
 *
 * @remarks
 * - 16x16, 32x32, 48x48 세 가지 크기의 파비콘을 교체합니다.
 * - `data-dynamic-favicon` 속성으로 동적 파비콘 요소를 식별합니다.
 * - 알림 있음: `/favicon/notification`, 없음: `/favicon/default` 경로 사용
 *
 * @param hasNotification - 읽지 않은 알림 존재 여부
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * const { hasUnread } = useNotifications();
 *
 * useFaviconNotification(hasUnread);
 * ```
 */

export const useFaviconNotification = (hasNotification: boolean) => {
  useEffect(() => {
    const basePath = hasNotification ? "/favicon/notification" : "/favicon/default";

    iconSizes.forEach((size) => {
      const existingDynamicLink = document.querySelector(`link[data-dynamic-favicon="${size}"]`);
      const link = (existingDynamicLink || document.createElement("link")) as HTMLLinkElement;

      link.rel = "icon";
      link.type = "image/png";
      link.sizes = size;
      link.setAttribute("data-dynamic-favicon", size);

      link.href = `${basePath}/favicon-${size.split("x")[0]}.png`;

      if (!existingDynamicLink) {
        document.head.appendChild(link);
      }
    });
  }, [hasNotification]);
};

export default useFaviconNotification;
