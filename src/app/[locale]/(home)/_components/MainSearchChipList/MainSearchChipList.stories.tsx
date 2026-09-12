import type { Meta, StoryObj } from "@storybook/nextjs";
import MainSearchChipList from "./MainSearchChipList";

const meta: Meta<typeof MainSearchChipList> = {
  title: "페이지/메인 페이지/MainSearchChipList",
  component: MainSearchChipList,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/", searchParams: {} },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] bg-flatGray-50 px-5 py-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainSearchChipList>;

export const Default: Story = {};

export const PopupSelected: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: "/", searchParams: { place: "popup" } },
    },
  },
};
