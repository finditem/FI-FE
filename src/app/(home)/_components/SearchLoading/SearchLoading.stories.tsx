import type { Meta, StoryObj } from "@storybook/nextjs";
import SearchLoading from "./SearchLoading";

const meta: Meta<typeof SearchLoading> = {
  title: "페이지/메인/SearchLoading",
  component: SearchLoading,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-[240px] w-full max-w-[430px] border border-divider-default">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchLoading>;

export const Default: Story = {};
