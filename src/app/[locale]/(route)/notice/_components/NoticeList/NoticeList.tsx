import { Badge, Icon, ListItemImage, EmptyState } from "@/components";
import Link from "next/link";
import { NoticeItem } from "@/api/fetch/notice";
import { formatDate, highlightText } from "@/utils";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const NoticeListItem = ({ notice }: { notice: NoticeItem }) => {
  const t = useTranslations("NoticePage.list");
  const { noticeId, title, createdAt, likeCount, viewCount, thumbnailUrl, isNew, isHot } = notice;
  const keyword = useSearchParams()?.get("keyword") || "";

  return (
    <li>
      <Link
        href={`/notice/${noticeId}`}
        className="flex min-w-0 items-center justify-between gap-2 border-b border-divider-default px-5 py-[30px] transition-colors hover:bg-flatGray-25"
      >
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col gap-[3px]">
            <div className="flex items-center gap-1">
              <div className="flex flex-shrink-0 gap-1">
                {isNew && <Badge variant="new" />}
                {isHot && <Badge variant="hot" />}
              </div>
              <p className="truncate text-body1-semibold text-layout-header-default">
                {highlightText(title, keyword)}
              </p>
            </div>
            <time className="text-body2-regular text-layout-body-default">
              {formatDate(createdAt)}
            </time>
          </div>

          <div className="flex items-center gap-1 text-body2-regular text-neutral-strong-placeholder">
            <Icon name="Like" size={16} className="text-border-divider-default" />
            <span>{likeCount}</span>
            <Icon name="Eye" size={16} className="text-border-divider-default" />
            <span>{viewCount}</span>
          </div>
        </div>

        {thumbnailUrl && (
          <div className="flex-shrink-0">
            <ListItemImage src={thumbnailUrl} alt={t("thumbnailAlt")} size={90} />
          </div>
        )}
      </Link>
    </li>
  );
};

const NoticeList = ({ notices }: { notices: NoticeItem[] }) => {
  const t = useTranslations("NoticePage.list");
  if (notices.length === 0)
    return (
      <EmptyState
        icon={{ iconName: "NoInquiries", iconSize: 70 }}
        title={t("emptyTitle")}
        description={t("emptyDescription")}
      />
    );

  return (
    <ul>
      {notices.map((notice) => (
        <NoticeListItem key={notice.noticeId} notice={notice} />
      ))}
    </ul>
  );
};

export default NoticeList;
