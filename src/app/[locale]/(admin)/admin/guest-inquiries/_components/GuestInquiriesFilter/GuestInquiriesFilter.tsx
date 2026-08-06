import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useClickOutside } from "@/hooks";
import { AdminDropdown, AdminFilter } from "../../../_components";
import { ANSWER_OPTIONS, STATUS_OPTIONS } from "./FILTER_OPTIONS";

interface GuestInquiriesFilterProps {
  currentParams: ReturnType<typeof useSearchParams>;
}

const GuestInquiriesFilter = ({ currentParams }: GuestInquiriesFilterProps) => {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<"status" | "answered" | null>(null);

  const currentStatusValue = currentParams.get("status") ?? "";
  const currentStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === currentStatusValue)?.label || "상태";

  const currentAnswerValue = currentParams.get("answered") ?? "";
  const currentAnswerLabel =
    ANSWER_OPTIONS.find((opt) => opt.value === currentAnswerValue)?.label || "답변";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`/admin/guest-inquiries?${params.toString()}`);
    setActiveDropdown(null);
  };

  const ref = useClickOutside(() => setActiveDropdown(null));

  const guestInquiriesFilters = [
    {
      label: currentStatusLabel,
      onSelected: activeDropdown === "status",
      onClick: () => setActiveDropdown((prev) => (prev === "status" ? null : "status")),
    },
    {
      label: currentAnswerLabel,
      onSelected: activeDropdown === "answered",
      onClick: () => setActiveDropdown((prev) => (prev === "answered" ? null : "answered")),
    },
  ];

  return (
    <div ref={ref} className="relative">
      <AdminFilter filters={guestInquiriesFilters} />

      {activeDropdown === "status" && (
        <AdminDropdown
          open={true}
          className="left-5"
          options={STATUS_OPTIONS}
          onSelect={(value) => handleFilterChange("status", value)}
        />
      )}

      {activeDropdown === "answered" && (
        <AdminDropdown
          open={true}
          className="left-[100px]"
          options={ANSWER_OPTIONS}
          onSelect={(value) => handleFilterChange("answered", value)}
        />
      )}
    </div>
  );
};

export default GuestInquiriesFilter;
