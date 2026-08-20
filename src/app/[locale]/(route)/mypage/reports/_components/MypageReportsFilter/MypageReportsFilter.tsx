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
import { useTranslations } from "next-intl";

const MypageReportsFilter = () => {
  const t = useTranslations("MypageReportsFilter");
  const [isKebabMenu, setIsKebabMenu] = useState(false);

  const { reportStatus } = useFilterParams();

  const kebabMenuItems = REPORTS_KEBAB_OPTIONS.map((item) => ({
    text: t(item.labelKey),
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
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

      <div className="relative">
        <Filter
          ariaLabel={t("filterAriaLabel")}
          onSelected={selectionState.isReportStatusSelected}
          icon={{ name: "ArrowDown", size: 12 }}
          iconPosition="trailing"
          onClick={() => setIsKebabMenu((prev) => !prev)}
        >
          {(normalizedReportStatus && t(REPORTS_LABEL_MAP[normalizedReportStatus])) ?? t("status")}
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
