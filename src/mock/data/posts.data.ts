import { GetDetailPostResponse, PostItem, SimilarDataItem } from "@/api/fetch/post";
import { PostMetaDataItemWithLink } from "@/types";

export const MOCK_POST_ITEM: PostItem = {
  id: 1,
  title: "아이폰 15 분실",
  summary: "서울 노원구 상계동 근처에서 아이폰을 잃어버렸습니다.",
  thumbnailImageUrl: "https://picsum.photos/400/300?random=1",
  address: "서울시 노원구 상계동",
  postStatus: "SEARCHING" as const,
  postType: "LOST" as const,
  category: "ELECTRONICS" as const,
  favoriteCount: 0,
  favoriteStatus: false,
  viewCount: 2,
  createdAt: "2025-12-26 10:22:58",
  isNew: false,
  isHot: false,
  imageCount: 1,
};

export const MOCK_POST_ITEMS: PostItem[] = [MOCK_POST_ITEM];

export const MOCK_POST_DEFAULT_DETAIL: GetDetailPostResponse = {
  isSuccess: true,
  code: "COMMON200",
  message: "성공입니다.",
  result: {
    id: 2,
    title: "홍대입구역 8번 출구 앞에서 검정 지갑 발견",
    content:
      "검정색 반지갑을 발견했습니다. 안에 카드/신분증이 일부 들어있습니다. 본인 확인 후 전달드릴게요.",
    address: "서울특별시 마포구 양화로 160",
    latitude: 37.5565,
    longitude: 126.9239,
    postType: "FOUND",
    postStatus: "FOUND",
    imageResponseList: [
      { id: 1, imgUrl: "https://picsum.photos/400/300?random=2", imageType: "NORMAL" },
    ],
    radius: 1000,
    category: "WALLET",
    favoriteCount: 0,
    favoriteStatus: false,
    viewCount: 0,
    createdAt: "2025-12-26T10:22:58",
    date: "2025-12-25T18:40:00",
    isNew: false,
    isHot: false,
    isMine: false,
    postUserInformation: {
      userId: 1,
      nickName: "사용자 닉네임",
      profileImage: "",
      postCount: 4,
      chattingCount: 0,
    },
  },
};

export const MOCK_SIMILAR_POST_ITEMS: SimilarDataItem = {
  postId: 1,
  title: "아이폰 15 분실",
  thumbnailImageUrl: "https://picsum.photos/400/300?random=1",
  address: "서울시 노원구 상계동",
  category: "ELECTRONICS" as const,
  favoriteCount: 0,
  favoriteStatus: false,
  viewCount: 2,
  createdAt: "2026-02-15T10:30:00",
};

export const MOCK_POST_META_DATA: PostMetaDataItemWithLink = {
  title: "제목",
  summary: "설명",
  thumbnailUrl: "https://example.com/image.png",
  link: "https://example.com",
  address: "주소",
  likeCount: 1,
  commentCount: 1,
  viewCount: 1,
};
