"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { InputSearch } from "@/components/common";
import { PostListItem } from "@/components/domain";
import { useGetMarketingPosts } from "@/api/fetch/admin";
import { useInfiniteScroll } from "@/hooks";
import { EmptyState, LoadingState } from "@/components/state";

const ContentAgreeSearchView = () => {
  const router = useRouter();
  const params = useSearchParams();
  const search = params.get("search")?.trim() || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetMarketingPosts(
    {
      keyword: search,
      size: 20,
    },
    { enabled: search !== "" }
  );

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue === "") {
      router.push(`/admin/content-agree/search`);
    } else {
      router.push(`/admin/content-agree/search?search=${trimmedValue}`);
    }
  };

  return (
    <>
      <section className="px-5 py-[10px]">
        <InputSearch
          placeholder="제목, 내용을 입력해 주세요."
          mode="onChange"
          name="search"
          onEnter={handleSearch}
          defaultValue={search}
        />
      </section>

      <section className="flex-1 overflow-y-auto">
        {search === "" ? (
          <EmptyState
            icon={{ iconName: "NoPublicDataSearch", iconSize: 70 }}
            title="검색어를 입력해 주세요"
            description="제목이나 내용으로 검색할 수 있습니다."
          />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <ul>
            {(data || []).map((post) => (
              <PostListItem post={post} linkState="list" keyword={search} key={post.id} />
            ))}
            {hasNextPage && <div ref={ref} className="h-10" />}
          </ul>
        )}
        {search !== "" && !isLoading && (!data || data.length === 0) && (
          <EmptyState
            icon={{ iconName: "NoPublicDataSearch", iconSize: 70 }}
            title="검색 결과가 없어요"
            description="입력한 내용을 다시 한 번 확인해 주세요."
          />
        )}
      </section>
    </>
  );
};

export default ContentAgreeSearchView;
