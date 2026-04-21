import { Meta, StoryObj } from "@storybook/nextjs";
import ErrorState from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "State 컴포넌트/ErrorState",
  component: ErrorState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: { iconName: "Error", iconSize: 30 },
  },
};

export const WithDescription: Story = {
  args: {
    icon: { iconName: "Error", iconSize: 30 },
    description: "잠시 후 다시 시도해 주세요.",
  },
};

export const WithChildren: Story = {
  args: {
    icon: { iconName: "Error", iconSize: 30 },
    description: "잠시 후 다시 시도해 주세요.",
  },
  render: (args) => (
    <ErrorState {...args}>
      <button className="text-primary text-body2-regular underline">다시 시도하기</button>
    </ErrorState>
  ),
};

export const CustomIcon: Story = {
  args: {
    icon: { iconName: "NoReports", iconClass: "text-error", iconSize: 40 },
    title: "권한이 없습니다.",
    description: "해당 페이지에 접근할 권한이 없어요.",
  },
};
