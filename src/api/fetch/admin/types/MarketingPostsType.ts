import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType, ItemStatus, PostType } from "@/types";

export interface GetMarketingPostsResponse extends ApiBaseResponseType<MarketingPostsResult> {}

export interface MarketingPostsResult {
  postList: AdminMarketingPostItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface AdminMarketingPostItem {
  id: number;
  title: string;
  postStatus: ItemStatus;
  category: CategoryType;
  createdAt: string;
  postType: PostType;
  favoriteCount: number;
  viewCount: number;
  summary?: string;
  thumbnailImageUrl?: string;
  address?: string;
  favoriteStatus?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  imageCount?: number;
}
