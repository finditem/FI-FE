import { ApiBaseResponseType } from "@/api/_base/types/ApiBaseResponseType";
import { CategoryType, ItemStatus, PostType, Radius } from "@/types";

export interface GetDetailPostResponse extends ApiBaseResponseType<PostDetailData> {}

export type PostDetailData = {
  id: number;
  title: string;
  content: string;
  address: string;
  latitude: number;
  longitude: number;
  postType: PostType;
  postStatus: ItemStatus;
  radius: Radius;
  category: CategoryType;
  favoriteCount: number;
  favoriteStatus: boolean;
  viewCount: number;
  isNew: boolean;
  isHot: boolean;
  createdAt: string;
  isMine: boolean;
  imageResponseList: ImageResponse[];
  postUserInformation: userInformation;
  /** 수정 제한 정책 상태. 백엔드 계약 확정 전까지는 optional로 둔다. */
  editRestriction?: PostEditRestriction;
};

export type PostEditRestriction = {
  /** 최근 1분 내 남은 수정 가능 횟수 */
  remainingCount: number;
  /** 3분 수정 제한이 걸려 있는지 여부 */
  isRestricted: boolean;
  /** 제한 해제 시각(ISO 8601). isRestricted가 true일 때만 값이 존재한다. */
  unlockAt: string | null;
};

export type ImageType = "THUMBNAIL" | "NORMAL";

export type ImageResponse = {
  id: number;
  imgUrl: string;
  imageType: ImageType;
};

export interface userInformation {
  userId: number;
  nickName: string;
  profileImage: string;
  postCount: number;
  chattingCount: number;
}
