import { getTranslations } from "next-intl/server";
import { Button, Icon, ProfileAvatar } from "@/components";
import { CATEGORY_TILE_ICON_MAP } from "@/constants";
import { cn } from "@/utils";
import { MOCK_REVIEW_HAS_LETTER } from "../../_constants/MOCK_REVIEW";

interface ReviewLetterDetailProps {
  reviewId: number;
}

const ReviewLetterDetail = async ({ reviewId }: ReviewLetterDetailProps) => {
  const t = await getTranslations("ReviewDetailPage");
  const strengths = [t("strengths.kind"), t("strengths.trust"), t("strengths.quick")];

  return (
    <div className="flow-root bg-white pb-[calc(116px+var(--safe-area-bottom))]">
      <section
        className={cn(
          "relative z-10 mx-5 -mt-[38px] mb-6 flex flex-col gap-8 rounded-2xl bg-white px-4 py-6 shadow-md",
          "tablet:mx-auto tablet:max-w-2xl tablet:px-8"
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ProfileAvatar size={60} alt={t("sender.nickname")} />
              <span className="absolute -bottom-0.5 -right-0.5 size-[18px] rounded-full border-2 border-white bg-fill-brand-strong-default flex-center">
                <Icon name="SendReviewArrow" size={9} className="text-white" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-body1-regular font-bold text-layout-header-default">
                {t("sender.nickname")}
              </p>
              <div className="flex items-center gap-3 text-body2-regular">
                <p className="text-layout-body-default">{t("sender.location")}</p>
                <time
                  dateTime="2026-07-22"
                  className="text-body2-semibold text-labelsVibrant-secondary"
                >
                  {/* TODO(수현): 후기 조회 API 연동 시 실제 작성일을 ISO 8601 형식으로 제공한다. */}
                  {t("sender.date")}
                </time>
              </div>
            </div>
          </div>

          {MOCK_REVIEW_HAS_LETTER && (
            <p className="whitespace-pre-line rounded-xl px-4 py-5 text-body1-regular leading-[1.88] text-labelsVibrant-primary bg-fill-brand-subtle-default_2">
              {t("letter")}
            </p>
          )}

          <section className="flex flex-col gap-3" aria-labelledby={`strengths-${reviewId}`}>
            <h2
              id={`strengths-${reviewId}`}
              className="text-body2-semibold text-labelsVibrant-secondary"
            >
              {t("strengths.title")}
            </h2>
            <ul className="flex flex-col gap-3">
              {strengths.map((strength) => (
                <li
                  key={strength}
                  className="flex items-center gap-2 text-body1-medium text-labelsVibrant-primary"
                >
                  <span
                    aria-hidden
                    className="size-5 shrink-0 rounded-full bg-fill-brand-normal-default flex-center"
                  >
                    <Icon name="Check" size={12} />
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-labelsVibrant-quaternary" />

        <section className="flex flex-col gap-3" aria-labelledby={`found-item-${reviewId}`}>
          <h2
            id={`found-item-${reviewId}`}
            className="text-body2-semibold text-labelsVibrant-secondary"
          >
            {t("foundItem.title")}
          </h2>
          <div className="flex items-center gap-4">
            {/* TODO(수현): 찾아준 물건 이미지와 카테고리를 후기 API 데이터로 연동한다. 현재는 리스트와 동일한 카테고리 대체 아이콘을 표시한다. */}
            <div className="size-18 shrink-0 overflow-hidden rounded-2xl flex-center">
              <Icon
                name={CATEGORY_TILE_ICON_MAP.ELECTRONICS}
                size={72}
                className="text-labelsVibrant-quaternary"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1 text-neutral-normal-default">
              <p className="truncate text-h3-semibold">{t("foundItem.name")}</p>
              <p className="truncate text-body2-regular">{t("foundItem.meta")}</p>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[764px] border-t border-labelsVibrant-quaternary bg-white px-4 pb-[calc(32px+var(--safe-area-bottom))] pt-3">
        <Button variant="auth" disabled className="border border-white shadow-md">
          {t("chatButton")}
        </Button>
      </div>
    </div>
  );
};

export default ReviewLetterDetail;
