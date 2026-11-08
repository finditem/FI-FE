import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ReviewWritePage } from "./_components";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { roomId: roomIdString } = await params;
  const roomId = Number(roomIdString);

  if (isNaN(roomId)) return notFound();

  return (
    <Suspense fallback={null}>
      <ReviewWritePage roomId={roomId} />
    </Suspense>
  );
};

export default Page;
