import { CommentItem } from "@/api/fetch/user";
import { Icon, ListItemImage } from "@/components/common";
import { cn, formatDate, highlightText } from "@/utils";
import Link from "next/link";

/**
 * 마이페이지 댓글 카드 컴포넌트입니다.
 *
 * @remarks
 * - 클릭 시 해당 댓글이 달린 상세 포스트 페이지로 이동합니다.
 * - 댓글 내용에 검색어가 포함된 경우 해당 텍스트를 강조(highlight)하여 표시됩니다.
 *
 * @author suhyeon
 */

interface CommentCardProps {
  /** 댓글 카드에 표시될 데이터 객체
   * (포스트 제목, 내용, 좋아요 수, 이미지 리스트, 생성일 등)
   */
  data: CommentItem;
  /** 검색 페이지에서 사용 시 강조할 키워드 */
  keyword?: string;
}

/**
 * @example
 * ```tsx
 * <CommentCard
 *   data={CommentItem}
 *   keyword={keyword}
 * >
 * ```
 */

const CommentCard = ({ data, keyword }: CommentCardProps) => {
  const {
    commentId,
    postId,
    postTitle,
    content,
    likeCount,
    imageList = [],
    createdAt,
    like,
  } = data;

  const firstImage = imageList?.[0];
  const imageUrl = firstImage?.imageUrl;

  return (
    <li>
      <Link
        href={`/list/${postId}`}
        className="flex w-full justify-between border-b border-divider-default px-5 py-[30px]"
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="w-full truncate">{keyword ? highlightText(content, keyword) : content}</p>

          <time dateTime={createdAt} className="mt-1 text-body2-regular text-layout-body-default">
            {formatDate(createdAt)}
          </time>

          <span className="mt-2 flex gap-1 text-body2-regular text-neutral-strong-placeholder">
            <Icon
              name="Heart"
              aria-label="좋아요"
              size={16}
              className={cn(like ? "text-system-favorite" : "text-border-divider-default")}
            />
            {likeCount}
          </span>
        </div>

        {imageUrl && <ListItemImage src={imageUrl} alt="댓글 이미지" size={90} />}
      </Link>
    </li>
  );
};

export default CommentCard;
