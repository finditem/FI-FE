"use client";

import { useFilterParams, useFilterSync } from "@/hooks";
import { useState } from "react";
import { INQUIRIES_KEBAB_OPTIONS, INQUIRIES_LABEL_MAP } from "../../_constants/INQUIRY_LABEL";
import { filterSelectionState, normalizedFilterValues, normalizeEnumValue } from "@/utils";
import {
  InquiryStatusFilterState,
  InquiryStatusFilterValue,
} from "../../_types/MypageInquiriesFilterType";
import { Filter, KebabMenu } from "@/components";
import { useTranslations } from "next-intl";

const MypageInquiriesFilter = () => {
  const t = useTranslations("MypageInquiriesFilter");
  const [isKebabMenu, setIsKebabMenu] = useState(false);

  const { inquiryStatus } = useFilterParams();

  const kebabMenuItems = INQUIRIES_KEBAB_OPTIONS.map((item) => ({
    text: t(item.labelKey),
    onClick: () => {
      updateFilters({ inquiryStatus: item.value });
      setIsKebabMenu((prev) => !prev);
    },
  }));

  const { normalizedInquiryStatus } = normalizedFilterValues({ inquiryStatus });
  const selectionState = filterSelectionState({ inquiryStatus });

  const { updateFilters } = useFilterSync<InquiryStatusFilterState>({
    defaultFilters: { inquiryStatus: undefined },
    currentFiltersFromUrl: {
      inquiryStatus:
        normalizeEnumValue<Exclude<InquiryStatusFilterValue, undefined>>(inquiryStatus),
    },
  });

  return (
    <section className="flex w-full gap-2 px-5 py-[14px]">
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>

      <div className="relative">
        <Filter
          ariaLabel={t("filterAriaLabel")}
          onSelected={selectionState.isInquiryStatusSelected}
          icon={{ name: "ArrowDown", size: 12 }}
          iconPosition="trailing"
          onClick={() => setIsKebabMenu((prev) => !prev)}
        >
          {(normalizedInquiryStatus && t(INQUIRIES_LABEL_MAP[normalizedInquiryStatus])) ??
            t("status")}
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

export default MypageInquiriesFilter;
