import type { Meta, StoryObj } from "@storybook/nextjs";
import ReviewsContent from "./ReviewsContent";

const meta: Meta<typeof ReviewsContent> = {
  title: "페이지/마이페이지/찾길 후기 페이지/ReviewsContent",
  component: ReviewsContent,
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

type Story = StoryObj<typeof ReviewsContent>;

export const Received: Story = {
  args: { selectedTab: "received" },
};

export const SentEmpty: Story = {
  args: { selectedTab: "sent" },
};

export const HiddenEmpty: Story = {
  args: { selectedTab: "hidden" },
};
