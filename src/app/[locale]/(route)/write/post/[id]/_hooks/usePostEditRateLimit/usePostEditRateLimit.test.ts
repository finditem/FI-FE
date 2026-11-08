import { act, renderHook } from "@testing-library/react";
import usePostEditRateLimit from "./usePostEditRateLimit";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, number>) =>
    key === "submitCountdown" ? `${values?.seconds}초 후 다시 시도` : key,
}));

describe("usePostEditRateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("restriction이 없고 캐시도 없으면 제한 상태가 아니다", () => {
    const { result } = renderHook(() => usePostEditRateLimit(1, undefined));

    expect(result.current.isRateLimited).toBe(false);
    expect(result.current.submitLabel).toBeUndefined();
  });

  it("isRestricted가 true인 restriction으로 시작하면 남은 시간이 계산되어야 한다", () => {
    const unlockAt = new Date(Date.now() + 5000).toISOString();

    const { result } = renderHook(() =>
      usePostEditRateLimit(1, { remainingCount: 0, isRestricted: true, unlockAt })
    );

    expect(result.current.isRateLimited).toBe(true);
    expect(result.current.remainingSeconds).toBe(5);
    expect(result.current.submitLabel).toBe("5초 후 다시 시도");
  });

  it("시간이 지나면 남은 초가 줄어들고, 0이 되면 제한이 풀려야 한다", () => {
    const unlockAt = new Date(Date.now() + 2000).toISOString();

    const { result } = renderHook(() =>
      usePostEditRateLimit(1, { remainingCount: 0, isRestricted: true, unlockAt })
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.remainingSeconds).toBe(1);
    expect(result.current.isRateLimited).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.isRateLimited).toBe(false);
    expect(result.current.submitLabel).toBeUndefined();
  });

  it("activateLimit을 호출하면 제한 상태로 전환된다", () => {
    const { result } = renderHook(() => usePostEditRateLimit(1, undefined));

    const unlockAt = new Date(Date.now() + 3000).toISOString();
    act(() => {
      result.current.activateLimit(unlockAt);
    });

    expect(result.current.isRateLimited).toBe(true);
    expect(result.current.remainingSeconds).toBe(3);
  });

  it("같은 postId로 재마운트하면 sessionStorage에 남아있는 제한 상태를 복원한다", () => {
    const unlockAt = new Date(Date.now() + 10000).toISOString();
    const { result, unmount } = renderHook(() => usePostEditRateLimit(1, undefined));

    act(() => {
      result.current.activateLimit(unlockAt);
    });
    unmount();

    const { result: reentered } = renderHook(() => usePostEditRateLimit(1, undefined));
    expect(reentered.current.isRateLimited).toBe(true);
    expect(reentered.current.remainingSeconds).toBe(10);
  });

  it("제한이 풀리면 sessionStorage 캐시도 정리되어 다른 postId에 영향을 주지 않는다", () => {
    const unlockAt = new Date(Date.now() + 1000).toISOString();
    const { result } = renderHook(() => usePostEditRateLimit(1, undefined));

    act(() => {
      result.current.activateLimit(unlockAt);
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.isRateLimited).toBe(false);

    const { result: samePost } = renderHook(() => usePostEditRateLimit(1, undefined));
    expect(samePost.current.isRateLimited).toBe(false);
  });
});
