"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReviewDetailResponse } from "@/api/fetch/review";
import { cn } from "@/utils";
import { REVIEW_EMOTION_CHARACTER } from "../../_constants/REVIEW_EMOTION";

interface ReviewDetailHeroProps {
  review: ReviewDetailResponse;
}

/**
 * 후기 편지 상세 페이지 상단 히어로(받은 후기 칩, 감정별 도착 메시지, 감정 캐릭터)를 렌더합니다.
 *
 * @remarks
 * - 초록 배경과 뒤로가기 헤더는 상위 `layout.tsx`가 담당하고, 이 컴포넌트는 그 안에 얹히는
 *   데이터 의존 영역만 그립니다. 로딩 시에는 `ReviewDetailSkeleton`이 이 자리를 대체합니다.
 * - 도착 메시지와 캐릭터는 후기 감정(emotion)에 따라 분기합니다. 발신자 닉네임은 메시지에 반영되며,
 *   탈퇴한 사용자면 기본 닉네임으로 대체합니다.
 *
 * @author suhyeon
 */
const ReviewDetailHero = ({ review }: ReviewDetailHeroProps) => {
  const t = useTranslations("ReviewDetailPage");
  const { emotion, author } = review;

  const senderNickname =
    author.withdrawn || !author.nickname ? t("withdrawnUser") : author.nickname;

  return (
    <section className={cn("overflow-hidden px-5 pb-7 pt-2 text-white", "tablet:px-16")}>
      <div className="flex items-start justify-between">
        <div className={cn("flex min-w-0 flex-1 flex-col items-start gap-2", "tablet:max-w-xs")}>
          <span className="inline-block rounded-full border-[0.5px] border-white bg-white/[0.33] px-3 py-1 text-caption1-semibold text-white">
            {t("receivedChip")}
          </span>
          <p className={cn("whitespace-nowrap text-h2-regular", "tablet:text-h1-regular")}>
            {t.rich(`arrivalMessage.${emotion}`, {
              nickname: senderNickname,
              lineBreak: () => <br />,
              lineBreakMobile: () => <br className="tablet:hidden" />,
              strong: (chunks) => (
                <strong className={cn("text-h1-bold", "tablet:text-title2-bold")}>{chunks}</strong>
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
  );
};

export default ReviewDetailHero;
