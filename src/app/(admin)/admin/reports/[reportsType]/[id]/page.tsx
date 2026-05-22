"use client";

import { useParams, notFound } from "next/navigation";
import { DetailHeader } from "@/components";
import { AdminReportsView, ReportsInputComment } from "./_components";
import { VALID_TYPES } from "./_types/VALID_TYPES";
import { ReportsType } from "./_types/ReportsType";

const page = () => {
  const { reportsType, id } = useParams();

  if (!VALID_TYPES.includes(reportsType as (typeof VALID_TYPES)[number])) {
    return notFound();
  }

  return (
    <>
      <DetailHeader title="신고/문의 내역" />
      <h1 className="sr-only">신고/문의 상세</h1>

      <AdminReportsView id={Number(id)} type={reportsType as ReportsType} />

      <ReportsInputComment reportsId={Number(id)} reportsType={reportsType as ReportsType} />
    </>
  );
};

export default page;
