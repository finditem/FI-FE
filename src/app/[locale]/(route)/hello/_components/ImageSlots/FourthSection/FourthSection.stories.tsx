import { Meta, StoryObj } from "@storybook/nextjs";
import FourthSection from "./FourthSection";

const meta: Meta<typeof FourthSection> = {
  title: "페이지/서비스 소개 페이지/ImageSlots/FourthSection",
  component: FourthSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "서비스 소개 페이지 네번째 섹션 FourthSection 컴포넌트",
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
