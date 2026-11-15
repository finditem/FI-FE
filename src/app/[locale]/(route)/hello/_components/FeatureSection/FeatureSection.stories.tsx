import type { Meta, StoryObj } from "@storybook/nextjs";
import { MOCK_FEATURE_SECTION_CONTENTS } from "@/mock/data";
import FeatureSection from "./FeatureSection";
import { FourthSection, HeroSection, SecondSection } from "../ImageSlots";

const meta: Meta<typeof FeatureSection> = {
  title: "페이지/서비스 소개 페이지/FeatureSection",
  component: FeatureSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "서비스 소개 페이지의 기능 소개 영역 컴포넌트입니다. 이미지와 텍스트를 함께 표시합니다.",
      },
    },
  },
  args: {
    content: {
      title: "기능 설명 제목",
      description: "이 기능은 다음과 같은 특징을 가지고 있습니다.",
    },
    variant: "default",
  },
  argTypes: {
    content: {
      control: "object",
    },
    variant: {
      control: { type: "radio" },
      options: ["default", "highlight"],
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
type Story = StoryObj<typeof FeatureSection>;

export const Default: Story = {
  args: {
    variant: "default",
    content: MOCK_FEATURE_SECTION_CONTENTS.hero,
    imageSlot: <HeroSection />,
  },
};

export const Highlight: Story = {
  args: {
    content: MOCK_FEATURE_SECTION_CONTENTS.categoryAlert,
    variant: "highlight",
    imageSlot: <FourthSection />,
  },
};

export const HighlightWithImageSize: Story = {
  args: {
    content: MOCK_FEATURE_SECTION_CONTENTS.regionCategory,
    variant: "highlight",
    imageSlot: <SecondSection />,
  },
};
