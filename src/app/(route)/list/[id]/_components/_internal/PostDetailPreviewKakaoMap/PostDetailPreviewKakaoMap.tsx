import Link from "next/link";
import { Icon } from "@/components/common";
import { BaseKakaoMap } from "@/components/domain";
import { cn } from "@/utils";

type MapData = {
  address: string;
  latitude: number;
  longitude: number;
  postId: string;
  radius: number;
};

interface PostDetailPreviewKakaoMapProps {
  data: MapData;
}

const PostDetailPreviewKakaoMap = ({ data }: PostDetailPreviewKakaoMapProps) => {
  const { address, latitude, longitude, postId, radius } = data;

  return (
    <div className="flex flex-col gap-[18px]">
      <div
        className={cn(
          "h-[147px] overflow-hidden rounded-md border border-divider-default",
          "tablet:h-[200px]"
        )}
      >
        <BaseKakaoMap center={{ lat: latitude, lng: longitude }} level={7} showCenterMarker />
      </div>

      <Link
        aria-label="지도에서 위치 자세히 보기"
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
              {address || "위치 정보가 없어요"}
            </p>
          </span>
          {address && <Icon name="ArrowRight" size={14} />}
        </address>
      </Link>
    </div>
  );
};

export default PostDetailPreviewKakaoMap;
