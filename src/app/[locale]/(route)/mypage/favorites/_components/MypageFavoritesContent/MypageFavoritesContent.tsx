import { useGetUserMeFavorites } from "@/api/fetch/user";
import { StatusFilterValue, LoadingState, MypageEmptyUI, PostListItem } from "@/components";
import { useFilterParams } from "@/hooks";
import { useToast } from "@/context/ToastContext";
import { useInfiniteScroll } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const MypageFavoritesContent = () => {
  const t = useTranslations("MypageFavoritesContent");
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
  if (isError) addToast(t("loadError"), "error");

  return (
    <section>
      <h2 className="sr-only">{t("srOnlyTitle")}</h2>
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
