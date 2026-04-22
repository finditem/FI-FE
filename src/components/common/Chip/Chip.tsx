import { cn } from "@/utils";
import { ChipProps, ChipType } from "./ChipTypes";

/**
 * 상세페이지 카테고리를 나타내는 작은 원형 칩 컴포넌트입니다.
 *
 * @remarks
 * - `type`에 따라 배경색과 텍스트 색상이 달라집니다.
 * - `"brandSubtle"`: 브랜드 서브 배경 / 브랜드 텍스트
 * - `"neutralStrong"`: 중립 강조 배경 / 중립 텍스트
 * - `"brandNormal"`: 브랜드 배경 / 흰색 텍스트
 * - `"admin"`: 관리자용, 작은 패딩 적용
 * - `"toast"`: 토스트 배경 / 흰색 텍스트
 * - `"neutralDisabled"`: 비활성 배경 / 중립 텍스트
 *
 * @author jikwon
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

/**
 * @example
 * ```tsx
 * <Chip label="찾는중" type="brandSubtle" />
 * <Chip label="완료" type="brandNormal" />
 * <Chip label="관리자" type="admin" />
 * ```
 */

const Chip = ({ label, type = "brandSubtle", className }: ChipProps) => {
  return (
    <span className={cn("rounded-full px-3 py-1 text-caption1-semibold", TypeMap[type], className)}>
      {label}
    </span>
  );
};

export default Chip;
