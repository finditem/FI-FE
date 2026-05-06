import { renderHook } from "@testing-library/react";
import useSessionNotification from "./useSessionNotification";

const mockAddToast = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock("@/context/ToastContext", () => ({
  useToast: () => ({ addToast: mockAddToast }),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

describe("useSessionNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("reason 반환", () => {
    it("reason이 null이면 null을 반환한다", () => {
      mockUseSearchParams.mockReturnValue({ get: () => null });
      const { result } = renderHook(() => useSessionNotification());
      expect(result.current.reason).toBeNull();
    });

    it("reason이 'session-expired'이면 'session-expired'를 반환한다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "reason" ? "session-expired" : null),
      });
      const { result } = renderHook(() => useSessionNotification());
      expect(result.current.reason).toBe("session-expired");
    });

    it("reason이 다른 값이면 그 값을 그대로 반환한다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "reason" ? "other" : null),
      });
      const { result } = renderHook(() => useSessionNotification());
      expect(result.current.reason).toBe("other");
    });
  });

  describe("세션 만료 토스트", () => {
    it("reason이 'session-expired'이면 경고 토스트가 1회 호출된다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "reason" ? "session-expired" : null),
      });
      renderHook(() => useSessionNotification());
      expect(mockAddToast).toHaveBeenCalledTimes(1);
    });

    it("토스트 메시지는 '세션이 만료되었어요. 다시 로그인 해주세요.'이고 타입은 'warning'이다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "reason" ? "session-expired" : null),
      });
      renderHook(() => useSessionNotification());
      expect(mockAddToast).toHaveBeenCalledWith(
        "세션이 만료되었어요. 다시 로그인 해주세요.",
        "warning"
      );
    });

    it("reason이 null이면 addToast가 호출되지 않는다", () => {
      mockUseSearchParams.mockReturnValue({ get: () => null });
      renderHook(() => useSessionNotification());
      expect(mockAddToast).not.toHaveBeenCalled();
    });
  });

  describe("isShown.current 중복 방지", () => {
    it("rerender해도 addToast가 두 번 이상 호출되지 않는다", () => {
      mockUseSearchParams.mockReturnValue({
        get: (key: string) => (key === "reason" ? "session-expired" : null),
      });
      const { rerender } = renderHook(() => useSessionNotification());
      rerender();
      rerender();
      expect(mockAddToast).toHaveBeenCalledTimes(1);
    });
  });
});
