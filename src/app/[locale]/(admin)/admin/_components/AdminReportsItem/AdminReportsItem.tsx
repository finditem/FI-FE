import Link from "next/link";
import { cn, formatDate } from "@/utils";
import { AdminReportsItemData } from "../../_types";

interface AdminReportsItemProps {
  data: AdminReportsItemData;
}

const AdminReportsItem = ({ data }: AdminReportsItemProps) => {
  const { href, processStatus, answerStatus, title, nickname, createdAt, content } = data;

  return (
    <li className="transition-colors after:block after:border-b after:border-divider-default after:content-[''] hover:bg-flatGray-25">
      <Link href={href} className="block space-y-2 px-5 py-[30px]">
        <div className="flex gap-2 text-caption1-semibold">
          {processStatus && (
            <span className={cn("rounded-full px-3 py-1", processStatus.className)}>
              {processStatus.label}
            </span>
          )}

          {answerStatus && (
            <span className={cn("rounded-full px-3 py-1", answerStatus.className)}>
              {answerStatus.label}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="truncate text-h3-semibold text-layout-header-default">{title}</h2>

          <div className="text-body2-regular text-layout-body-default">
            <span className="after:mx-[2px] after:content-['·']">{nickname}</span>
            <span>{formatDate(createdAt)}</span>
          </div>

          <p className="truncate text-body2-regular text-neutral-normal-default">{content}</p>
        </div>
      </Link>
    </li>
  );
};

export default AdminReportsItem;
