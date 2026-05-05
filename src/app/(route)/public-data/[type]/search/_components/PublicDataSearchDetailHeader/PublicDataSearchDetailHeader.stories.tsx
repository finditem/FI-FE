import type { Meta, StoryObj } from "@storybook/nextjs";
import PublicDataSearchDetailHeader from "./PublicDataSearchDetailHeader";

const meta: Meta<typeof PublicDataSearchDetailHeader> = {
  title: "페이지/공공데이터/검색/PublicDataSearchDetailHeader",
  component: PublicDataSearchDetailHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "공공데이터 검색 페이지 헤더입니다. URL params의 type(lost | found)에 따라 '분실물 검색' 또는 '습득물 검색'을 표시합니다.",
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        params: { type: "lost" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PublicDataSearchDetailHeader>;

export const Lost: Story = {};

export const Found: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        params: { type: "found" },
      },
    },
  },
};
