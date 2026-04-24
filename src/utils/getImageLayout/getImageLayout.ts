export type ImageItem = {
  src: string;
  /** 썸네일 가로·세로(px) */
  width: number;
  height: number;
  /** 그리드 `colSpan`(예: 2는 한 행 꽉 채움). 생략 가능 */
  colSpan?: number;
};

export type LayoutConfig = {
  /** 썸네일마다 `src`·`width`·`height` 등 (개수·크기는 이미지 개수 전략에 따름) */
  items: ImageItem[];
  /** 바깥 래퍼에 붙이는 Tailwind `className` */
  containerClass: string;
  /** 5장일 때 `flex` 2+3 특수 구조 여부 */
  isSpecialLayout?: boolean;
};

type LayoutStrategy = (images: string[]) => LayoutConfig;

// 각 이미지 개수별 레이아웃 전략
const LAYOUT_STRATEGIES: Record<number, LayoutStrategy> = {
  1: (images) => ({
    items: [{ src: images[0], width: 148, height: 148, colSpan: 2 }],
    containerClass: "grid gap-2 grid-cols-1",
  }),

  2: (images) => ({
    items: images.map((src) => ({
      src,
      width: 148,
      height: 148,
      colSpan: 1,
    })),
    containerClass: "grid gap-2 grid-cols-2",
  }),

  3: (images) => ({
    items: images.map((src) => ({
      src,
      width: 96,
      height: 96,
      colSpan: 1,
    })),
    containerClass: "grid gap-2 grid-cols-3",
  }),

  4: (images) => ({
    items: images.map((src) => ({
      src,
      width: 96,
      height: 96,
      colSpan: 1,
    })),
    containerClass: "grid gap-2 grid-cols-2",
  }),

  5: (images) => ({
    items: [
      { src: images[0], width: 148, height: 96 },
      { src: images[1], width: 148, height: 96 },
      { src: images[2], width: 96, height: 96 },
      { src: images[3], width: 96, height: 96 },
      { src: images[4], width: 96, height: 96 },
    ],
    isSpecialLayout: true,
    containerClass: "flex flex-col gap-2",
  }),
};

/**
 * 썸네일 URL 배열의 개수에 맞는 그리드(또는 5장 특수) 레이아웃 설정을 돌려줍니다.
 *
 * @remarks
 * - 1~5장만 전략이 있고, 0장·6장 이상이면 `items: []`·`containerClass: ""` 입니다. (5장은 `isSpecialLayout: true`와 `getSpecialLayoutGroups` 조합)
 * - 기본 인자 `[]`로 빈 배열과 동일하게 처리됩니다.
 *
 * @param images - 이미지 `src` URL 배열
 *
 * @returns `LayoutConfig` — `items`·`containerClass`, 필요 시 `isSpecialLayout`
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * getImageLayout([url]);
 * getImageLayout(); // === getImageLayout([])
 * ```
 */

export const getImageLayout = (images: string[] = []): LayoutConfig => {
  const count = images.length;

  if (count === 0) {
    return { items: [], containerClass: "" };
  }

  const strategy = LAYOUT_STRATEGIES[count];

  return strategy ? strategy(images) : { items: [], containerClass: "" };
};

/**
 * 5장 특수 레이아웃을 위해 `ImageItem` 배열을 위 2·아래 3(나머지)으로 자릅니다.
 *
 * @remarks
 * - `getImageLayout`이 5장일 때 쌓이는 `items` 순서와 맞출 것을 가정합니다.
 *
 * @param items - 5장 레이아웃에서 온 `ImageItem` 배열(길이는 보통 5)
 *
 * @returns `topRow` — 앞 2개, `bottomRow` — `slice(2)` 이후
 *
 * @author hyungjun
 */
/**
 * @example
 * ```ts
 * const { topRow, bottomRow } = getSpecialLayoutGroups(layout.items);
 * ```
 */

export const getSpecialLayoutGroups = (items: ImageItem[]) => {
  return {
    topRow: items.slice(0, 2),
    bottomRow: items.slice(2),
  };
};
