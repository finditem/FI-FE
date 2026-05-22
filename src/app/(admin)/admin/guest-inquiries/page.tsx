"use client";

import { Suspense } from "react";
import { DetailHeader } from "@/components";
import { GuestInquiriesView } from "./_components";

const page = () => {
  return (
    <>
      <DetailHeader title="비회원 문의 내역" />

      <Suspense fallback={null}>
        <GuestInquiriesView />
      </Suspense>
    </>
  );
};

export default page;
