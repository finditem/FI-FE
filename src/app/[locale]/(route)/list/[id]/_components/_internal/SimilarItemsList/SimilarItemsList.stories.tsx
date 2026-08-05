import { Meta, StoryObj } from "@storybook/nextjs";
import SimilarItemList from "./SimilarItemsList";
import { MOCK_SIMILAR_POST_ITEMS } from "@/mock/data";

const meta: Meta<typeof SimilarItemList> = {
  title: "페이지/상세 페이지/SimilarItemList",
  component: SimilarItemList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    data: [MOCK_SIMILAR_POST_ITEMS],
  },
  decorators: [
    (Story) => (
      <div className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
