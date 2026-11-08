import type { Meta, StoryObj } from "@storybook/nextjs";
import KakaoLoading from "./KakaoLoading";

const meta: Meta<typeof KakaoLoading> = {
  title: "페이지/카카오 로그인 페이지/KakaoLoading",
  component: KakaoLoading,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KakaoLoading>;

export const Default: Story = {};
