import type { Meta, StoryObj } from "@storybook/react";
import GuestLoginModal from "./GuestLoginModal";

const meta: Meta<typeof GuestLoginModal> = {
  title: "공통 컴포넌트 도메인/GuestLoginModal",
  component: GuestLoginModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof GuestLoginModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("모달 닫기"),
  },
};
