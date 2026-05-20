import { Chip } from "@/components/common";
import { CategoryType, ItemStatus } from "@/types";
import { getItemCategoryLabel, getItemStatusLabel } from "@/utils";

interface PostChipSectionProps {
  chipData: {
    postStatus: ItemStatus;
    category: CategoryType;
  };
}

const PostChipSection = ({ chipData }: PostChipSectionProps) => {
  const { postStatus, category } = chipData;

  return (
    <div className="flex gap-2">
      <Chip
        type={postStatus === "FOUND" ? "toast" : "brandSubtle"}
        label={getItemStatusLabel(postStatus)}
      />
      <Chip type="neutralStrong" label={getItemCategoryLabel(category)} />
    </div>
  );
};

export default PostChipSection;
