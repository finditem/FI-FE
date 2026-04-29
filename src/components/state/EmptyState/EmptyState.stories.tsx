import { Meta, StoryObj } from "@storybook/nextjs";
import EmptyState from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "State 컴포넌트/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: { iconName: "EmptyPostSearch", iconSize: 50 },
    title: "데이터가 없습니다.",
    description: "아직 등록된 데이터가 없어요.",
  },
};

export const WithoutDescription: Story = {
  args: {
    icon: { iconName: "EmptyPostSearch", iconSize: 50 },
    title: "데이터가 없습니다.",
  },
};

export const IconOnly: Story = {
  args: {
    icon: { iconName: "EmptyPostSearch", iconSize: 50 },
  },
};

export const MultiLineDescription: Story = {
  args: {
    icon: { iconName: "EmptyPostSearch", iconSize: 50 },
    title: "검색 결과가 없습니다.",
    description: "검색어를 다시 확인하거나\n다른 키워드로 검색해 보세요.",
  },
};
