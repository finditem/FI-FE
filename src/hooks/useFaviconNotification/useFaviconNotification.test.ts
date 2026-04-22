import { renderHook } from "@testing-library/react";

import { useFaviconNotification } from "./useFaviconNotification";

describe("useFaviconNotification", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  describe("파비콘 경로", () => {
    it("알림이 있으면 notification 파비콘 경로를 사용한다", () => {
      renderHook(() => useFaviconNotification(true));

      const links = document.querySelectorAll("link[data-dynamic-favicon]");
      links.forEach((link) => {
        expect((link as HTMLLinkElement).href).toContain("/favicon/notification");
      });
    });

    it("알림이 없으면 default 파비콘 경로를 사용한다", () => {
      renderHook(() => useFaviconNotification(false));

      const links = document.querySelectorAll("link[data-dynamic-favicon]");
      links.forEach((link) => {
        expect((link as HTMLLinkElement).href).toContain("/favicon/default");
      });
    });
  });

  describe("파비콘 링크 요소 생성", () => {
    it("16x16, 32x32, 48x48 세 가지 크기의 링크를 생성한다", () => {
      renderHook(() => useFaviconNotification(false));

      expect(document.querySelector('link[data-dynamic-favicon="16x16"]')).not.toBeNull();
      expect(document.querySelector('link[data-dynamic-favicon="32x32"]')).not.toBeNull();
      expect(document.querySelector('link[data-dynamic-favicon="48x48"]')).not.toBeNull();
    });

    it("이미 존재하는 링크 요소가 있으면 새로 추가하지 않고 재사용한다", () => {
      const { rerender } = renderHook(({ has }: { has: boolean }) => useFaviconNotification(has), {
        initialProps: { has: false },
      });

      const countBefore = document.querySelectorAll("link[data-dynamic-favicon]").length;

      rerender({ has: true });

      const countAfter = document.querySelectorAll("link[data-dynamic-favicon]").length;
      expect(countAfter).toBe(countBefore);
    });
  });

  describe("알림 상태 변경", () => {
    it("상태가 변경되면 파비콘 경로도 변경된다", () => {
      const { rerender } = renderHook(({ has }: { has: boolean }) => useFaviconNotification(has), {
        initialProps: { has: false },
      });

      document.querySelectorAll("link[data-dynamic-favicon]").forEach((link) => {
        expect((link as HTMLLinkElement).href).toContain("/favicon/default");
      });

      rerender({ has: true });

      document.querySelectorAll("link[data-dynamic-favicon]").forEach((link) => {
        expect((link as HTMLLinkElement).href).toContain("/favicon/notification");
      });
    });
  });
});
