"use client";

import { Filter } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import useAlertCategories from "../../_hooks/useAlertCategories/useAlertCategories";
import { AlertCategoryKey } from "../../_types/alertKeyType";

const AlertCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertCategories = useAlertCategories();
  const selectedCategory = (searchParams.get("category") as AlertCategoryKey) || "all";

  const handleCategoryClick = (key: AlertCategoryKey) => router.replace(`/alert?category=${key}`);

  return (
    <div className="flex gap-2 px-5 py-[14px] no-scrollbar">
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
