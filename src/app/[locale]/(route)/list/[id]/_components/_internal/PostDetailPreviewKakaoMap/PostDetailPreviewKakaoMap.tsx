import { useTranslations } from "next-intl";
import Link from "next/link";
import { Icon, BaseKakaoMap } from "@/components";
import type { PostType } from "@/types";
import { cn } from "@/utils";
import { parseDateString } from "@/utils/formatDate/parseDateString/parseDateString";

type MapData = {
  address: string;
  latitude: number;
  longitude: number;
  postId: string;
  radius: number;
  /** 분실 또는 습득 일시 */
  date: string;
  postType: PostType;
};

/** 분실일과 습득일은 시각 없이 날짜만 보여준다. */
const formatEventDate = (isoString: string) => {
  const target = parseDateString(isoString);
  if (!target) {
    return "";
  }

  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");

  return `${target.getFullYear()}.${month}.${day}`;
};

interface PostDetailPreviewKakaoMapProps {
  data: MapData;
}

const PostDetailPreviewKakaoMap = ({ data }: PostDetailPreviewKakaoMapProps) => {
  const t = useTranslations("PostDetailPreviewKakaoMap");
  const { address, latitude, longitude, postId, radius, date, postType } = data;
  const eventDate = formatEventDate(date);
  const isLost = postType === "LOST";

  return (
    <div className="flex flex-col gap-[18px]">
      <div className="rounded-md border border-divider-default">
        <div className={cn("h-[147px] overflow-hidden", "tablet:h-[200px]")}>
          <BaseKakaoMap center={{ lat: latitude, lng: longitude }} level={7} showCenterMarker />
        </div>

        <Link
          aria-label={t("viewOnMapAriaLabel")}
          href={`/list/${postId}/map?lat=${latitude}&lng=${longitude}&address=${encodeURIComponent(address)}&radius=${radius}`}
        >
          <address className="flex items-center gap-1.5 px-2 py-[14px] not-italic">
            <div className="flex flex-1 items-center justify-between gap-[5px]">
              {address && (
                <div className="flex items-center gap-1">
                  <Icon
                    name="PositionOutlined"
                    size={16}
                    aria-hidden="true"
                    className="text-brand-normal-default"
                  />
                  <span className="text-body2-medium text-layout-body-default">
                    {t(isLost ? "lostLocationLabel" : "foundLocationLabel")}
                  </span>
                </div>
              )}
              <p className="text-body2-semibold text-neutral-normal-default">
                {address || t("noAddress")}
              </p>
            </div>
            {address && <Icon name="ArrowRight" size={14} />}
          </address>
        </Link>

        <div className="flex items-center justify-between px-2 py-[14px]">
          <div className="flex items-center gap-1.5">
            <Icon
              name="Calendar"
              size={16}
              aria-hidden="true"
              className="text-brand-normal-default"
            />
            <span className="text-body2-medium text-layout-body-default">
              {t(isLost ? "dateLostLabel" : "dateFoundLabel")}
            </span>
          </div>

          <time dateTime={date} className="text-body2-semibold">
            {eventDate}
          </time>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPreviewKakaoMap;
