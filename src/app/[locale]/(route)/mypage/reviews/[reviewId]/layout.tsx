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
    <div className="bg-[#4ccd99]">
      <ReviewDetailHeader title={t("title")} backAriaLabel={t("backAriaLabel")} />
      <section className="overflow-hidden px-5 pb-7 pt-2 text-white">
        <div className="flex items-start gap-[51px]">
          <div className="flex w-[122px] flex-col items-start gap-2">
            <span className="inline-block rounded-full border-[0.5px] border-white bg-white/[0.33] px-3 py-1 text-caption1-semibold text-white">
              {t("receivedChip")}
            </span>
            <p className="whitespace-nowrap text-h2-regular">
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
            width={177}
            height={170}
            priority
            className="pointer-events-none shrink-0 select-none"
          />
        </div>
      </section>
      {children}
    </div>
  );
};

export default ReviewDetailLayout;
