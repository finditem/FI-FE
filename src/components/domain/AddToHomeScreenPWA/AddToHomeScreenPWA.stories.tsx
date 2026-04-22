import type { Meta, StoryObj } from "@storybook/react";
import AddToHomeScreenPWA from "./AddToHomeScreenPWA";
import { PWAProvider } from "@/providers/PWAProvider";

const meta: Meta<typeof AddToHomeScreenPWA> = {
  title: "공통 컴포넌트/AddToHomeScreenPWA",
  component: AddToHomeScreenPWA,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <PWAProvider>
        <div className="w-[400px]">
          <Story />
        </div>
      </PWAProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof AddToHomeScreenPWA>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};
