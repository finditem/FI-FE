import { cn } from "@/utils";
import { ChipProps, ChipType } from "./ChipTypes";

/**
 * @author jikwon
 *
 * 상세페이지 카테고리를 나타내는 작은 원형 칩 컴포넌트입니다.
 * `type`에 따라 배경색과 라벨이 달라집니다.
 *
 * @param type - 칩의 종류를 지정합니다.
 * - `"brandSubtle"`: bg-fill-brand-subtle-default text-brand-normal-default을 나타냅니다.
 * - `"neutralStrong"`: bg-fill-neutral-strong-default text-neutral-strong-default을 나타냅니다.
 * - `"brandNormal"`: bg-fill-brand-normal-default text-white을 나타냅니다.
 * - `"admin"`: bg-fill-brand-subtle-default text-brand-normal-default text-caption2-semibold !py-1 !px-2을 나타냅니다.
 * - `"toast"`: bg-toast text-white을 나타냅니다.
 * - `"neutralDisabled"`: bg-fill-neutral-strong-disabled text-neutral-strong-default을 나타냅니다.
 *
 * @example
 * ```tsx
 * <Chip label="찾는중" type="brandSubtle" />
 * <Chip label="카테고리" type="neutralStrong" />
 * <Chip label="완료" type="brandNormal" />
 * <Chip label="관리자" type="admin" />
 * ```
 */
const TypeMap: Record<ChipType, string> = {
  brandSubtle: "bg-fill-brand-subtle-default text-brand-normal-default",
  neutralStrong: "bg-fill-neutral-strong-default text-neutral-strong-default",
  brandNormal: "bg-fill-brand-normal-default text-white",
  admin:
    "bg-fill-brand-subtle-default text-brand-normal-default text-caption2-semibold !py-1 !px-2",
  toast: "bg-toast text-white",
  neutralDisabled: "bg-fill-neutral-strong-disabled text-neutral-strong-default",
  brandSubtleDefault: "bg-fill-brand-subtle-default text-brand-strongUseThis-default",
};

const Chip = ({ label, type = "brandSubtle", className }: ChipProps) => {
  return (
    <span className={cn("rounded-full px-3 py-1 text-caption1-semibold", TypeMap[type], className)}>
      {label}
    </span>
  );
};

export default Chip;
