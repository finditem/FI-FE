import type { Meta, StoryObj } from "@storybook/nextjs";
import MainSearchLayout from "./MainSearchLayout";

const meta: Meta<typeof MainSearchLayout> = {
  title: "페이지/메인 페이지/MainSearchLayout",
  component: MainSearchLayout,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="relative h-[200px] w-full max-w-[768px] border border-divider-default">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainSearchLayout>;

export const Collapsed: Story = {
  args: {
    focused: false,
    children: (
      <p className="text-body2-medium text-layout-body-default">검색 헤더 영역 (비포커스)</p>
    ),
  },
};

export const Focused: Story = {
  args: {
    focused: true,
    children: (
      <p className="text-body2-medium text-layout-body-default">검색 결과 오버레이 (포커스)</p>
    ),
  },
};
