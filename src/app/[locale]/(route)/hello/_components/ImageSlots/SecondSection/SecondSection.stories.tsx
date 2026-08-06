import { Meta, StoryObj } from "@storybook/nextjs";
import SecondSection from "./SecondSection";

const meta: Meta<typeof SecondSection> = {
  title: "페이지/서비스 소개 페이지/ImageSlots/SecondSection",
  component: SecondSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "서비스 소개 페이지 두번째 섹션 SecondSection 컴포넌트",
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
