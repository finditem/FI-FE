"use client";

import { useState } from "react";
import { Tab } from "@/components";
import { ManualList } from "./_components";
import useManualTabs from "./_hooks/useManualTabs/useManualTabs";
import type { ManualKey } from "./_types/ManualType";

const page = () => {
  const manualTabs = useManualTabs();
  const [selected, setSelected] = useState<ManualKey>("LOST");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Tab
        tabs={manualTabs}
        selected={selected}
        onValueChange={(key) => {
          setSelected(key as ManualKey);
          setOpenIndex(null);
        }}
      />
      <ManualList openIndex={openIndex} setOpenIndex={setOpenIndex} selected={selected} />
    </>
  );
};

export default page;
