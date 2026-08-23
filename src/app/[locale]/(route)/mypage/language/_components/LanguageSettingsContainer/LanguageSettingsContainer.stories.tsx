import type { Meta, StoryObj } from "@storybook/nextjs";
import LanguageSettingsContainer from "./LanguageSettingsContainer";

const meta: Meta<typeof LanguageSettingsContainer> = {
  title: "페이지/마이페이지/언어 설정 페이지/LanguageSettingsContainer",
  component: LanguageSettingsContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] w-[390px] flex-col border border-gray-200">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LanguageSettingsContainer>;

export const Default: Story = {};
