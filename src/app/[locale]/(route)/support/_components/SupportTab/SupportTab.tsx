"use client";

import { cn } from "@/utils";
import { useSupportTabQuery, useSupportTabs } from "./_internal";

const SupportTab = () => {
  const { tab, updateTabQuery } = useSupportTabQuery();
  const tabs = useSupportTabs();

  return (
    <div className="flex w-full border-b border-divider-default px-5">
      {tabs.map((item) => (
        <button
          key={item.key}
          type="button"
          className={cn(
            "h-[60px] flex-1 text-h3-semibold flex-center",
            tab === item.key
              ? "border-b-2 border-brand-normal-default text-brand-normal-default"
              : "text-system-unselected"
          )}
          onClick={() => updateTabQuery(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SupportTab;
