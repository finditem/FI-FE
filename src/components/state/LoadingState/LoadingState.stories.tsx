import { Meta, StoryObj } from "@storybook/nextjs";
import LoadingState from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "State 컴포넌트/LoadingState",
  component: LoadingState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomTitle: Story = {
  args: {
    title: "데이터를 불러오는 중...",
  },
};
