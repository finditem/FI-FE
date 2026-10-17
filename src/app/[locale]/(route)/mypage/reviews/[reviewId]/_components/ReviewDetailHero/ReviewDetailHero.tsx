import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/utils";
import { DEFAULT_REVIEW_EMOTION, REVIEW_EMOTION_CHARACTER } from "../../_constants/REVIEW_EMOTION";

/**
 * 후기 편지 상세 페이지 상단 히어로(받은 후기 칩, 도착 메시지, 감정 캐릭터)를 렌더합니다.
 *
 * @remarks
 * - 초록 배경과 뒤로가기 헤더는 상위 `layout.tsx`가 담당하고, 이 컴포넌트는 그 안에 얹히는
 *   데이터 의존 영역만 그립니다. 로딩 시에는 `loading.tsx`가 이 자리를 스켈레톤으로 대체합니다.
 */
const ReviewDetailHero = async () => {
  const t = await getTranslations("ReviewDetailPage");

  // TODO(수현): 후기 조회 API 연동 시 후기 감정에 따라 캐릭터와 도착 메시지를 분기한다.
  const emotion = DEFAULT_REVIEW_EMOTION;

  return (
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
