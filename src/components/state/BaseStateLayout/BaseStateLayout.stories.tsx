import { Meta, StoryObj } from "@storybook/nextjs";
import BaseStateLayout from "./BaseStateLayout";

const meta: Meta<typeof BaseStateLayout> = {
  title: "State 컴포넌트/BaseStateLayout",
  component: BaseStateLayout,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p className="text-body2-regular text-layout-body-default">자식 요소가 들어갑니다.</p>
    ),
  },
};

export const WithClassName: Story = {
  args: {
    className: "bg-surface-default rounded-lg",
    children: (
      <p className="text-body2-regular text-layout-body-default">
        추가 클래스가 적용된 레이아웃입니다.
      </p>
    ),
  },
};
