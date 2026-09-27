import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider } from "@/providers/ToastProviders";
import BaseNaverMap from "./BaseNaverMap";

const meta: Meta<typeof BaseNaverMap> = {
  title: "공통 컴포넌트 도메인/BaseNaverMap",
  component: BaseNaverMap,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ width: "100%", height: "400px" }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BaseNaverMap>;

export const Default: Story = {
  args: {
    center: { lat: 37.544583, lng: 127.055972 },
    zoom: 14,
    draggable: true,
  },
};

export const WithCenterMarker: Story = {
  args: {
    ...Default.args,
    showCenterMarker: true,
  },
};

export const WithCircle: Story = {
  args: {
    ...Default.args,
    showCenterMarker: true,
    showCircle: true,
    radius: 1000,
  },
};
