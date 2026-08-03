import { Meta, StoryObj } from "@storybook/nextjs";
import UserHeader from "./UserHeader";
import { MOCK_USER_PROFILE } from "@/mock/data";

const meta: Meta<typeof UserHeader> = {
  title: "페이지/타인 페이지/UserHeader",
  component: UserHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] shadow-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: MOCK_USER_PROFILE,
  },
};
