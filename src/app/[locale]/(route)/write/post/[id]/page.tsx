import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostEditPage } from "./_components";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const postId = Number(id);

  if (isNaN(postId)) return notFound();

  return (
    <Suspense fallback={null}>
      <PostEditPage postId={postId} />
    </Suspense>
  );
};

export default Page;
