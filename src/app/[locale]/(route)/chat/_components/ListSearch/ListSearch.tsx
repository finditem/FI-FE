"use client";

import { FieldValues, FormProvider, useForm } from "react-hook-form";
import RegionSearchView from "./_internal/RegionSearchView";
import { InputSearch } from "@/components";
import { useRouter } from "next/navigation";

const ListSearch = () => {
  const router = useRouter();
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const searchQuery = methods.watch("regionSearch") ?? "";

  const onSubmit = ({ regionSearch }: FieldValues) => {
    const region = regionSearch.trim();
    if (!region) return;
    router.replace(`/chat?&region=${region}`);
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="px-5 py-[10px]">
          <InputSearch
            mode="RHF"
            name="regionSearch"
            placeholder="시/군/구를 입력해 주세요."
            autoFocus
          />
        </form>
      </FormProvider>

      <RegionSearchView searchQuery={searchQuery} />
    </>
  );
};

export default ListSearch;
