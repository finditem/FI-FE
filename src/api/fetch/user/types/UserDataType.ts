export interface UserDataType {
  userId: string;
  email: string;
  emailVerified: boolean;
  profileImg: string;
}

export type UserTabType = "posts" | "comments" | "favorites" | "reviews";
export type UserUpperTabType = "POSTS" | "COMMENTS" | "FAVORITES" | "REVIEWS";
