"use client";

import type { SVGProps } from "react";
import * as Icons from "./index";

export type IconName = keyof typeof Icons;

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
  /** 사용할 아이콘 이름 (`Icons` 객체의 key) */
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
  const Svg = Icons[name];

  return (
    <Svg
      width={size}
      height={size}
      aria-label={title}
      aria-hidden={title ? "false" : "true"}
      {...props}
    />
  );
}
