"use client";

import { Tab } from "@/components";
import { PublicDataFilterSection, PublicDataList } from "../_internal";
import { usePublicDataTabQuery } from "../../_hooks/usePublicDataTabQuery/usePublicDataTabQuery";

const PublicDataView = () => {
  const { PUBLIC_LIST_TABS, activeTab, handleTabChange } = usePublicDataTabQuery();

  return (
    <>
      <Tab
        tabs={PUBLIC_LIST_TABS}
        selected={activeTab}
        onValueChange={(key) => handleTabChange(key)}
        className="sticky left-0 top-[56px]"
      />

      <div>
        <PublicDataFilterSection />

        <PublicDataList />
      </div>
    </>
  );
};

export default PublicDataView;
