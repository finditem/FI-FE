import { PostMetaDataItem } from "@/api/fetch/post";

/**
 * 공유 및 메타데이터와 관련된 타입 정의입니다.
 * 공지사항/게시글 메타데이터 호환 가능합니다.
 *
 * @author jikwon
 * @author hyungjun
 */

/** 링크가 포함된 게시글 메타데이터 */
export type PostMetaDataItemWithLink = PostMetaDataItem & {
  link: string;
};

/**
 * 공유 방식 식별자
 * - kakao: 카카오 공유 SDK
 * - native: Web Share API
 * - copy: 클립보드 링크 복사
 */

export type ShareId = "kakao" | "native" | "copy";

export interface MetaDataItem {
  /** 제목 */
  title: string;
  /** 요약 내용 */
  summary: string;
  /** 썸네일 이미지 URL */
  thumbnailUrl?: string;
  /** 주소 */
  address?: string;
  /** 좋아요 수 */
  likeCount: number;
  /** 댓글 수 */
  commentCount: number;
  /** 조회수 */
  viewCount: number;
}

/** 링크가 포함된 메타데이터 (공지사항/게시글 호환) */
export type MetaDataItemWithLink = MetaDataItem & {
  link: string;
};

/**
 * 카카오 공유 템플릿 타입
 * - feed: 피드 템플릿
 * - location: 위치 템플릿
 */

export type ObjectType = "feed" | "location";
