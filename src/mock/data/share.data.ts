import type { MetaDataItemWithLink } from "@/types/MetaDataType";
import type { buildDetailMetadata } from "@/utils/buildDetailMetadata/buildDetailMetadata";

/** 네이티브 공유(shareWithNative) 테스트용 메타데이터. Web Share API는 썸네일을 쓰지 않아 제외한다. */
export const MOCK_NATIVE_SHARE_META_DATA: Omit<MetaDataItemWithLink, "thumbnailUrl"> = {
  title: "제목",
  summary: "요약",
  link: "https://example.com",
  likeCount: 0,
  commentCount: 0,
  viewCount: 0,
};

/** 상세 페이지 공유 카드 메타데이터(buildDetailMetadata) 테스트용 입력값. 기본 로케일(ko) 게시글 상세를 가정한다. */
export const MOCK_DETAIL_METADATA_PARAMS: Parameters<typeof buildDetailMetadata>[0] = {
  locale: "ko",
  path: "/list/1",
  title: "지갑 분실",
  description: "명동에서 지갑을 잃어버렸어요",
  imageUrl: "https://example.com/wallet.png",
};
