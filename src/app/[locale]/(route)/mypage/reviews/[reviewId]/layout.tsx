import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/utils";
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

  // TODO(수현): 후기 조회 API 연동 시 후기 감정에 따라 캐릭터와 도착 메시지를 분기한다.
  const emotion = DEFAULT_REVIEW_EMOTION;

  return (
    <div className="bg-glassGreen-600">
      <ReviewDetailHeader title={t("title")} backAriaLabel={t("backAriaLabel")} />
      <section className={cn("overflow-hidden px-5 pb-7 pt-2 text-white", "tablet:px-16")}>
        <div className="flex items-start justify-between">
          <div className={cn("flex min-w-0 flex-1 flex-col items-start gap-2", "tablet:max-w-xs")}>
            <span className="inline-block rounded-full border-[0.5px] border-white bg-white/[0.33] px-3 py-1 text-caption1-semibold text-white">
              {t("receivedChip")}
            </span>
            <p className={cn("whitespace-nowrap text-h2-regular", "tablet:text-h1-regular")}>
              {t.rich("arrivalMessage", {
                lineBreak: () => <br />,
                lineBreakMobile: () => <br className="tablet:hidden" />,
                strong: (chunks) => (
                  <strong className={cn("text-h1-bold", "tablet:text-title2-bold")}>
                    {chunks}
                  </strong>
                ),
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
