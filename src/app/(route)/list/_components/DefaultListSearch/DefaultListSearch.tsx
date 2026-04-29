"use client";
"use no memo";

import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useGetSearchKeyword } from "@/api/fetch/post";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { InputSearch } from "@/components/common";
import { useInfiniteScroll } from "@/hooks";
import { PostSearchView } from "./_internal";

const DefaultListSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    data: listData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSearchKeyword({
    keyword,
  });
  const { ref: searchRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleSearchSubmit = () => {
    const raw = methods.getValues("postSearch");
    const value = raw?.trim();

    if (!value || value === keyword) return;

    router.replace(`/list?search=post&keyword=${value}`);
  };

  return (
    <div className="flex flex-col h-hf-base">
      <FormProvider {...methods}>
        <div className="sticky top-[56px] z-10 bg-white px-5 py-[10px]">
          <InputSearch
            mode="RHF"
            name="postSearch"
            defaultValue={keyword}
            placeholder="제목, 내용을 입력해 주세요."
            onEnter={handleSearchSubmit}
          />
        </div>
      </FormProvider>

      <ErrorBoundary toastMessage="검색 결과를 불러올 수 없어요. 다시 시도해 주세요.">
        <PostSearchView data={listData ?? []} keyword={keyword} />
        {hasNextPage && <div ref={searchRef} className="h-10 w-full" />}
      </ErrorBoundary>
    </div>
  );
};

export default DefaultListSearch;
