/**
 * 댓글 카드 컴포넌트에 쓰이는 타입입니다.
 *
 * @author suhyeon
 *
 * @param commentId - 댓글 카드 id
 * @param mentionUser - 댓글에서 언급한 유저 닉네임
 * @param comment - 댓글 내용
 * @param createdAt - 댓글 작성 날짜
 * @param like - 댓글의 좋아요 개수
 * @param thumbnailUrl - 댓글의 이미지 url
 *
 */

export type CommentCardType = {
  commentId: number;
  mentionUser?: string;
  comment: string;
  createdAt: string;
  like: number;
  thumbnailUrl?: string;
};
