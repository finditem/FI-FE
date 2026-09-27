import { useTranslations } from "next-intl";
import Link from "next/link";
import { Icon, BaseNaverMap } from "@/components";
import { cn } from "@/utils";

type MapData = {
  address: string;
  latitude: number;
  longitude: number;
  postId: string;
  radius: number;
};

interface PostDetailPreviewNaverMapProps {
  data: MapData;
}

const PostDetailPreviewNaverMap = ({ data }: PostDetailPreviewNaverMapProps) => {
  const t = useTranslations("PostDetailPreviewNaverMap");
  const { address, latitude, longitude, postId, radius } = data;

  return (
    <div className="flex flex-col gap-[18px]">
      <div
        className={cn(
          "h-[147px] overflow-hidden rounded-md border border-divider-default",
          "tablet:h-[200px]"
        )}
      >
        <BaseNaverMap center={{ lat: latitude, lng: longitude }} zoom={13} showCenterMarker />
      </div>

      <Link
        aria-label={t("viewOnMapAriaLabel")}
        href={`/list/${postId}/map?lat=${latitude}&lng=${longitude}&address=${encodeURIComponent(address)}&radius=${radius}`}
      >
        <address className="flex items-center gap-[6px] not-italic">
          <span className="flex items-center gap-[5px]">
            {address && (
              <Icon
                name="Position"
                size={16}
                aria-hidden="true"
                className="text-brand-normal-default"
              />
            )}
            <p className="text-body2-medium text-neutral-normal-default">
              {address || t("noAddress")}
            </p>
          </span>
          {address && <Icon name="ArrowRight" size={14} />}
        </address>
      </Link>
    </div>
  );
};

export default PostDetailPreviewNaverMap;
