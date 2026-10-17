import type { Meta, StoryObj } from "@storybook/nextjs";
import ReviewDetailHeader from "./ReviewDetailHeader";

/** 흰색 뒤로가기 아이콘과 제목으로 구성된 후기 편지 상세 헤더. 초록 히어로 위에 올라간다. */
const meta: Meta<typeof ReviewDetailHeader> = {
  title: "페이지/마이페이지/찾길 후기 편지 페이지/ReviewDetailHeader",
  component: ReviewDetailHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-[#4ccd99]">
        <Story />
      </div>
    ),
  ],
  args: { title: "찾길 후기", backAriaLabel: "뒤로 가기" },
};

export default meta;

type Story = StoryObj<typeof ReviewDetailHeader>;

export const Default: Story = {};
