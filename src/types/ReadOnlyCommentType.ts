/**
 * 읽기 전용 댓글 아이템의 타입 정의입니다.
 * 관리자, 마이페이지 등 댓글 목록에서 사용됩니다.
 *
 * @author jikwon
 */

export interface ReadOnlyCommentItemProps {
  /** 관리자 여부 */
  isAdmin: boolean;
  /** 작성자 프로필 이미지 URL */
  userImageUrl: string;
  /** 작성자 이름 */
  userName: string;
  /** 댓글 내용 */
  content: string;
  /** 댓글 작성 시간 */
  createdAt: string;
}
