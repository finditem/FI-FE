import { notFound } from "next/navigation";

/**
 * 어떤 라우트에도 맞지 않는 주소를 받아 `[locale]/not-found.tsx`를 렌더링합니다.
 *
 * @remarks
 * - 루트 레이아웃이 `[locale]` 아래에 있어 매칭되지 않는 주소는 Next 기본 404로 떨어집니다. 이 캐치올이 `notFound()`를 불러 로케일 레이아웃 안의 404 화면으로 보냅니다.
 * - 정적·동적 라우트가 캐치올보다 우선하므로 기존 라우트 매칭에는 영향이 없습니다.
 *
 * @example
 * ```
 * /this-page-does-not-exist    → 한국어 404
 * /en/this-page-does-not-exist → 영어 404
 * ```
 */
const CatchAllPage = () => {
  notFound();
};

export default CatchAllPage;
