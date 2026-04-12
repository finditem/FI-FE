import { CommentItem } from "@/api/fetch/user";
import { Icon, ListItemImage } from "@/components/common";
import { cn, formatDate, highlightText } from "@/utils";
import Link from "next/link";

/**
 * @author suhyeon
 *
 * 댓글 카드 컴포넌트입니다.
 *
 * @param data - 댓글 카드 컴포넌트 데이터
 * @param keyword - 검색어
 *
 * @example
 * ```tsx
 * <CommentCard
 *   data={CommentItem}
 * >
 * ```
 */

interface CommentCardProps {
  data: CommentItem;
  keyword?: string;
}

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
