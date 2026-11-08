import type { Meta, StoryObj } from "@storybook/nextjs";
import ReviewsContainer from "./ReviewsContainer";

/**
 * 탭 상태는 쿼리스트링(`?tab=`)과 동기화됩니다. Storybook의 `next/navigation` 목은 빈
 * 쿼리를 반환하므로 기본 탭(받은 후기)이 선택된 상태로 렌더됩니다.
 */
const meta: Meta<typeof ReviewsContainer> = {
  title: "페이지/마이페이지/찾길 후기 페이지/ReviewsContainer",
  component: ReviewsContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ReviewsContainer>;

export const Default: Story = {};
