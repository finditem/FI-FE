import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PostEditRestriction } from "@/api/fetch/post/types/PostDetailType";

const STORAGE_KEY_PREFIX = "post-edit-limit:";

const getRemainingSeconds = (unlockAt: string) => {
  const diff = new Date(unlockAt).getTime() - Date.now();
  return diff > 0 ? Math.ceil(diff / 1000) : 0;
};

const readStoredUnlockAt = (postId: number) => {
  if (typeof window === "undefined") return null;
  const stored = window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}${postId}`);
  return stored && getRemainingSeconds(stored) > 0 ? stored : null;
};

const writeStoredUnlockAt = (postId: number, unlockAt: string | null) => {
  if (typeof window === "undefined") return;
  const key = `${STORAGE_KEY_PREFIX}${postId}`;
  if (unlockAt) {
    window.sessionStorage.setItem(key, unlockAt);
  } else {
    window.sessionStorage.removeItem(key);
  }
};

/**
 * 게시글 수정 제한 정책(1분 내 5회, 초과 시 3분 잠금)의 카운트다운 상태를 관리한다.
 *
 * @remarks
 * 실제 판단(횟수 집계·잠금 여부)은 서버가 한다 — PUT /posts/{postId}가 제한에 걸리면
 * `POST429-UPDATE_RATE_LIMITED` 코드와 `retryAfterSeconds`를 내려주고, 이 훅은 그 값을
 * 절대 시각(`unlockAt`)으로 바꿔 카운트다운만 계산한다. 현재 백엔드는 게시글 상세 조회
 * 시점에 잠금 상태를 함께 내려주지 않으므로(제출 시점에만 확인 가능), 같은 브라우저 탭
 * 안에서 페이지를 이탈했다가 재진입해도 카운트다운이 유지되도록 sessionStorage에도
 * 캐시해 둔다. 다른 기기/탭에서는 이 캐시가 없어도 제출 시 서버가 다시 429로 막아준다.
 */
const usePostEditRateLimit = (postId: number, restriction?: PostEditRestriction) => {
  const t = useTranslations("usePostEditRateLimit");
  const serverUnlockAt = restriction?.isRestricted ? restriction.unlockAt : null;

  const [unlockAt, setUnlockAt] = useState<string | null>(
    () => serverUnlockAt ?? readStoredUnlockAt(postId)
  );
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    unlockAt ? getRemainingSeconds(unlockAt) : 0
  );

  useEffect(() => {
    if (!serverUnlockAt) return;
    setUnlockAt(serverUnlockAt);
    setRemainingSeconds(getRemainingSeconds(serverUnlockAt));
  }, [serverUnlockAt]);

  useEffect(() => {
    writeStoredUnlockAt(postId, unlockAt);
  }, [postId, unlockAt]);

  useEffect(() => {
    if (!unlockAt) return;

    const interval = setInterval(() => {
      const seconds = getRemainingSeconds(unlockAt);
      setRemainingSeconds(seconds);
      if (seconds <= 0) setUnlockAt(null);
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockAt]);

  const activateLimit = (nextUnlockAt: string) => {
    setUnlockAt(nextUnlockAt);
    setRemainingSeconds(getRemainingSeconds(nextUnlockAt));
  };

  const isRateLimited = !!unlockAt;

  return {
    isRateLimited,
    remainingSeconds,
    submitLabel: isRateLimited ? t("submitCountdown", { seconds: remainingSeconds }) : undefined,
    activateLimit,
  };
};

export default usePostEditRateLimit;
