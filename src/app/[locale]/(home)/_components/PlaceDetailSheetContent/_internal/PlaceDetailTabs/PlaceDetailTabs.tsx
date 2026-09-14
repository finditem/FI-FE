"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components";
import { cn } from "@/utils";
import type { PlaceDetailTab } from "../../../../_types/PlaceDetailTab";

interface PlaceDetailTabsProps {
  value: PlaceDetailTab;
  onChange: (tab: PlaceDetailTab) => void;
}

const TABS: { value: PlaceDetailTab; icon: "PlaceMarker" | "MapMyLocation" }[] = [
  { value: "place", icon: "PlaceMarker" },
  { value: "post", icon: "MapMyLocation" },
];

/** 장소 상세 시트 상단의 동네 정보 / 근처 분실물 탭 전환 */
const PlaceDetailTabs = ({ value, onChange }: PlaceDetailTabsProps) => {
  const t = useTranslations("PlaceDetailSheet");

  return (
    <div role="tablist" className="flex gap-1 rounded-[10px] bg-layout_2depth p-1">
      {TABS.map((tab) => {
        const isSelected = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex h-[46px] flex-1 items-center justify-center gap-2 rounded-[10px]",
              "text-body1-medium text-labelsVibrant-primary transition-colors",
              isSelected && "text-body1-bold bg-white"
            )}
          >
            <Icon name={tab.icon} size={20} />
            {t(`${tab.value}Tab`)}
          </button>
        );
      })}
    </div>
  );
};

export default PlaceDetailTabs;
