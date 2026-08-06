"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClickOutside } from "@/hooks";
import { AdminDropdown, AdminFilter } from "../../../../_components";
import { ReportsTabType } from "../../../_types/ReportsTabType";
import { FILTER_CONFIG } from "./REPORTS_FILTER_OPTIONS";

interface ReportsFilterProps {
  currentParams: ReturnType<typeof useSearchParams>;
  activeTab: ReportsTabType;
}

const ReportsFilter = ({ currentParams, activeTab }: ReportsFilterProps) => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<"status" | "answered" | null>(null);

  const { statusOptions, answerOptions } = FILTER_CONFIG[activeTab];

  const currentStatusValue = currentParams.get("status") ?? "";
  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === currentStatusValue)?.label || "상태";

  const currentAnswerValue = currentParams.get("answered") ?? "";
  const currentAnswerLabel =
    answerOptions?.find((opt) => opt.value === currentAnswerValue)?.label || "답변";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`/admin/reports?${params.toString()}`);
    setActiveDropdown(null);
  };

  const ref = useClickOutside(() => setActiveDropdown(null));

  useEffect(() => {
    setActiveDropdown(null);
  }, [activeTab]);

  const filters = [
    {
      label: currentStatusLabel,
      onSelected: activeDropdown === "status",
      onClick: () => setActiveDropdown((prev) => (prev === "status" ? null : "status")),
    },
  ];

  if (answerOptions) {
    filters.push({
      label: currentAnswerLabel,
      onSelected: activeDropdown === "answered",
      onClick: () => setActiveDropdown((prev) => (prev === "answered" ? null : "answered")),
    });
  }

  return (
    <div ref={ref} className="relative">
      <AdminFilter filters={filters} />

      {activeDropdown === "status" && (
        <AdminDropdown
          open
          className="left-5"
          options={statusOptions}
          onSelect={(value) => handleFilterChange("status", value)}
        />
      )}

      {activeDropdown === "answered" && answerOptions && (
        <AdminDropdown
          open
          className="left-[100px]"
          options={answerOptions}
          onSelect={(value) => handleFilterChange("answered", value)}
        />
      )}
    </div>
  );
};

export default ReportsFilter;
