import { Meta, StoryObj } from "@storybook/nextjs";
import PostDetailKakaoMap from "./PostDetailKakaoMap";

const meta: Meta<typeof PostDetailKakaoMap> = {
  title: "페이지/상세 페이지/PostDetailKakaoMap",
  component: PostDetailKakaoMap,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "100dvh" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        searchParams: {
          lat: "37.5665",
          lng: "126.9780",
          radius: "1000",
          address: "서울특별시 마포구 양화로 160",
        },
      },
    },
  },
};

export const NoParams: Story = {
  parameters: {
    nextjs: {
      navigation: {
        searchParams: {},
      },
    },
  },
};

export const LargeRadius: Story = {
  parameters: {
    nextjs: {
      navigation: {
        searchParams: {
          lat: "37.5665",
          lng: "126.9780",
          radius: "5000",
          address: "서울특별시 강남구 테헤란로 427",
        },
      },
    },
  },
};
