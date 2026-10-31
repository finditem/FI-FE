"use client";

import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ReviewDetailResponse } from "@/api/fetch/review";
import { Button, Icon, ProfileAvatar } from "@/components";
import { cn } from "@/utils";
import { formatReviewDateLabel } from "../../_utils/formatReviewDateLabel/formatReviewDateLabel";

interface ReviewLetterDetailProps {
  review: ReviewDetailResponse;
}

/**
 * 후기 편지 카드(발신자, 편지 본문, 도움 경험, 찾아준 물건, 채팅 이동 CTA)를 렌더합니다.
 *
 * @remarks
 * - 상세 후기 본문(content)이 없으면 편지 박스를 렌더하지 않습니다.
 * - 도움 경험(helpTypes)은 응답 순서대로 표시하며, 문구는 FE에서 i18n으로 매핑합니다.
 * - 발신자가 탈퇴했으면 기본 닉네임·기본 프로필로 대체합니다(프로필 이동 없음).
 * - 채팅 이동은 roomId가 있을 때만 활성화되고, 없으면 비활성화합니다.
 *
 * @author suhyeon
 */
const ReviewLetterDetail = ({ review }: ReviewLetterDetailProps) => {
  const t = useTranslations("ReviewDetailPage");
  const router = useRouter();
  const { author, content, helpTypes, post, roomId, createdAt } = review;

  const senderNickname =
    author.withdrawn || !author.nickname ? t("withdrawnUser") : author.nickname;
  const sentDateLabel = formatReviewDateLabel(createdAt);
  const lostDateLabel = formatReviewDateLabel(post.date);
  const foundItemMeta = lostDateLabel ? `${post.address} · ${lostDateLabel}` : post.address;

  const canMoveToChat = roomId !== null;
  const handleMoveToChat = () => {
    if (roomId === null) return;
    router.push(`/chat/${post.postId}?roomId=${roomId}`);
  };

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
              <ProfileAvatar src={author.profileImageUrl} size={60} alt={senderNickname} />
              <span className="absolute -bottom-0.5 -right-0.5 size-[18px] rounded-full border-2 border-white bg-fill-brand-strong-default flex-center">
                <Icon name="SendReviewArrow" size={9} className="text-white" />
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-body1-regular font-bold text-layout-header-default">
                {senderNickname}
              </p>
              <div className="flex items-center gap-3 text-body2-regular">
                <p className="text-layout-body-default">{post.address}</p>
                {sentDateLabel && (
                  <time
                    dateTime={createdAt}
                    className="text-body2-semibold text-labelsVibrant-secondary"
                  >
                    {sentDateLabel}
                  </time>
                )}
              </div>
            </div>
          </div>

          {content && (
            <p className="whitespace-pre-line rounded-xl px-4 py-5 text-body1-regular leading-[1.88] text-labelsVibrant-primary bg-fill-brand-subtle-default_2">
              {content}
            </p>
          )}

          <section className="flex flex-col gap-3" aria-labelledby={`strengths-${review.reviewId}`}>
            <h2
              id={`strengths-${review.reviewId}`}
              className="text-body2-semibold text-labelsVibrant-secondary"
            >
              {t("strengths.title")}
            </h2>
            <ul className="flex flex-col gap-3">
              {helpTypes.map((helpType) => (
                <li
                  key={helpType}
                  className="flex items-center gap-2 text-body1-medium text-labelsVibrant-primary"
                >
                  <span
                    aria-hidden
                    className="size-5 shrink-0 rounded-full bg-fill-brand-normal-default flex-center"
                  >
                    <Icon name="Check" size={12} />
                  </span>
                  <span>{t(`helpTypes.${helpType}`)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-labelsVibrant-quaternary" />

        <section className="flex flex-col gap-3" aria-labelledby={`found-item-${review.reviewId}`}>
          <h2
            id={`found-item-${review.reviewId}`}
            className="text-body2-semibold text-labelsVibrant-secondary"
          >
            {t("foundItem.title")}
          </h2>
          <div className="flex items-center gap-4">
            <div className="size-18 shrink-0 overflow-hidden rounded-2xl bg-fill-flatGray-25 flex-center">
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl}
                  alt=""
                  aria-hidden
                  width={72}
                  height={72}
                  className="size-full object-cover"
                />
              ) : (
                <Icon name="Etc" size={36} className="text-labelsVibrant-quaternary" />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1 text-neutral-normal-default">
              <p className="truncate text-h3-semibold">{post.title}</p>
              <p className="truncate text-body2-regular">{foundItemMeta}</p>
            </div>
          </div>
        </section>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[764px] border-t border-labelsVibrant-quaternary bg-white px-4 pb-[calc(32px+var(--safe-area-bottom))] pt-3">
        <Button
          variant="auth"
          disabled={!canMoveToChat}
          onClick={handleMoveToChat}
          className="border border-white shadow-md"
        >
          {t("chatButton")}
        </Button>
      </div>
    </div>
  );
};

export default ReviewLetterDetail;
