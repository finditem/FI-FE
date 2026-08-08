import type { Meta, StoryObj } from "@storybook/nextjs";
import ManualList from "./ManualList";

const meta: Meta<typeof ManualList> = {
  title: "페이지/매뉴얼 페이지/ManualList",
  component: ManualList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "매뉴얼 페이지 리스트 컴포넌트",
      },
    },
  },

  decorators: [
    (Story) => (
      <div style={{ width: "386px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ManualList>;

export const Default: Story = {
  args: {
    openIndex: null,
    setOpenIndex: () => {},
    selected: "LOST",
  },
};
