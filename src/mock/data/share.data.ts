import type { MetaDataItemWithLink } from "@/types/MetaDataType";

/** 네이티브 공유(shareWithNative) 테스트용 메타데이터. Web Share API는 썸네일을 쓰지 않아 제외한다. */
export const MOCK_NATIVE_SHARE_META_DATA: Omit<MetaDataItemWithLink, "thumbnailUrl"> = {
  title: "제목",
  summary: "요약",
  link: "https://example.com",
  likeCount: 0,
  commentCount: 0,
  viewCount: 0,
};
