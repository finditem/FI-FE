import { ReportByIdType } from "@/api/fetch/report";
import { Chip, ProfileAvatar } from "@/components";
import { cn, formatDate } from "@/utils";
import Image from "next/image";

const ReportCommentItem = ({ data }: { data: ReportByIdType }) => {
  const {
    answered,
    adminAnswer,
    adminNickname,
    adminProfileImg,
    answerImageList,
    resolvedAt,
    createdAt,
  } = data;

  const displayDate = resolvedAt || createdAt;

  return (
    <article
      className={cn(
        "flex flex-col gap-2 border-b border-neutral-normal-default px-5 py-9",
        answered && "bg-fill-neutral-strong-default"
      )}
    >
      <header className="flex gap-[14px]">
        <ProfileAvatar src={adminProfileImg} size={30} />

        <span className="flex flex-col gap-[2px]">
          <span className="flex gap-[6px]">
            {answered && <Chip label="관리자" type="admin" />}
            <span className="text-body1-medium text-layout-header-default">{adminNickname}</span>
          </span>

          {displayDate && (
            <time dateTime={displayDate} className="text-body2-regular text-layout-body-default">
              {formatDate(displayDate)}
            </time>
          )}
        </span>
      </header>

      <p className="text-body1-regular text-layout-header-default">{adminAnswer}</p>
      {answerImageList && answerImageList.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {answerImageList.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-square w-[100px] overflow-hidden rounded-lg border border-divider-default"
            >
              <Image
                src={src}
                alt={`첨부 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default ReportCommentItem;
