import type { Meta, StoryObj } from "@storybook/nextjs";
import AdminFilter from "./AdminFilter";

const meta: Meta<typeof AdminFilter> = {
  title: "관리자 공통 컴포넌트/AdminFilter",
  component: AdminFilter,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "상세 페이지 공통 헤더 컴포넌트",
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
    filters: [
      {
        label: "전체",
        onSelected: true,
        icon: {
          name: "ArrowDown",
          size: 16,
        },
        iconPosition: "trailing",
        onClick: () => {},
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof AdminFilter>;

export const Default: Story = {};
export const WithTrailingIcon: Story = {
  args: {
    filters: [
      {
        label: "전체",
        onSelected: true,
        icon: {
          name: "ArrowDown",
          size: 16,
        },
        iconPosition: "trailing",
        onClick: () => {},
      },
    ],
  },
};
