/**
 * 댓글과 관련된 타입 정의입니다.
 *
 * @author jikwon
 */

export interface CommentItemType {
  /** 댓글 고유 아이디 */
  id: number;
  /** 댓글 삭제 여부 */
  deleted: boolean;
  /** 댓글 깊이 */
  depth: number;
  /** 댓글 내용 */
  content: string;
  /** 댓글 작성 시간 */
  createdAt: string;
  /** 댓글 작성자 정보 */
  authorResponse: AuthorResponse;
  /** 대댓글 개수 */
  childCommentCount: number;
  /** 댓글 이미지 리스트 */
  imageList: ImageList[];
  /** 좋아요 수 */
  likeCount: number;
  /** 좋아요 여부 */
  isLike: boolean;
  /** 수정 가능 여부 */
  canEdit: boolean;
  /** 삭제 가능 여부 */
  canDelete: boolean;
}

export interface AuthorResponse {
  /** 작성자 고유 아이디 */
  userId: number;
  /** 작성자 닉네임 */
  nickName: string;
  /** 작성자 프로필 이미지 URL */
  profileImage: string;
}

export interface ImageList {
  /** 이미지 고유 아이디 */
  id: number;
  /** 이미지 URL */
  imageUrl: string;
}
