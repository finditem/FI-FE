import type { Meta, StoryObj } from "@storybook/nextjs";
import MyPageProfile from "./MyPageProfile";

const meta: Meta<typeof MyPageProfile> = {
  title: "페이지/마이페이지/MyPageProfile",
  component: MyPageProfile,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen w-[390px] items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MyPageProfile>;

export const Default: Story = {
  args: {
    userData: {
      nickname: "제미니",
      email: "gemini@example.comㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹ",
    },
  },
};
