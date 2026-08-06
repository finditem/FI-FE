import Link from "next/link";
import { Badge, Icon, ListItemImage } from "@/components";
import { formatDate } from "@/utils";
import { NoticeItem } from "@/api/fetch/notice";

interface AdminListItemProps {
  data: NoticeItem;
  imageAlt: string;
  link: string;
}

const AdminListItem = ({ data, imageAlt, link }: AdminListItemProps) => {
  const { title, viewCount, createdAt, likeCount, isNew, isHot, thumbnailUrl } = data;

  const viewItem = [
    {
      icon: "Like",
      count: likeCount,
    },
    {
      icon: "Eye",
      count: viewCount,
    },
  ] as const;

  return (
    <li>
      <Link
        href={link}
        className="duration-130 flex w-full cursor-pointer items-center gap-[14px] border-b border-b-flatGray-50 px-5 py-[30px] transition-colors hover:bg-flatGray-25"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              {isNew && <Badge variant="new" />}
              {isHot && <Badge variant="hot" />}
              <h2 className="flex-1 text-h3-semibold text-layout-header-default u-ellipsis">
                {title}
              </h2>
            </div>
            <span className="text-body2-regular text-layout-body-default">
              <time dateTime={createdAt}>{formatDate(createdAt)}</time>
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            {viewItem.map((item) => (
              <span
                key={item.icon}
                className="flex items-center gap-1 text-body2-regular text-neutral-strong-placeholder"
              >
                <Icon name={item.icon} size={16} />
                {item.count}
              </span>
            ))}
          </div>
        </div>

        <ListItemImage src={thumbnailUrl} alt={imageAlt} size={90} />
      </Link>
    </li>
  );
};

export default AdminListItem;
