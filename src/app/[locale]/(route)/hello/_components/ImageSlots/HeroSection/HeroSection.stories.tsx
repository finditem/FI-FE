import { Meta, StoryObj } from "@storybook/nextjs";
import HeroSection from "./HeroSection";

const meta: Meta<typeof HeroSection> = {
  title: "페이지/서비스 소개 페이지/ImageSlots/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "서비스 소개 페이지 메인 섹션 HeroSection 컴포넌트",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[386px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
