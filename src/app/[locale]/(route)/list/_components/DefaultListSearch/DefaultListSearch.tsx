"use client";
"use no memo";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetSearchKeyword } from "@/api/fetch/post";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { InputSearch } from "@/components";
import { useInfiniteScroll } from "@/hooks";
import { trackSearch } from "@/utils/analytics/analytics";
import { PostSearchView } from "../_internal";

const postSearchSchema = z.object({
  postSearch: z.string().trim().min(1).max(50),
});

type PostSearchFormValues = z.infer<typeof postSearchSchema>;

const DefaultListSearch = () => {
  const t = useTranslations("DefaultListSearch");
  const router = useRouter();
  const searchParams = useSearchParams();
  const keywordResult = postSearchSchema.shape.postSearch.safeParse(
    searchParams.get("keyword") ?? ""
  );
  const keyword = keywordResult.success ? keywordResult.data : "";

  const methods = useForm<PostSearchFormValues>({
    resolver: zodResolver(postSearchSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      postSearch: keyword,
    },
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
    const result = postSearchSchema.shape.postSearch.safeParse(raw);
    const value = result.success ? result.data : "";

    if (!value || value === keyword) return;

    trackSearch(value);
    const params = new URLSearchParams({ search: "post", keyword: value });
    router.replace(`/list?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-hf-base">
      <FormProvider {...methods}>
        <div className="sticky top-[56px] z-10 bg-white px-5 py-[10px]">
          <InputSearch
            mode="RHF"
            name="postSearch"
            placeholder={t("placeholder")}
            onEnter={handleSearchSubmit}
          />
        </div>
      </FormProvider>

      <ErrorBoundary toastMessage={t("errorToast")}>
        <PostSearchView data={listData ?? []} keyword={keyword} />
        {hasNextPage && <div ref={searchRef} className="h-10 w-full" />}
      </ErrorBoundary>
    </div>
  );
};

export default DefaultListSearch;
