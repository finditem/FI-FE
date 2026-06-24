"use client";

import { lazy, Suspense } from "react";
import type { ComponentType, SVGProps } from "react";
import { iconImports, spriteIconNames } from "./index";
import type { IconName } from "./index";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const lazyIconCache = new Map<keyof typeof iconImports, SvgComponent>();

function getLazyIcon(name: keyof typeof iconImports): SvgComponent {
  let LazyIcon = lazyIconCache.get(name);

  if (!LazyIcon) {
    LazyIcon = lazy(iconImports[name]);
    lazyIconCache.set(name, LazyIcon);
  }

  return LazyIcon;
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

export default function Icon({ name, size = 24, title, ...props }: Props) {
  const ariaProps = {
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

  const Svg = getLazyIcon(name as keyof typeof iconImports);

  return (
    <Suspense fallback={<span style={{ display: "inline-block", width: size, height: size }} />}>
      <Svg width={size} height={size} {...ariaProps} {...props} />
    </Suspense>
  );
}
