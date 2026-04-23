import Image from "next/image";
import { cn } from "@/utils";
import { CategoryType } from "@/types";
import Icon, { IconName } from "../Icon/Icon";

/**
 * 리스트 아이템 이미지 컴포넌트입니다.
 *
 * @remarks
 * - `src`와 `category` 모두 없으면 렌더링하지 않습니다.
 * - `src`가 없으면 `category`에 해당하는 기본 아이콘을 표시합니다.
 *
 * @author jikwon
 */

interface ListItemImageProps {
  /** 이미지 URL. `null`이면 카테고리 아이콘으로 대체됩니다. */
  src?: string | null;
  /** 이미지 대체 텍스트 */
  alt: string;
  /** 이미지 크기(px) */
  size: number;
  /** LCP 대상 여부. 헤더 등 주요 위치에서만 `true`로 설정합니다. (default: false) */
  priority?: boolean;
  /** 추가 클래스 (div 태그에 적용) */
  className?: string;
  /** 이미지 장 수. 2장 이상일 때만 뱃지로 표시됩니다. */
  imageCount?: number;
  /** 이미지 없을 때 표시할 카테고리 아이콘 종류 */
  category?: CategoryType;
}

/**
 * @example
 * ```tsx
 * <ListItemImage src="https://..." alt="게시글 이미지" size={80} />
 * <ListItemImage src={null} alt="기본 이미지" size={80} category="ELECTRONICS" />
 * <ListItemImage src="https://..." alt="이미지" size={80} imageCount={3} priority />
 * ```
 */

const CATEGORY_ICON_MAP: Record<CategoryType, IconName> = {
  ELECTRONICS: "Electronics",
  WALLET: "Wallet",
  ID_CARD: "IdCard",
  JEWELRY: "Jewelry",
  BAG: "Bag",
  CARD: "Card",
  ETC: "Etc",
};

const ListItemImage = ({
  src,
  alt,
  size,
  priority = false,
  className,
  imageCount,
  category,
}: ListItemImageProps) => {
  if (!src && !category) return null;

  return (
    <div
      className={cn("relative overflow-hidden rounded-[10px]", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          draggable={false}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full flex-center" aria-label={`${category ?? "ETC"} 기본 이미지`}>
          <Icon
            name={CATEGORY_ICON_MAP[category!]}
            size={size}
            className="text-labelsVibrant-quaternary"
          />
        </div>
      )}

      {typeof imageCount === "number" && imageCount > 1 && (
        <div
          aria-label={`이미지 ${imageCount}장`}
          className={cn(
            "absolute bottom-0 right-0 min-h-[21px] min-w-[23px]",
            "rounded-br-[10px] rounded-tl-[4px] bg-black/50 px-2 py-1 flex-center"
          )}
        >
          <span className="text-caption2-medium text-white">{imageCount}</span>
        </div>
      )}
    </div>
  );
};

export default ListItemImage;
