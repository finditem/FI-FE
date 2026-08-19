"use client";

import { PostListItem, EmptyState, LoadingState } from "@/components";
import { UserCommentsDataType, UserPostsDataType, UserProfileItem } from "@/api/fetch/user";
import { UserProfileTabKey } from "../../_types/UserProfileTabType";
import { UserCommentItem } from "../_internal";
import { useTranslations } from "next-intl";

interface TabContentsProps {
  selectedTab: UserProfileTabKey;
  data?: UserProfileItem[];
  isLoading: boolean;
}

const TabContents = ({ selectedTab, data, isLoading }: TabContentsProps) => {
  const t = useTranslations("UserProfilePage");

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
