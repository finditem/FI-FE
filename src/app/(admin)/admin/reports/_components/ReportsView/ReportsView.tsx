"use client";

import { Tab } from "@/components";
import { normalizeEnumValue } from "@/utils";
import { InquiryStatus, ReportStatus } from "@/types";
import ReportsList from "../ReportsList/ReportsList";
import { AdminSearch } from "../../../_components";
import { REPORTS_TAB } from "../../_constants/REPORTS_TAB";
import { ReportsFilter } from "../_internal";
import { useReportsQuery } from "../../_hooks/useReportsQuery";

const ReportsView = () => {
  const { searchParams, keyword, activeTab, handleKeywordSearch, handleTabChange } =
    useReportsQuery();

  const reportStatus = normalizeEnumValue<ReportStatus>(searchParams.get("status"));
  const inquiryStatus = normalizeEnumValue<InquiryStatus>(searchParams.get("status"));

  const answered =
    searchParams.get("answered") !== null ? searchParams.get("answered") === "true" : undefined;

  return (
    <div className="h-base">
      <Tab
        tabs={REPORTS_TAB}
        selected={activeTab}
        onValueChange={(key) => handleTabChange(key)}
        className="sticky left-0 top-[56px]"
      />

      <AdminSearch onEnter={handleKeywordSearch} defaultValue={keyword} />

      <ReportsFilter currentParams={searchParams} activeTab={activeTab} />

      <ReportsList
        activeTab={activeTab}
        keyword={keyword}
        reportStatus={activeTab === "report" ? reportStatus : undefined}
        inquiryStatus={activeTab === "inquiry" ? inquiryStatus : undefined}
        answered={answered}
      />
    </div>
  );
};

export default ReportsView;
