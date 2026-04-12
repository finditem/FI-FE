export type ChipType =
  | "brandSubtle"
  | "neutralStrong"
  | "brandNormal"
  | "admin"
  | "toast"
  | "neutralDisabled"
  | "brandSubtleDefault";

export interface ChipProps {
  label: string;
  type?: ChipType;
  className?: string;
}
