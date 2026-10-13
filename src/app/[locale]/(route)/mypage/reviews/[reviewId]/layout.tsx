import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ReviewDetailHeader } from "./_components";
import { DEFAULT_REVIEW_EMOTION, REVIEW_EMOTION_CHARACTER } from "./_constants/REVIEW_EMOTION";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ReviewDetailLayout");

  return {
    title: t("title"),
    description: t("description"),
    other: { "page-type": "review-detail" },
  };
}

const ReviewDetailLayout = async ({ children }: { children: ReactNode }) => {
  const t = await getTranslations("ReviewDetailPage");

  // TODO(suhyeon): 후기 조회 API 연동 시 후기 감정(emotion)에 따라 캐릭터와 도착 메시지를 분기한다.
  const emotion = DEFAULT_REVIEW_EMOTION;

  return (
    <div className="min-h-screen bg-[#4ccd99]">
      <ReviewDetailHeader title={t("title")} backAriaLabel={t("backAriaLabel")} />
      <section className="relative h-[206px] overflow-hidden px-5 text-white">
        <div className="relative z-10 max-w-[210px]">
          <span className="inline-block rounded-full border-[0.5px] border-white bg-white/[0.33] px-3 py-1 text-caption1-semibold text-white">
            {t("receivedChip")}
          </span>
          <p className="mt-2 text-h2-regular">
            {t.rich("arrivalMessage", {
              lineBreak: () => <br />,
              strong: (chunks) => <strong className="text-h1-bold">{chunks}</strong>,
            })}
          </p>
        </div>

        <Image
          src={REVIEW_EMOTION_CHARACTER[emotion]}
          alt=""
          aria-hidden
          width={176}
          height={169}
          priority
          className="pointer-events-none absolute bottom-0 right-2 select-none"
        />
      </section>
      {children}
    </div>
  );
};

export default ReviewDetailLayout;
