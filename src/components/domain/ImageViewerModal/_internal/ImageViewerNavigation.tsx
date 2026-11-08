import { useTranslations } from "next-intl";
import { Icon } from "@/components/common";

interface ImageViewerNavigationProps {
  handlePrev: () => void;
  handleNext: () => void;
  imagesLength: number;
}

const ImageViewerNavigation = ({
  handlePrev,
  handleNext,
  imagesLength,
}: ImageViewerNavigationProps) => {
  const t = useTranslations("ImageViewerModal");
  if (imagesLength <= 1) return null;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-5 z-10 text-white"
        aria-label={t("prevAriaLabel")}
      >
        <Icon name="ArrowLeftSmall" size={36} className="text-white" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-5 z-10 text-white"
        aria-label={t("nextAriaLabel")}
      >
        <Icon name="ArrowRightSmall" size={36} className="text-white" />
      </button>
    </>
  );
};

export default ImageViewerNavigation;
