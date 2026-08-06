"use client";

import { useRouter, useSearchParams } from "next/navigation";
import GuestInquiriesList from "../GuestInquiriesList/GuestInquiriesList";
import { AdminSearch } from "../../../_components";
import { normalizeEnumValue } from "@/utils";
import GuestInquiriesFilter from "../GuestInquiriesFilter/GuestInquiriesFilter";

const GuestInquiriesView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  return (
    <div className="h-base">
      <AdminSearch
        defaultValue={params.q}
        onEnter={(searchValue) => {
          const newParams = new URLSearchParams(searchParams.toString());
          if (searchValue) newParams.set("q", searchValue);
          else newParams.delete("q");
          router.replace(`/admin/guest-inquiries?${newParams.toString()}`);
        }}
      />

      <GuestInquiriesFilter currentParams={searchParams} />

      <GuestInquiriesList
        status={normalizeEnumValue(params.status) ?? ""}
        answered={
          params.answered === "true" ? true : params.answered === "false" ? false : undefined
        }
        keyword={params.q ?? ""}
      />
    </div>
  );
};

export default GuestInquiriesView;
