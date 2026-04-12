import { useGetUserMeFavorites } from "@/api/fetch/user";
import { StatusFilterValue } from "@/components/domain/FilterSectionBottomSheet/_types/types";
import { useFilterParams } from "@/hooks/domain";
import { LoadingState } from "@/components/state";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { MypageEmptyUI, PostListItem } from "@/components/domain";
import { useSearchParams } from "next/navigation";

const MypageFavoritesContent = () => {
  const { addToast } = useToast();
  const { region, status, category, sort } = useFilterParams();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") ?? undefined;

  const {
    data: favoritesData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetUserMeFavorites({
    address: region ?? "",
    postType: status as StatusFilterValue,
    category: category,
    sortType: sort ?? "LATEST",
    keyword,
  });

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) return <LoadingState />;
  if (isError) addToast("목록을 불러오는데 실패했어요", "error");

  return (
    <section>
      <h2 className="sr-only">내 즐겨찾기 목록 영역</h2>
      {favoritesData && favoritesData.length === 0 ? (
        <MypageEmptyUI pageType="favorites" />
      ) : (
        <>
          <ul>
            {favoritesData &&
              favoritesData.map((item, index) => (
                <PostListItem key={index} post={item} keyword={keyword} />
              ))}
          </ul>

          <div ref={ref} className="h-10" />
        </>
      )}
    </section>
  );
};

export default MypageFavoritesContent;
