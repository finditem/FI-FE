"use client";

import { useFormContext } from "react-hook-form";
import { notFound } from "next/navigation";
import { useGetDetailPost } from "@/api/fetch/post";
import { DetailHeader, WriteImageSection, WriteActionSection } from "@/components";
import { PostWriteFormValues } from "../../../_types/PostWriteType";
import usePostEditSubmit from "../../../_hooks/usePostEditSubmit/usePostEditSubmit";
import usePostEditInit from "../../../_hooks/usePostEditInit/usePostEditInit";
import {
  CategorySection,
  ContentSection,
  LocationSection,
  TitleSection,
} from "../../../_components/_internal";
import { PostEditSkeleton } from "../_internal";

interface PostEditPageProps {
  postId: number;
}

const PostEditPage = ({ postId }: PostEditPageProps) => {
  const methods = useFormContext<PostWriteFormValues>();
  const values = methods.watch();

  const { data, isLoading, isError } = useGetDetailPost({ id: postId });

  usePostEditInit({ data: data?.result ?? null, methods });

  const { onSubmit, isPosting, canSubmit } = usePostEditSubmit({ postId, methods });
  const isSubmitDisabled = !canSubmit(values) || isPosting;

  const title = data?.result?.postType === "LOST" ? "분실했어요 수정" : "발견했어요 수정";

  if (isLoading) return <PostEditSkeleton />;
  if (isError || !data?.result) return notFound();
  if (!data.result.isMine) return notFound();

  return (
    <>
      <DetailHeader title={title} />

      <h1 className="sr-only">{`${title} 페이지`}</h1>

      <form key={data.result.id} onSubmit={onSubmit} className="flex flex-col h-base">
        <div className="flex min-h-0 flex-1 flex-col">
          <WriteImageSection />
          <CategorySection />
          <TitleSection />
          <ContentSection />
          <LocationSection />
        </div>

        <WriteActionSection disabled={isSubmitDisabled} />
      </form>
    </>
  );
};

export default PostEditPage;
