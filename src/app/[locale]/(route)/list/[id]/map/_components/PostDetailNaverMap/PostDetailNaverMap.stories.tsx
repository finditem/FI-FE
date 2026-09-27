import { Meta, StoryObj } from "@storybook/nextjs";
import { ToastProvider } from "@/providers/ToastProviders";
import PostDetailNaverMap from "./PostDetailNaverMap";

const meta: Meta<typeof PostDetailNaverMap> = {
  title: "페이지/상세 페이지/PostDetailNaverMap",
  component: PostDetailNaverMap,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ width: "100%", height: "100dvh" }}>
          <Story />
        </div>
      </ToastProvider>
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
