import { Meta, StoryObj } from "@storybook/nextjs";
import ThirdSection from "./ThirdSection";

const meta: Meta<typeof ThirdSection> = {
  title: "페이지/서비스 소개 페이지/ImageSlots/ThirdSection",
  component: ThirdSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "서비스 소개 페이지 세번째 섹션 ThirdSection 컴포넌트",
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
