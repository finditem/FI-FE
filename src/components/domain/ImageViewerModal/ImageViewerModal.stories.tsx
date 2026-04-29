import { Meta, StoryObj } from "@storybook/nextjs";
import ImageViewerModal from "./ImageViewerModal";

const sampleImages = [
  "https://picsum.photos/id/101/1200/900",
  "https://picsum.photos/id/102/1200/900",
  "https://picsum.photos/id/103/1200/900",
];

const meta: Meta<typeof ImageViewerModal> = {
  title: "공통 컴포넌트/ImageViewerModal",
  component: ImageViewerModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    images: sampleImages,
    initialIndex: 0,
    isOpen: true,
    onClose: () => {},
    imageInfo: {
      uploader: "스토리북 사용자",
      createdAt: "2026-04-25T12:00:00.000Z",
    },
  },
};

export const Closed: Story = {
  args: {
    images: sampleImages,
    initialIndex: 0,
    isOpen: false,
    onClose: () => {},
  },
};

export const WithoutImageInfo: Story = {
  args: {
    images: sampleImages,
    initialIndex: 1,
    isOpen: true,
    onClose: () => {},
  },
};
