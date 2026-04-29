import type { Meta, StoryObj } from "@storybook/nextjs";
import FooterButton from "./FooterButton";

const meta: Meta<typeof FooterButton> = {
  title: "공통/domain/FooterButton",
  component: FooterButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
type Story = StoryObj<typeof FooterButton>;

export const Default: Story = {
  args: {
    children: "완료",
  },
};

export const Disabled: Story = {
  args: {
    children: "완료",
    disabled: true,
  },
};
