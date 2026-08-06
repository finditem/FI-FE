import { Meta, StoryObj } from "@storybook/nextjs";
import LocationSection from "./LocationSection";

const meta: Meta<typeof LocationSection> = {
  title: "페이지/글쓰기/LocationSection",
  component: LocationSection,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
