import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType, ItemStatus, PostType } from "@/types";

export interface NearbyPostSummary {
  postId: number;
  title: string;
  summary: string;
  thumbnailImageUrl: string;
  address: string;
  postStatus: ItemStatus;
  postType: PostType;
  category: CategoryType;
  favoriteCount: number;
  favoriteStatus: boolean;
  viewCount: number;
  createdAt: string;
  imageCount: number;
}

export interface NearbyPostResult {
  posts: NearbyPostSummary[];
  hasNext: boolean;
  nextDistance: number | null;
  nextPostId: number | null;
}

export type NearbyPostResponse = ApiBaseResponseType<NearbyPostResult>;

export interface NearbyPostFilter {
  postType?: PostType;
  category?: CategoryType;
}
