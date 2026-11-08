import type { Meta, StoryObj } from "@storybook/nextjs";
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

export const WithPostMarkers: Story = {
  args: {
    ...Default.args,
    markerData: [
      {
        postId: 1,
        latitude: 37.5446,
        longitude: 127.0557,
        postType: "LOST",
        category: "WALLET",
        postStatus: "SEARCHING",
      },
      {
        postId: 2,
        latitude: 37.5471,
        longitude: 127.0474,
        postType: "FOUND",
        category: "WALLET",
        postStatus: "SEARCHING",
      },
      {
        postId: 3,
        latitude: 37.5412,
        longitude: 127.0593,
        postType: "LOST",
        category: "WALLET",
        postStatus: "SEARCHING",
      },
    ],
  },
};

export const WithPlaceMarkers: Story = {
  args: {
    ...Default.args,
    placeMarkerData: [
      {
        placeId: 1,
        latitude: 37.5446,
        longitude: 127.0557,
        type: "POPUP",
        thumbnailUrl: "/pwa/icon-192.png",
      },
      {
        placeId: 2,
        latitude: 37.5471,
        longitude: 127.0474,
        type: "CAFE",
        thumbnailUrl: "/pwa/icon-192.png",
      },
    ],
    selectedPlaceId: 1,
    showCircle: true,
    radius: 500,
    innerRadius: 250,
    circleCenter: { lat: 37.5446, lng: 127.0557 },
  },
};

export const WithUserLocation: Story = {
  args: {
    ...Default.args,
    userLocation: { lat: 37.544583, lng: 127.055972 },
    userHeading: 45,
  },
};
