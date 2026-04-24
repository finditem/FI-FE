import { usePathname } from "next/navigation";

/**
 * 현재 URL 경로가 Footer 노출 허용 경로와 정확히 일치하지 않으면 `true`를 반환하는 훅입니다.
 *
 * 하위 경로(예: `/list/123`)는 허용 목록에 없으므로 `true`(숨김)입니다.
 *
 * @returns 허용 경로면 `false`(Footer 노출), 그 외면 `true`(Footer 숨김)
 *
 * @remarks
 * - 허용 경로(정확 일치): `/`, `/list`, `/chat`, `/alert`, `/mypage`, `/admin`
 * - `usePathname()`이 `null`/`undefined`이면 `""`로 취급되어 허용 목록에 없다면 `true`입니다.
 * - Footer 노출 여부 제어에 사용합니다.
 *
 * @author jikwon
 * @author hyungjun
 *
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
