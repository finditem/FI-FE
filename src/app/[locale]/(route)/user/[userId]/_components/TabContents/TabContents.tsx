"use client";

import { useEffect, useState } from "react";
import { PostListItem, EmptyState, LoadingState, ReviewCard } from "@/components";
import { UserCommentsDataType, UserPostsDataType, UserProfileItem } from "@/api/fetch/user";
import { UserProfileTabKey } from "../../_types/UserProfileTabType";
import { UserCommentItem } from "../_internal";
import { MOCK_RECEIVED_REVIEWS } from "../../_constants/MOCK_RECEIVED_REVIEWS";
import { useTranslations } from "next-intl";

interface TabContentsProps {
  selectedTab: UserProfileTabKey;
  data?: UserProfileItem[];
  isLoading: boolean;
}

const TabContents = ({ selectedTab, data, isLoading }: TabContentsProps) => {
  const t = useTranslations("UserProfilePage");

  // 받은 후기 더미 데이터의 createdAt이 모듈 로드 시점 기준 상대 시각이라, 서버와 클라이언트
  // 렌더 시점이 달라지면 하이드레이션 에러가 난다. 마운트 이후에만 시간 의존 콘텐츠를 렌더한다.
  // TODO(수현): 받은 후기 API 연동 시 이 마운트 게이트를 쿼리의 isLoading으로 대체.
  const [isReviewsMounted, setIsReviewsMounted] = useState(false);
  useEffect(() => setIsReviewsMounted(true), []);

  if (selectedTab === "reviews") {
    if (!isReviewsMounted) return <LoadingState />;

    return (
      <section aria-label={t("tabContentAriaLabel")}>
        <ul>
          {MOCK_RECEIVED_REVIEWS.length === 0 ? (
            <li>
              <EmptyState
                icon={{ iconName: "ReceiveReview", iconSize: 70 }}
                title={t("empty.reviewsTitle")}
                description={t("empty.reviewsDescription")}
              />
            </li>
          ) : (
            MOCK_RECEIVED_REVIEWS.map((review) => (
              <ReviewCard key={review.id} data={review} showHideMenu={false} />
            ))
          )}
        </ul>
      </section>
    );
  }

  if (isLoading) return <LoadingState />;
  if (!data) return null;

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
      </ul>
    </section>
  );
};

export default TabContents;
