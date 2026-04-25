import type { Meta, StoryObj } from "@storybook/react";
import BaseKakaoMap from "./BaseKakaoMap";

const meta: Meta<typeof BaseKakaoMap> = {
  title: "공통 컴포넌트 도메인/BaseKakaoMap",
  component: BaseKakaoMap,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof BaseKakaoMap>;

export const Default: Story = {
  args: {
    center: { lat: 37.5665, lng: 126.978 },
    level: 6,
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
