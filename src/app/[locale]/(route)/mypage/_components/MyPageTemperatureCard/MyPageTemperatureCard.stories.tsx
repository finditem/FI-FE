import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPageTemperatureCard from "./MyPageTemperatureCard";

const meta: Meta<typeof MyPageTemperatureCard> = {
  title: "페이지/마이페이지/MyPageTemperatureCard",
  component: MyPageTemperatureCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px] bg-layout_2depth p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyPageTemperatureCard>;

/** 36.5도 미만: 회색 수치와 막대 */
export const Low: Story = { args: { temperature: 31.2 } };

/** 가입 직후 첫 온도 */
export const First: Story = { args: { temperature: 36.5 } };

/** 36.6~50도 */
export const Rising: Story = { args: { temperature: 46.5 } };

/** 50.1~69.9도 */
export const Good: Story = { args: { temperature: 67.5 } };

/** 70~98.9도 */
export const Trusted: Story = { args: { temperature: 84 } };

/** 99도: 막대 끝 손잡이를 숨긴다 */
export const Max: Story = { args: { temperature: 99 } };
