"use client";

import { PostListItem, EmptyState, LoadingState } from "@/components";
import { UserCommentsDataType, UserPostsDataType, UserProfileItem } from "@/api/fetch/user";
import { UserProfileTabKey } from "../../_types/UserProfileTabType";
import { UserCommentItem } from "../_internal";

interface TabContentsProps {
  selectedTab: UserProfileTabKey;
  data?: UserProfileItem[];
  isLoading: boolean;
}

const TabContents = ({ selectedTab, data, isLoading }: TabContentsProps) => {
  if (isLoading) return <LoadingState />;
  if (!data) return null;

  return (
    <section aria-label="탭 콘텐츠">
      <ul>
        {selectedTab === "posts" &&
          (data.length === 0 ? (
            <li>
              <EmptyState
                icon={{ iconName: "NoPosts", iconSize: 70 }}
                title="아직 작성한 게시글이 없어요"
                description={"해당 유저가 작성한 게시글이 없습니다."}
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
                  title="아직 작성한 댓글이 없어요"
                  description={"아직 작성한 댓글이 없습니다.\n지금 바로 댓글을 남겨보세요!"}
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
                title="아직 즐겨찾기한 게시글이 없어요"
                description={"해당 유저가 즐겨찾기한 게시글이 없습니다."}
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
