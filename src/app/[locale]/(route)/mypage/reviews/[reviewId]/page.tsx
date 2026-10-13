import { notFound } from "next/navigation";
import { z } from "zod";
import { ReviewLetterDetail } from "./_components";

interface ReviewDetailPageProps {
  params: Promise<{ reviewId: string }>;
}

const reviewIdParamSchema = z.coerce.number().int().positive();

const ReviewDetailPage = async ({ params }: ReviewDetailPageProps) => {
  const { reviewId } = await params;
  const parsedReviewId = reviewIdParamSchema.safeParse(reviewId);

  if (!parsedReviewId.success) notFound();

  return <ReviewLetterDetail reviewId={parsedReviewId.data} />;
};

export default ReviewDetailPage;
