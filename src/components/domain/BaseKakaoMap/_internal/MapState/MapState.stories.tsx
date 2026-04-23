import type { Meta, StoryObj } from "@storybook/react";
import { MapLoadingState, MapErrorState } from "./MapState";

const meta: Meta = {
  title: "공통 컴포넌트 도메인/BaseKakaoMap/MapState",
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

export const Loading: StoryObj<typeof MapLoadingState> = {
  render: () => <MapLoadingState />,
};

export const Error: StoryObj<typeof MapErrorState> = {
  render: () => <MapErrorState />,
};
