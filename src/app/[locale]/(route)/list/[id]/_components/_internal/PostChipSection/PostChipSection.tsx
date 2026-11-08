import { useTranslations } from "next-intl";
import { Chip } from "@/components";
import { CategoryType, ItemStatus } from "@/types";

interface PostChipSectionProps {
  chipData: {
    postStatus: ItemStatus;
    category: CategoryType;
  };
}

const PostChipSection = ({ chipData }: PostChipSectionProps) => {
  const t = useTranslations("FilterOptions");
  const { postStatus, category } = chipData;

  return (
    <div className="flex gap-2">
      <Chip
        type={postStatus === "FOUND" ? "toast" : "brandSubtle"}
        label={t(`findStatus.${postStatus}`)}
      />
      <Chip type="neutralStrong" label={t(`category.${category}`)} />
    </div>
  );
};

export default PostChipSection;
