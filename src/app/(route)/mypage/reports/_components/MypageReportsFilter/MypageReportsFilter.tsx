"use client";

import { Filter, KebabMenu } from "@/components";
import { useFilterParams, useFilterSync } from "@/hooks";
import { filterSelectionState, normalizedFilterValues, normalizeEnumValue } from "@/utils";
import { useState } from "react";
import {
  ReportStatusFilterState,
  ReportStatusFilterValue,
} from "../../_types/MypageReportsFilterType";
import { REPORTS_KEBAB_OPTIONS, REPORTS_LABEL_MAP } from "../../_constants/REPORT_LABEL";

const MypageReportsFilter = () => {
  const [isKebabMenu, setIsKebabMenu] = useState(false);

  const { reportStatus } = useFilterParams();

  const kebabMenuItems = REPORTS_KEBAB_OPTIONS.map((item) => ({
    text: item.label,
    onClick: () => {
      updateFilters({ reportStatus: item.value });
      setIsKebabMenu((prev) => !prev);
    },
  }));

  const { normalizedReportStatus } = normalizedFilterValues({ reportStatus });
  const selectionState = filterSelectionState({ reportStatus });

  const { updateFilters } = useFilterSync<ReportStatusFilterState>({
    defaultFilters: { reportStatus: undefined },
    currentFiltersFromUrl: {
      reportStatus: normalizeEnumValue<Exclude<ReportStatusFilterValue, undefined>>(reportStatus),
    },
  });

  return (
    <section className="flex w-full gap-2 px-5 py-[14px]">
      <h2 className="sr-only">필터링 영역</h2>

      <div className="relative">
        <Filter
          ariaLabel="필터"
          onSelected={selectionState.isReportStatusSelected}
          icon={{ name: "ArrowDown", size: 12 }}
          iconPosition="trailing"
          onClick={() => setIsKebabMenu((prev) => !prev)}
        >
          {(normalizedReportStatus && REPORTS_LABEL_MAP[normalizedReportStatus]) ?? "상태"}
        </Filter>

        {isKebabMenu && (
          <div className="absolute left-0 top-full mt-2">
            <KebabMenu items={kebabMenuItems} />
          </div>
        )}
      </div>
    </section>
  );
};

export default MypageReportsFilter;
