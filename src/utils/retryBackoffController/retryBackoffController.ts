type RetryFn = () => Promise<void> | void;

/**
 * `schedule` 호출 시 동작을 제어하는 옵션입니다.
 */
export interface RetryScheduleOptions {
  /**
   * `true`이면 지연 없이 `retryFn`을 대기시킵니다.(타이머 `0ms`과 동시에 `clearPending` 후 다시 잡힘)
   * `false`이면(기본) 백오프로 계산한 지연 후 실행합니다.
   */
  immediate?: boolean;
  /**
   * `true`이면 `attempt`를 0으로 맞춘 뒤, 이번 스케줄의 백오프 `attempt`를 0으로 둡니다(첫 백오프 `baseDelayMs`×2^0).
   */
  resetAttempt?: boolean;
}

/**
 * `retryBackoffController` 생성 시 백오프(지연) 계산에 쓰는 옵션입니다.
 */
export interface RetryBackoffControllerOptions {
  /**
   * 첫(낮은 `attempt`일수록 작은) 곡선에 쓰는 기준 지연(ms)입니다.
   */
  baseDelayMs: number;
  /**
   * 지연 시간 상한(ms)입니다. `min(baseDelayMs * 2^attempt, maxDelayMs)` 쪽에서 잘라냅니다.
   */
  maxDelayMs: number;
  /**
   * 지연이 `capped`일 때, 음/양 `capped * jitterRatio` 범위에 `(Math.random() * 2 - 1)`을 곱한 지터를 더합니다(기본 `0`이면 랜덤 없음).
   */
  jitterRatio?: number;
}

const calcDelayMs = ({
  baseDelayMs,
  maxDelayMs,
  attempt,
  jitterRatio = 0,
}: {
  baseDelayMs: number;
  maxDelayMs: number;
  attempt: number;
  jitterRatio?: number;
}) => {
  const exponential = baseDelayMs * 2 ** attempt;
  const capped = Math.min(exponential, maxDelayMs);
  const jitter = capped * jitterRatio * (Math.random() * 2 - 1);

  return Math.max(0, Math.floor(capped + jitter));
};

/**
 * Exponential backoff 기반 단일 재시도 스케줄러를 만듭니다(WS·SSE 등 “연결 복구”에 공통 사용).
 *
 * @remarks
 * - 한 번에 `setTimeout` 하나만 두고, 새 `schedule`이 오면(일반 옵션) 이전 pending을 지웁니다. (폭주 방지)
 * - pending이 있고 `immediate: false`인데 또 `schedule`이 오면 무시합니다.(곱백·중복 스케줄 억제)
 * - `immediate: true`이면 pending이 있어도 지우고 즉시(0ms) 다시 잡을 수 있습니다.
 * - `retryFn` 실행 구간에는 `isExecuting`이 `true`라, 그동안 `schedule`은 무시됩니다.
 * - `cancel` 후에는 `schedule`이 아무 것도 하지 않습니다(스케줄러 다시 쓰려면 `reset`).
 * - 첫 `resetAttempt` 없는 `schedule`은 내부 `attempt`를 1로 올린 뒤 `baseDelay * 2^1` 쪽(상한 `max` 적용)으로 잡힙니다.(일반 `schedule` = “다음” 시도 번호·지연) `resetAttempt: true`이면 `attempt` 0으로 이번 지연은 `2^0` 기준.
 *
 * @param options - `baseDelayMs` / `maxDelayMs` / (선택) `jitterRatio`
 *
 * @returns
 * - `schedule(retryFn, options?)` — 백오프(또는 `immediate` 시 바로)로 `retryFn` 실행
 * - `reset()` — pending 취소, `attempt` 0, `cancel` 아님으로 되돌림
 * - `cancel()` — pending 취소, 이후 `schedule` 무효까지
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * const c = retryBackoffController({ baseDelayMs: 1_000, maxDelayMs: 30_000, jitterRatio: 0.2 });
 *
 * c.schedule(async () => { void 0; }, { immediate: true, resetAttempt: true });
 * ```
 */

export const retryBackoffController = ({
  baseDelayMs,
  maxDelayMs,
  jitterRatio = 0,
}: RetryBackoffControllerOptions) => {
  let attempt = 0;
  let pendingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let isExecuting = false;
  let isCancelled = false;

  const clearPending = () => {
    if (!pendingTimeoutId) return;
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  };

  const reset = () => {
    clearPending();
    attempt = 0;
    isCancelled = false;
  };

  const cancel = () => {
    clearPending();
    isCancelled = true;
  };

  const schedule = (retryFn: RetryFn, options: RetryScheduleOptions = {}) => {
    if (isCancelled) return;
    if (isExecuting) return;

    const { immediate = false, resetAttempt = false } = options;

    if (resetAttempt) {
      attempt = 0;
    }

    if (pendingTimeoutId && !immediate) return;
    clearPending();

    const nextAttempt = resetAttempt ? 0 : attempt + 1;
    attempt = nextAttempt;

    const delayMs = immediate
      ? 0
      : calcDelayMs({ baseDelayMs, maxDelayMs, attempt: nextAttempt, jitterRatio });

    pendingTimeoutId = setTimeout(() => {
      pendingTimeoutId = null;
      isExecuting = true;
      void Promise.resolve(retryFn()).finally(() => {
        isExecuting = false;
      });
    }, delayMs);
  };

  return { schedule, reset, cancel };
};
