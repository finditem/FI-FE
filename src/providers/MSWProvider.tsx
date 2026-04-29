"use client";

import { useEffect } from "react";

/**
 * 개발 환경에서 MSW(Mock Service Worker)를 초기화하는 Provider 컴포넌트입니다.
 *
 * @remarks
 * - `NEXT_PUBLIC_API_MOCKING=enabled` 환경 변수가 설정된 경우에만 워커를 활성화합니다.
 * - UI를 렌더링하지 않으며, 항상 null을 반환합니다.
 *
 * @author jikwon
 */

const MSWProvider = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;

    const start = async () => {
      const { worker } = await import("../mock/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });
    };

    start();
  }, []);

  return null;
};

export default MSWProvider;
