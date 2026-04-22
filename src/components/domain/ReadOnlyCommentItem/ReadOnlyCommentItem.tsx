import Image from "next/image";
import { cn, formatDate } from "@/utils";
import { ProfileAvatar, Chip } from "@/components/common";
import { ReadOnlyCommentItemProps } from "@/types";

/**
 * 읽기 전용 댓글 아이템 컴포넌트입니다.
 *
 * @remarks
 * - 좋아요, 신고, 삭제 등 액션 버튼이 없습니다.
 * - 관리자 페이지, 마이페이지 등 뷰 전용 댓글 목록에서 사용됩니다.
 *
 * @param data - 댓글 데이터
 * @param images - 댓글에 첨부된 이미지 URL 목록
 *
 * @author jikwon
 */

/**
 * @example
 * ```tsx
 * <ReadOnlyCommentItem data={data} />
 * <ReadOnlyCommentItem data={data} images={["https://..."]} />
 * ```
 */

const ReadOnlyCommentItem = ({
  data,
  images,
}: {
  data: ReadOnlyCommentItemProps;
  images?: string[];
}) => {
  const { isAdmin, userImageUrl, userName, content, createdAt } = data;

  return (
    <li className="after:block after:border-b after:border-flatGray-50 after:content-['']">
      <article
        className={cn(
          "flex flex-col gap-2 px-5 py-9",
          isAdmin ? "bg-fill-neutral-strong-default" : "bg-white"
        )}
      >
        <div className="flex items-center gap-[14px]">
          <ProfileAvatar src={userImageUrl} alt={userName} size={30} />
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-[6px]">
              {isAdmin && <Chip label="관리자" type="admin" />}
              <p className="text-body1-medium text-layout-header-default">{userName}</p>
            </div>
            <time dateTime={createdAt} className="text-body2-regular text-layout-body-default">
              {formatDate(createdAt)}
            </time>
          </div>
        </div>
        <p className="whitespace-pre-wrap break-words text-body1-regular text-layout-header-default">
          {content}
        </p>
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((image) => (
              <Image
                key={image}
                src={image}
                alt={image}
                width={100}
                height={100}
                className="size-[100px] select-none rounded-lg"
              />
            ))}
          </div>
        )}
      </article>
    </li>
  );
};

export default ReadOnlyCommentItem;
