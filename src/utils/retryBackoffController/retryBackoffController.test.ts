import { retryBackoffController } from "./retryBackoffController";

describe("retryBackoffController", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("첫 schedule(resetAttempt 없음)은 baseDelay*2^1 ms 후에 retry를 한 번 실행한다", () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const fn = jest.fn();
    c.schedule(fn);

    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1999);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("immediate: true이면 0ms 뒤 바로 retry를 실행한다", () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const fn = jest.fn();
    c.schedule(fn, { immediate: true });
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resetAttempt: true이면 baseDelay*2^0 ms 지점으로 스케줄한다", () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const fn = jest.fn();
    c.schedule(fn, { resetAttempt: true });
    jest.advanceTimersByTime(999);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("이미 pending이 있을 때 non-immediate schedule은 무시한다", () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const a = jest.fn();
    const b = jest.fn();
    c.schedule(a);
    c.schedule(b);
    jest.runAllTimers();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
  });

  it("pending이 있어도 immediate: true이면 clear 후 즉시 스케줄을 바꾼다", () => {
    const c = retryBackoffController({ baseDelayMs: 10_000, maxDelayMs: 30_000, jitterRatio: 0 });
    const a = jest.fn();
    const b = jest.fn();
    c.schedule(a);
    c.schedule(b, { immediate: true });
    jest.advanceTimersByTime(0);
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("retryFn 실행 중에는 추가 schedule이 무시된다", async () => {
    const c = retryBackoffController({ baseDelayMs: 0, maxDelayMs: 10_000, jitterRatio: 0 });
    let done!: () => void;
    const slow = new Promise<void>((r) => {
      done = r;
    });
    const first = jest.fn(() => slow);
    const second = jest.fn();
    c.schedule(first, { immediate: true });
    jest.advanceTimersByTime(0);
    c.schedule(second, { immediate: true });
    expect(first).toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    done();
    await Promise.resolve();
    c.schedule(second, { immediate: true });
    jest.advanceTimersByTime(0);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("cancel 후 schedule은 no-op, reset 후 schedule은 다시 동작한다", () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const fn = jest.fn();
    c.cancel();
    c.schedule(fn);
    jest.runAllTimers();
    expect(fn).not.toHaveBeenCalled();

    c.reset();
    c.schedule(fn);
    jest.advanceTimersByTime(2000);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("첫 schedule 완료 후 다시 schedule하면 지연이 2^2에 비례한다(동일 max 범위)", async () => {
    const c = retryBackoffController({ baseDelayMs: 1000, maxDelayMs: 30_000, jitterRatio: 0 });
    const a = jest.fn();
    const b = jest.fn();
    c.schedule(a);
    jest.advanceTimersByTime(2000);
    expect(a).toHaveBeenCalled();
    await Promise.resolve();
    c.schedule(b);
    jest.advanceTimersByTime(3999);
    expect(b).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(b).toHaveBeenCalled();
  });
});
