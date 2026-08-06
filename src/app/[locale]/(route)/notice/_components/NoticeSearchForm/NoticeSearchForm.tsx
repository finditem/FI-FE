"use client";

import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { InputSearch } from "@/components";
import { useSearchUpdateQueryString } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const NoticeSearchForm = () => {
  const { searchUpdateQuery } = useSearchUpdateQueryString();
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") ?? "";

  const methods = useForm({
    defaultValues: { noticeSearch: keywordFromUrl },
  });

  const { reset } = methods;
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    reset({ noticeSearch: keywordFromUrl });
  }, [keywordFromUrl, reset]);

  const handleSearchSubmit = ({ noticeSearch }: FieldValues) => {
    const trimmed = typeof noticeSearch === "string" ? noticeSearch.trim() : "";
    searchUpdateQuery("keyword", trimmed || undefined);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSearchSubmit)} className="px-5 py-[10px]">
        <InputSearch name="noticeSearch" mode="RHF" placeholder="제목, 내용을 입력해 주세요." />
      </form>
    </FormProvider>
  );
};

export default NoticeSearchForm;
