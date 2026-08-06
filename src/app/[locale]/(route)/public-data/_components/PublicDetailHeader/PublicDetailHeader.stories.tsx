import type { Meta, StoryObj } from "@storybook/nextjs";
import PublicDetailHeader from "./PublicDetailHeader";

const meta: Meta<typeof PublicDetailHeader> = {
  title: "페이지/공공데이터/PublicDetailHeader",
  component: PublicDetailHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "공공데이터 상세 페이지 헤더입니다. police24 로고와 검색 버튼을 포함하며, type 쿼리 파라미터(lost | found)에 따라 검색 경로가 달라집니다.",
      },
    },
    nextjs: {
      navigation: {
        pathname: "/public-data/lost/detail",
        query: { type: "lost" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PublicDetailHeader>;

export const Lost: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/public-data/lost/detail",
        query: { type: "lost" },
      },
    },
    docs: {
      description: {
        story: "type=lost일 때 — 검색 클릭 시 /public-data/lost/search로 이동합니다.",
      },
    },
  },
};

export const Found: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/public-data/found/detail",
        query: { type: "found" },
      },
    },
    docs: {
      description: {
        story: "type=found일 때 — 검색 클릭 시 /public-data/found/search로 이동합니다.",
      },
    },
  },
};
