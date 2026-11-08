import { Meta, StoryObj } from "@storybook/nextjs";
import ManualPopup from "./ManualPopup";

const meta: Meta<typeof ManualPopup> = {
  title: "공통 컴포넌트/ManualPopup",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  component: ManualPopup,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ManualPopupStory: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
