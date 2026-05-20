import Link from "next/link";
import { Icon } from "@/components";
import { UserCommentsDataType } from "@/api/fetch/user";
import { formatDate } from "@/utils";

interface NormalizedCommentItem {
  postId: number;
  comment: string;
  date: string;
  likes: number;
}

const normalizeCommentData = (
  data: UserCommentItemType | UserCommentsDataType
): NormalizedCommentItem => {
  if ("comment" in data) {
    return {
      postId: data.postId,
      comment: data.comment,
      date: data.date,
      likes: data.likes,
    };
  }

  return {
    postId: data.postId,
    comment: data.content,
    date: data.createdAt,
    likes: 0,
  };
};

interface UserCommentItemType {
  postId: number;
  comment: string;
  date: string;
  likes: number;
}

interface UserCommentItemProps {
  data: UserCommentItemType | UserCommentsDataType;
}
const UserCommentItem = ({ data }: UserCommentItemProps) => {
  const { postId, comment, date, likes } = normalizeCommentData(data);

  return (
    <li className="border-b border-divider-default px-5 py-[30px] transition-colors hover:bg-flatGray-25">
      <Link href={`/list/${postId}`} className="flex w-full flex-col items-start gap-2">
        <p className="line-clamp-1 w-full text-body1-semibold text-layout-header-default">
          {comment}
        </p>
        <time className="text-body2-regular text-layout-body-default" dateTime={date}>
          {formatDate(date)}
        </time>
        <div
          aria-label={`좋아요 ${likes}개`}
          className="flex items-center gap-1 text-body2-regular text-neutral-strong-placeholder"
        >
          <Icon name="Heart" size={16} className="text-border-divider-default" />
          <span>좋아요 {likes}</span>
        </div>
      </Link>
    </li>
  );
};

export default UserCommentItem;
