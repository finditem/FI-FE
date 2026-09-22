"use client";

import { lazy, Suspense, useSyncExternalStore } from "react";
import type { ComponentType, SVGProps } from "react";
import { iconImports, spriteIconNames } from "./index";
import type { IconName } from "./index";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const lazyIconCache = new Map<keyof typeof iconImports, SvgComponent>();

const emptySubscribe = () => () => {};

/**
 * 하이드레이션 완료 여부를 반환합니다. 서버와 클라이언트 첫 렌더(하이드레이션)에서는 `false`,
 * 하이드레이션 이후 클라이언트에서만 `true`가 됩니다. `useSyncExternalStore`의 서버 스냅샷이
 * 하이드레이션 렌더에도 사용되므로, 서버와 클라이언트 첫 렌더 결과가 항상 일치합니다.
 */
const useIsHydrated = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

function getLazyIcon(name: keyof typeof iconImports): SvgComponent {
  let cached = lazyIconCache.get(name);

  if (!cached) {
    const importer = iconImports[name];
    if (!importer) {
      throw new Error(
        `Icon "${name}"을 찾을 수 없습니다. icon-manifest.json 또는 iconImports에 등록되어 있는지 확인해주세요.`
      );
    }
    cached = lazy(importer);
    lazyIconCache.set(name, cached);
  }

  return cached;
}

export type { IconName };

/**
 * SVG 아이콘 컴포넌트입니다.
 *
 * @remarks
 * - `title`을 전달하면 `aria-label`이 설정됩니다.
 * - `title`을 전달하지 않으면 `aria-hidden="true"`가 자동으로 추가됩니다.
 *
 * @author jikwon
 * @author suhyeon (refactoring)
 */

export type Props = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  /** 사용할 아이콘 이름 (`iconImports` 객체의 key) */
  name: IconName;
  /** 아이콘 크기(px) (default: 24) */
  size?: number;
  /** 접근성을 위한 아이콘 설명. 전달 시 `aria-label`로 설정됩니다. */
  title?: string;
};

/**
 * @example
 * ```tsx
 * <Icon name="Logo" size={40} title="로고 아이콘" />
 * <Icon name="Logo" size={40} />
 * ```
 */

type AriaProps = {
  "aria-label": string | undefined;
  "aria-hidden": "true" | "false";
};

/**
 * 스프라이트에 없는 아이콘(`foreignObject`/`backdrop-filter` 등으로 제외된 아이콘)을 렌더합니다.
 *
 * @remarks
 * `React.lazy` 청크는 SSR 스트리밍에서 resolve된 SVG를 내보내지만 하이드레이션 시점엔 아직
 * 클라이언트 청크가 로드되지 않아 Suspense 경계가 다시 suspend되고, 이때 React가 클라이언트
 * 렌더로 전환하며 하이드레이션 에러가 발생한다. 이를 막기 위해 서버와 클라이언트 첫 렌더에서는
 * 동일한 fallback만 그리고, 하이드레이션 이후에만 실제 lazy SVG를 렌더한다.
 */
function LazyIcon({
  name,
  size,
  ariaProps,
  ...props
}: { name: keyof typeof iconImports; size: number; ariaProps: AriaProps } & SVGProps<SVGSVGElement>) {
  const isHydrated = useIsHydrated();

  const fallback = (
    <span
      className={props.className}
      style={{ display: "inline-block", width: size, height: size }}
    />
  );

  if (!isHydrated) return fallback;

  const Svg = getLazyIcon(name);

  return (
    <Suspense fallback={fallback}>
      <Svg width={size} height={size} {...ariaProps} {...props} />
    </Suspense>
  );
}

export default function Icon({ name, size = 24, title, ...props }: Props) {
  const ariaProps: AriaProps = {
    "aria-label": title,
    "aria-hidden": (title ? "false" : "true") as "true" | "false",
  };

  if (spriteIconNames.has(name as never)) {
    return (
      <svg width={size} height={size} {...ariaProps} {...props}>
        <use href={`/icons/sprite.svg#${name}`} />
      </svg>
    );
  }

  return (
    <LazyIcon name={name as keyof typeof iconImports} size={size} ariaProps={ariaProps} {...props} />
  );
}
