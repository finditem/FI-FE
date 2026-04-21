import Link from "next/link";
import { PostItem } from "@/api/fetch/post";
import { Badge, Chip, Icon, ListItemImage } from "@/components/common";
import { cn, formatDate, getItemCategoryLabel, getItemStatusLabel, highlightText } from "@/utils";

/**
 * 게시글 목록의 개별 아이템 컴포넌트입니다.
 *
 * @remarks
 * - `linkState`에 따라 분실/발견 목록(`/list/:id`) 또는 공지사항(`/notice/:id`)으로 링크됩니다.
 * - `keyword`가 있으면 제목과 요약 내 일치 텍스트를 하이라이트합니다.
 *
 * @author jikwon
 */

interface PostListItemProps {
  /** 게시글 데이터. 각 페이지에 맞는 타입으로 확장해주세요. */
  post: PostItem | any;
  /** 링크 이동 방식 (default: 'list') */
  linkState?: "notice" | "list";
  /** 검색 키워드. 제목 및 요약에 하이라이트 처리됩니다. */
  keyword?: string;
}

/**
 * @example
 * ```tsx
 * <PostListItem post={post} />
 * <PostListItem post={post} linkState="notice" keyword="지갑" />
 * ```
 */

const PostListItem = ({ post, linkState = "list", keyword }: PostListItemProps) => {
  const { id, postStatus, category, createdAt, isNew, isHot, imageCount } = post;
  const isFound = postStatus === "FOUND";

  const VIEW_ITEM = [
    {
      icon: "Star",
      count: post.favoriteCount,
      iconColor: post.favoriteStatus ? "text-system-bookmark" : "text-labelsVibrant-quaternary",
    },
    {
      icon: "Eye",
      count: post.viewCount,
      iconColor: "text-labelsVibrant-quaternary",
    },
  ] as const;

  return (
    <li>
      <Link
        href={linkState === "list" ? `/list/${id}` : `/notice/${id}`}
        className={cn(
          "flex w-full items-center gap-[14px] px-5 py-[30px]",
          "border-b border-b-flatGray-50 transition-colors",
          isFound ? "bg-fill-neutral-strong-default" : "hover:bg-flatGray-25"
        )}
      >
        <div className="min-w-0 flex-1">
          {linkState === "list" && (
            <div className="mb-2 flex gap-2">
              <Chip
                label={getItemStatusLabel(postStatus)}
                type={isFound ? "toast" : "brandSubtle"}
              />
              <Chip
                label={getItemCategoryLabel(category)}
                type={isFound ? "neutralDisabled" : "neutralStrong"}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="w-full">
              <div className="flex items-center gap-1">
                {isNew && <Badge variant="new" />}
                {isHot && <Badge variant="hot" />}
                <h2
                  className={cn(
                    "flex-1 text-h3-semibold text-layout-header-default u-ellipsis",
                    isFound && "text-neutral-normal-disabled"
                  )}
                >
                  {keyword ? highlightText(post.title, keyword) : post.title}
                </h2>
              </div>
              <span
                className={cn(
                  "text-body2-regular text-layout-body-default",
                  isFound && "text-neutral-normal-disabled"
                )}
              >
                <span className="after:inline-block after:px-1 after:content-['·']">
                  {post.address || "위치 정보가 이상해요."}
                </span>
                <time dateTime={createdAt}>{formatDate(createdAt)}</time>
              </span>
            </div>
            <p
              className={cn(
                "w-full text-body2-medium text-neutral-normal-default u-ellipsis",
                isFound && "text-neutral-normal-disabled"
              )}
            >
              {keyword ? highlightText(post.summary, keyword) : post.summary}
            </p>
          </div>
          <div className="mt-2 flex gap-2">
            {VIEW_ITEM.map((item) => (
              <span
                key={item.icon}
                className="flex items-center gap-1 text-body2-regular text-neutral-strong-placeholder"
              >
                <Icon name={item.icon} size={16} className={item.iconColor} />
                {item.count}
              </span>
            ))}
          </div>
        </div>

        <ListItemImage
          src={post.thumbnailImageUrl}
          alt="게시글 대표 이미지"
          size={90}
          category={category}
          imageCount={imageCount}
        />
      </Link>
    </li>
  );
};

export default PostListItem;
