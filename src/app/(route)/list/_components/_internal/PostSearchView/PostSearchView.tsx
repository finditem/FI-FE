import { Suspense } from "react";
import { PostListItem } from "@/components/domain";
import { LoadingState } from "@/components/state";
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
