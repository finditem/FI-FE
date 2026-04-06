import type { Meta, StoryObj } from "@storybook/react";
import ActivityFilterSection from "./ActivityFilterSection";

const meta: Meta<typeof ActivityFilterSection> = {
  title: "Domain/Activity/ActivityFilterSection",
  component: ActivityFilterSection,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[430px] border-b border-divider-default bg-white">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      // useSearchParams 등을 내부에서 사용할 경우 가상의 URL 설정
      navigation: {
        pathname: "/activity",
        query: {
          activity: "RUNNING",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFilterSection>;

/**
 * 1. 기본 상태
 * 초기 진입 시 아무런 필터가 적용되지 않은 상태입니다.
 */
export const Default: Story = {};

/**
 * 2. 특정 필터가 활성화된 시뮬레이션
 * URL Params나 커스텀 훅의 반환값에 따라
 * 필터 버튼의 색상이 변하는지(onSelected) 확인하기 좋습니다.
 */
export const ActiveFilter: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: {
          startDate: "2024-01-01",
          endDate: "2024-01-31",
          activity: "CLIMBING",
        },
      },
    },
  },
};
