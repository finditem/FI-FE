import "server-only";
import { cookies } from "next/headers";

/**
 * 리프레쉬 토큰의 유무를 확인할 수 있는 불리언 값을 리턴하는 유틸 함수입니다.
 *
 * @remarks
 * ssr환경에서만 사용 가능합니다.
 * 사용하실 컴포넌트에는 async를 꼭 사용해주셔야 합니다.
 *
 * @author suhyeon
 */

/**
 * @example
 * ```tsx
 * const hasToken = await hasValidToken();
 * ```
 */

export const hasValidToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.has("refresh_token");
};
