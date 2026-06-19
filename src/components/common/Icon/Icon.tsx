"use client";

import { lazy, Suspense } from "react";
import type { ComponentType, SVGProps } from "react";
import { iconImports } from "./index";
import type { IconName } from "./index";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconCache = new Map<IconName, ComponentType<SVGProps<SVGSVGElement>>>();

function getLazyIcon(name: IconName): SvgComponent {
  let LazyIcon = iconCache.get(name);

  if (!LazyIcon) {
    LazyIcon = lazy(iconImports[name]);
    iconCache.set(name, LazyIcon);
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
  const Svg = getLazyIcon(name);

  return (
    <Suspense fallback={<span style={{ display: "inline-block", width: size, height: size }} />}>
      <Svg
        width={size}
        height={size}
        aria-label={title}
        aria-hidden={title ? "false" : "true"}
        {...props}
      />
    </Suspense>
  );
}
