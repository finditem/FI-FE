import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { ReviewListItem } from "@/api/fetch/review";
import { CategoryType, ItemStatus, PostType } from "@/types";

export interface GetUserProfileDataResponse extends ApiBaseResponseType<UserProfileIdDataType> {}

export interface UserProfileIdDataType {
  userId: number;
  nickname: string;
  profileImg: string;

  posts: Array<UserPostsDataType>;
  comments: Array<UserCommentsDataType>;
  favorites: Array<UserPostsDataType>;
  reviews: Array<ReviewListItem>;

  nextCursor?: number;
  hasNext?: boolean;
}

export interface UserPostsDataType {
  postId: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  address: string;
  itemStatus: ItemStatus;
  postType: PostType;
  category: CategoryType;
  favoriteCount: number;
  favoriteStatus: boolean;
  viewCount: number;
  createdAt: string;
  hot: boolean;
  new: boolean;
}

export interface UserCommentsDataType {
  commentId: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
}

export type UserProfileItem = UserPostsDataType | UserCommentsDataType | ReviewListItem;

export interface UserProfileInfiniteSelectedData {
  profile: {
    userId: number;
    nickname: string;
    profileImg: string;
  };
  list: UserProfileItem[];
}
