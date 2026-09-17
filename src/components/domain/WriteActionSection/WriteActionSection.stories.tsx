import { Meta, StoryObj } from "@storybook/nextjs";
import WriteActionSection from "./WriteActionSection";

const meta: Meta<typeof WriteActionSection> = {
  title: "공통 컴포넌트/WriteActionSection",
  component: WriteActionSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <form onSubmit={() => {}} className="w-[390px]">
        <Story />
      </form>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const RateLimitCountdown: Story = {
  args: {
    disabled: true,
    label: "180초 후 다시 시도",
    isRateLimited: true,
  },
};
