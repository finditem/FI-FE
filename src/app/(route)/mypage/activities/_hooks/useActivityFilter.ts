import { useState } from "react";
import { useFilterParams } from "@/hooks/domain";
import { normalizeEnumValue } from "@/utils";
import {
  ACTIVITY_DEFAULT_FILTERS,
  ActivityFilterState,
  ActivityFilterValue,
} from "../_types/ActivityFilterType";

export const useActivityFilter = () => {
  const { startDate, endDate, activity } = useFilterParams();

  const [filters, setFilters] = useState<ActivityFilterState>({
    ...ACTIVITY_DEFAULT_FILTERS,
    startDate: startDate ?? "",
    endDate: endDate ?? "",
    activity: normalizeEnumValue<Exclude<ActivityFilterValue, undefined>>(activity),
  });

  return {
    filters,
    setFilters,
    startDate,
    endDate,
    activity,
  };
};
