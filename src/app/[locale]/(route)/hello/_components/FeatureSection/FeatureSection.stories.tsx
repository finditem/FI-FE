import type { Meta, StoryObj } from "@storybook/nextjs";
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
    content: {
      title: "분실물 찾기, 더 쉽고 빠르게",
      description:
        "물건을 잃어버렸을 때, 어떻게 찾아야 할지 막막할때가 있죠. '찾아줘!'는 그런 순간에 함께하는 실시간 위치 기반 분실물 찾기 플랫폼입니다.",
    },
    imageSlot: <HeroSection />,
  },
};

export const Highlight: Story = {
  args: {
    content: {
      title: "카테고리 알림으로 신규 게시글 확인",
      description:
        "알림을 받고 싶은 분실물 카테고리 키워드를 등록하면, 해당 게시글이 등록됐을 때 알림을 전송해요.",
    },
    variant: "highlight",
    imageSlot: <FourthSection />,
  },
};

export const HighlightWithImageSize: Story = {
  args: {
    content: {
      title: "지역, 카테고리별 분실물 제보 확인",
      description:
        "분실 지역, 물건 카테고리 별로 분실물 제보를 확인하고 편리하게 유실물을 찾아보세요.",
    },
    variant: "highlight",
    imageSlot: <SecondSection />,
  },
};
