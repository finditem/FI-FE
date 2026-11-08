import { RefObject, Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PostItem } from "@/api/fetch/post";
import { PostListItem, EmptyState, LoadingState } from "@/components";

interface DefaultListProps {
  listData?: PostItem[];
  listRef?: React.Ref<HTMLDivElement>;
  hasNextPage: boolean;
}

const DefaultList = ({ listData, listRef, hasNextPage }: DefaultListProps) => {
  const t = useTranslations("DefaultList");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || listData === undefined) return <LoadingState />;

  return (
    <Suspense fallback={<LoadingState />}>
      <section aria-label={t("listAriaLabel")} className="w-full">
        {listData.length === 0 ? (
          <EmptyState
            icon={{
              iconName: "LogoCharacterOutlined",
              iconSize: 130,
              iconColor: "text-labelsVibrant-quaternary",
            }}
            description={t("emptyDescription")}
          />
        ) : (
          <>
            <ul>
              {listData?.map((item) => (
                <PostListItem key={item.id} post={item} linkState="list" />
              ))}
            </ul>

            {hasNextPage && <div ref={listRef} className="h-10 w-full" />}
          </>
        )}
      </section>
    </Suspense>
  );
};

export default DefaultList;
