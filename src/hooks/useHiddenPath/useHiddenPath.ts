import { usePathname } from "next/navigation";

/**
 * 현재 경로가 지정된 노출 경로에 해당하지 않으면 true를 반환하는 커스텀 훅입니다.
 *
 * @remarks
 * - 노출 허용 경로: `/`, `/list`, `/chat`, `/alert`, `/mypage`, `/admin`
 * - 허용 경로에서는 `false`(숨기지 않음), 그 외 경로에서는 `true`(숨김)를 반환합니다.
 * - 현재 Footer 노출 여부를 제어하는 데 사용됩니다.
 *
 * @returns 현재 경로가 허용 경로가 아니면 `true`
 *
 * @author jikwon
 * @author hyungjun
 */

/**
 * @example
 * ```tsx
 * const isHidden = useHiddenPath();
 *
 * if (isHidden) return null;
 * return <Footer />;
 * ```
 */

const visibleExactPaths = ["/", "/list", "/chat", "/alert", "/mypage", "/admin"];

export const useHiddenPath = () => {
  const pathname = usePathname() ?? "";

  if (visibleExactPaths.includes(pathname)) return false;

  return true;
};
