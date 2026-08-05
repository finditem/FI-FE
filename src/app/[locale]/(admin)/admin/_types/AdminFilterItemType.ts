import { IconName } from "@/components";

export interface AdminFilterItemType {
  label: string;
  onSelected: boolean;
  icon?: {
    name: IconName;
    size: number;
  };
  iconPosition?: "leading" | "trailing";
  onClick: () => void;
}
