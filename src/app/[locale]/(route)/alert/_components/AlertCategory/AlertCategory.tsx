"use client";

import { Filter } from "@/components";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import useAlertCategories from "../../_hooks/useAlertCategories/useAlertCategories";
import { AlertCategoryKey } from "../../_types/alertKeyType";
import { cn } from "@/utils";

const AlertCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertCategories = useAlertCategories();
  const selectedCategory = (searchParams.get("category") as AlertCategoryKey) || "all";

  const handleCategoryClick = (key: AlertCategoryKey) => router.replace(`/alert?category=${key}`);

  return (
    <div className={cn("flex gap-2 px-5 py-[14px] no-scrollbar", "tablet:px-16")}>
      {alertCategories.map((category) => (
        <Filter
          key={category.key}
          ariaLabel={category.label}
          onSelected={selectedCategory === category.key}
          onClick={() => handleCategoryClick(category.key)}
        >
          {category.label}
        </Filter>
      ))}
    </div>
  );
};

export default AlertCategory;
