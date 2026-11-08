"use client";

import { PostListItem, EmptyState, LoadingState, ReviewCard } from "@/components";
import { UserCommentsDataType, UserPostsDataType, UserProfileItem } from "@/api/fetch/user";
import type { ReviewHelpType, ReviewListItem } from "@/api/fetch/review";
import type { ReviewCardData } from "@/types";
import { UserProfileTabKey } from "../../_types/UserProfileTabType";
import { UserCommentItem } from "../_internal";
import { useTranslations } from "next-intl";

interface TabContentsProps {
  selectedTab: UserProfileTabKey;
  data?: UserProfileItem[];
  isLoading: boolean;
}

const HELP_TYPE_LABEL_KEYS: Record<ReviewHelpType, string> = {
  KIND_AND_WARM: "helpItems.kind",
  TRUSTWORTHY_COMMUNICATION: "helpItems.trustworthy",
  QUICK_RESPONSE: "helpItems.quickResponse",
  SAFE_STORAGE: "helpItems.safeKeeping",
  USEFUL_INFORMATION: "helpItems.helpfulInfo",
};

const TabContents = ({ selectedTab, data, isLoading }: TabContentsProps) => {
  const t = useTranslations("UserProfilePage");

  if (isLoading) return <LoadingState />;
  if (!data) return null;

  const toReviewCardData = (review: ReviewListItem): ReviewCardData => ({
    id: review.reviewId,
    avatarUrl: review.user.profileImageUrl,
    nickname: review.user.nickname ?? t("withdrawnUser"),
    createdAt: review.createdAt,
    content: review.content,
    tagLabel: t(HELP_TYPE_LABEL_KEYS[review.helpTypes[0]]),
    extraTagCount: Math.max(review.helpTypes.length - 1, 0),
  });

  return (
    <section aria-label={t("tabContentAriaLabel")}>
      <ul>
        {selectedTab === "posts" &&
          (data.length === 0 ? (
            <li>
              <EmptyState
                icon={{ iconName: "NoPosts", iconSize: 70 }}
                title={t("empty.postsTitle")}
                description={t("empty.postsDescription")}
              />
            </li>
          ) : (
            data.map((post) => {
              const p = post as UserPostsDataType & { id?: number };
              return <PostListItem post={p} linkState="list" key={`post-${p.postId ?? p.id}`} />;
            })
          ))}

        {selectedTab === "comments" &&
          (() => {
            const comments = data as UserCommentsDataType[];

            return comments.length === 0 ? (
              <li>
                <EmptyState
                  icon={{ iconName: "NoComments", iconSize: 70 }}
                  title={t("empty.commentsTitle")}
                  description={t("empty.commentsDescription")}
                />
              </li>
            ) : (
              comments.map((comment) => {
                const c = comment as UserCommentsDataType & { id?: number };
                return <UserCommentItem key={`comment-${c.commentId ?? c.id}`} data={c} />;
              })
            );
          })()}

        {selectedTab === "favorites" &&
          (data.length === 0 ? (
            <li>
              <EmptyState
                icon={{ iconName: "EmptyFavorite", iconSize: 70 }}
                title={t("empty.favoritesTitle")}
                description={t("empty.favoritesDescription")}
              />
            </li>
          ) : (
            data.map((post) => {
              const p = post as UserPostsDataType & { id?: number };
              return (
                <PostListItem post={p} linkState="list" key={`favorite-${p.postId ?? p.id}`} />
              );
            })
          ))}

        {selectedTab === "reviews" &&
          (() => {
            const reviews = data as ReviewListItem[];

            return reviews.length === 0 ? (
              <li>
                <EmptyState
                  icon={{ iconName: "ReceiveReview", iconSize: 70 }}
                  title={t("empty.reviewsTitle")}
                  description={t("empty.reviewsDescription")}
                />
              </li>
            ) : (
              reviews.map((review) => (
                <ReviewCard
                  key={review.reviewId}
                  data={toReviewCardData(review)}
                  showHideMenu={false}
                />
              ))
            );
          })()}
      </ul>
    </section>
  );
};

export default TabContents;
