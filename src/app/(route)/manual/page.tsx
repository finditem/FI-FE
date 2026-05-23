"use client";

import { useState } from "react";
import { Tab } from "@/components";
import { ManualList } from "./_components";
import { MANUAL_DATA, MANUAL_LIST } from "./_components/MANUAL_CONST";

const page = () => {
  const [selected, setSelected] = useState<keyof typeof MANUAL_DATA>("LOST");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Tab
        tabs={MANUAL_LIST}
        selected={selected}
        onValueChange={(key) => {
          setSelected(key as keyof typeof MANUAL_DATA);
          setOpenIndex(null);
        }}
      />
      <ManualList openIndex={openIndex} setOpenIndex={setOpenIndex} selected={selected} />
    </>
  );
};

export default page;
