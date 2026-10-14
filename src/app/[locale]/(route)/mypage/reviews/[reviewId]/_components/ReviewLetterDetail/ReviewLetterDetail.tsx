import { getTranslations } from "next-intl/server";
import { Button, Icon, ProfileAvatar } from "@/components";
import { CATEGORY_TILE_ICON_MAP } from "@/constants";

interface ReviewLetterDetailProps {
  reviewId: number;
}

const ReviewLetterDetail = async ({ reviewId }: ReviewLetterDetailProps) => {
  const t = await getTranslations("ReviewDetailPage");
  const strengths = [t("strengths.kind"), t("strengths.trust"), t("strengths.quick")];

  return (
    <main className="flow-root bg-white pb-[calc(116px+var(--safe-area-bottom))]">
      <section className="relative z-10 mx-5 -mt-[38px] mb-6 flex flex-col gap-8 rounded-[16px] bg-white px-4 py-6 shadow-[0px_0px_1px_rgba(0,0,0,0.05),0px_4px_4px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <ProfileAvatar size={60} alt={t("sender.nickname")} />
              <span className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full border-2 border-white bg-fill-brand-strong-default">
                <Icon name="SendReview" size={9} className="text-white" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-body1-bold text-layout-header-default">{t("sender.nickname")}</p>
              <div className="flex items-center gap-3 text-body2-regular">
                <p className="text-layout-body-default">{t("sender.location")}</p>
                <time
                  dateTime="2026-07-22"
                  className="text-body2-semibold text-labelsVibrant-secondary"
                >
                  {t("sender.date")}
                </time>
              </div>
            </div>
          </div>

          <p className="whitespace-pre-line rounded-[12px] px-4 py-5 text-letter-regular text-labelsVibrant-primary bg-fill-brand-subtle-default_2">
            {t("letter")}
          </p>

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
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fill-brand-normal-default"
                  >
                    <Icon name="Check" size={12} />
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-[#e4e4e4]" />

        <section className="flex flex-col gap-3" aria-labelledby={`found-item-${reviewId}`}>
          <h2
            id={`found-item-${reviewId}`}
            className="text-body2-semibold text-labelsVibrant-secondary"
          >
            {t("foundItem.title")}
          </h2>
          <div className="flex items-center gap-4">
            {/* TODO(suhyeon): 찾아준 물건 이미지와 카테고리를 후기 API 데이터로 연동. 현재는 리스트(ListItemImage)와 동일한 카테고리 대체 아이콘 */}
            <div className="flex size-[69px] shrink-0 items-center justify-center overflow-hidden rounded-[16px]">
              <Icon
                name={CATEGORY_TILE_ICON_MAP.ELECTRONICS}
                size={69}
                className="text-labelsVibrant-quaternary"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate text-h3-semibold text-neutral-normal-default">
                {t("foundItem.name")}
              </p>
              <p className="truncate text-body2-regular text-neutral-normal-default">
                {t("foundItem.meta")}
              </p>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[764px] border-t border-[#e4e4e4] bg-white px-4 pb-[calc(32px+var(--safe-area-bottom))] pt-3">
        <Button
          variant="auth"
          className="!h-12 border border-white shadow-[0px_0px_1px_rgba(0,0,0,0.05),0px_4px_4px_rgba(0,0,0,0.08)]"
        >
          {t("chatButton")}
        </Button>
      </div>
    </main>
  );
};

export default ReviewLetterDetail;
