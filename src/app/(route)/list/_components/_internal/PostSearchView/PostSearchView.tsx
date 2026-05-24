import { Suspense } from "react";
import { PostListItem, LoadingState } from "@/components";
import { PostItem } from "@/api/fetch/post";
import PostSearchEmpty from "../PostSearchEmpty/PostSearchEmpty";

const PostSearchView = ({ data, keyword }: { data: PostItem[]; keyword: string }) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <section className="flex flex-1 flex-col">
        {!data || data.length === 0 ? (
          <PostSearchEmpty keyword={keyword} />
        ) : (
          <ul>
            {data?.map((item) => (
              <PostListItem post={item} key={item.id} keyword={keyword} />
            ))}
          </ul>
        )}
      </section>
    </Suspense>
  );
};

export default PostSearchView;
