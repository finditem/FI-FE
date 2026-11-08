import type { Meta, StoryObj } from "@storybook/nextjs";
import CTASection from "./CTASection";

const meta: Meta<typeof CTASection> = {
  title: "페이지/서비스 소개 페이지/CTASection",
  component: CTASection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "서비스 소개 페이지의 CTA 영역 컴포넌트입니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "386px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {
  args: {},
};
