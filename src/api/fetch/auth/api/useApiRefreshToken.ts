import useAppMutation from "@/api/_base/query/useAppMutation";
import { refreshSession, type RefreshResponse } from "@/api/_base/auth/authSession";

/**
 * 베이스 mutation 훅을 통해 공통 재발급 작업의 상태를 제공합니다.
 * @remarks mutationFn을 공통 세션 작업으로 지정해 동시 요청의 Promise 공유를 유지합니다.
 * @returns 재발급 실행 함수와 진행·오류 상태를 반환합니다.
 * @example
 * const { mutateAsync: refreshToken } = useApiRefreshToken();
 * await refreshToken();
 * @author suhyeon
 */
export const useApiRefreshToken = () => {
  return useAppMutation<void, RefreshResponse>("auth", "/auth/refresh", "post", {
    mutationFn: refreshSession,
    retry: false,
  });
};
