import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminSearch from "./AdminSearch";

const meta: Meta<typeof AdminSearch> = {
  title: "관리자 공통 컴포넌트/AdminSearch",
  component: AdminSearch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "관리자 검색 공통 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] border">
        <Story />
      </div>
    ),
  ],
  args: {
    placeholder: "text",
    onEnter: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AdminSearch>;

export const Default: Story = {};
