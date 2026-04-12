import Link from "next/link";
import Image from "next/image";
import { SimilarDataItem } from "@/api/fetch/post";
import { formatDate } from "@/utils";
import { Icon } from "@/components/common";

const SimilarItemsList = ({ data }: { data: SimilarDataItem[] }) => {
  return (
    <ul
      tabIndex={0}
      className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
    >
      {data.map((item) => (
        <SimilarItem key={item.postId} data={item} />
      ))}
    </ul>
  );
};

export default SimilarItemsList;

interface SimilarItemProps {
  data: SimilarDataItem;
}

const SimilarItem = ({ data }: SimilarItemProps) => {
  const { title, thumbnailImageUrl, createdAt, postId } = data;

  return (
    <li className="snap-start">
      <Link
        href={`/list/${postId}`}
        className="flex h-[120px] w-[124px] flex-col overflow-hidden rounded-[16px] border border-divider-default bg-white"
      >
        <div className="flex h-[76px] w-[124px] items-center justify-center bg-fill-neutralInversed-normal-preesed">
          {thumbnailImageUrl ? (
            <Image
              src={thumbnailImageUrl}
              alt={title}
              width={124}
              height={76}
              className="h-[76px] w-[124px] object-cover"
            />
          ) : (
            <Icon name="LogoCharacter" size={65} data-testid="icon-LogoCharacter" />
          )}
        </div>

        <div className="flex flex-col gap-1 px-3 pb-2 pt-[6px]">
          <p className="text-caption1-semibold text-layout-header-default u-ellipsis">{title}</p>

          <time dateTime={createdAt} className="text-caption2-regular text-layout-body-default">
            {formatDate(createdAt)}
          </time>
        </div>
      </Link>
    </li>
  );
};
