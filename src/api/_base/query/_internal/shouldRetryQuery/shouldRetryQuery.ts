import axios from "axios";

/**
 * 취소·인증·권한 오류를 제외한 일시 오류만 한 번 재시도합니다.
 * @param failureCount - TanStack Query가 전달한 재시도 전 실패 횟수입니다.
 * @param error - 현재 요청 오류입니다.
 *
 * @author suhyeon
 *
 * @example
 * useQuery({ queryKey, queryFn, retry: shouldRetryQuery });
 */
export const shouldRetryQuery = (failureCount: number, error: unknown): boolean => {
  if (axios.isCancel(error)) return false;
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status;
    if (statusCode === 401 || statusCode === 403) return false;
  }
  return failureCount < 1;
};
